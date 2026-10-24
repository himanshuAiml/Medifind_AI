import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# 1. Load the .env file
load_dotenv()

# 2. Read DATABASE_URL into a variable
database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise SystemExit("DATABASE_URL is empty. Check that ml/.env is filled in and saved.")

# 3. Create the engine (it does not connect yet)
engine = create_engine(database_url)

# 4. Open a connection, run the query, take the single number
with engine.connect() as conn:
    row_count = conn.execute(text("select count(*) from stock_history")).scalar()

# 5. Print the number
print("Rows in stock_history:", row_count)


# 6. SQL query: join the 3 tables, pick only safe columns
query = """
select
    s.record_date,
    s.day_of_week,
    s.month,
    s.days_since_restock,
    m.popularity,
    m.is_chronic,
    m.is_seasonal,
    m.category,
    m.base_price,
    p.size,
    p.restock_day,
    s.in_stock
from stock_history s
join medicines m on s.medicine_id = m.id
join pharmacies p on s.pharmacy_id = p.id
"""

# 7. Load the result into a Pandas DataFrame
df = pd.read_sql(text(query), engine)
df["record_date"] = pd.to_datetime(df["record_date"])

# 8. Look at the data
print("Shape:", df.shape)
print(df.head())
print("In-stock rate:", df["in_stock"].mean())
print("Null counts:")
print(df.isna().sum())

# 9. Time-based split: last 65 days = test
cutoff = df["record_date"].max() - pd.Timedelta(days=65)
train = df[df["record_date"] <= cutoff]
test = df[df["record_date"] > cutoff]

print("Cutoff date:", cutoff.date())
print("Train shape:", train.shape)
print("Test shape:", test.shape)


from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score

# 10. Raw features (X) and label (y) - still plain text/numbers, no encoding yet
cat_cols = ["category", "size"]
num_cols = ["day_of_week", "month", "days_since_restock", "popularity",
            "is_chronic", "is_seasonal", "base_price", "restock_day"]

X = df[cat_cols + num_cols].copy()
X[["is_chronic", "is_seasonal"]] = X[["is_chronic", "is_seasonal"]].astype(int)
y = df["in_stock"].astype(int)

# 11. Split with the same time-based rows as before
X_train, y_train = X.loc[train.index], y.loc[train.index]
X_test, y_test = X.loc[test.index], y.loc[test.index]
print("X_train:", X_train.shape, "| X_test:", X_test.shape)


# 12. Preprocessing recipe: one-hot encode text columns (+ optionally scale numbers)
def make_preprocessor(scale=False):
    encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    if scale:
        return ColumnTransformer([
            ("cat", encoder, cat_cols),
            ("num", StandardScaler(), num_cols),
        ])
    return ColumnTransformer(
        [("cat", encoder, cat_cols)],
        remainder="passthrough",
    )


# 13. One helper to train and score any pipeline
def evaluate(name, model):
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    proba = model.predict_proba(X_test)[:, 1]
    print(
        f"{name}: accuracy={accuracy_score(y_test, pred):.3f}  "
        f"F1={f1_score(y_test, pred):.3f}  "
        f"ROC-AUC={roc_auc_score(y_test, proba):.3f}"
    )


# 14. Build and run the three pipelines
evaluate("Baseline (always majority)",
         make_pipeline(make_preprocessor(), DummyClassifier(strategy="most_frequent")))

evaluate("Logistic Regression",
         make_pipeline(make_preprocessor(scale=True), LogisticRegression(max_iter=1000)))

rf = make_pipeline(
    make_preprocessor(),
    RandomForestClassifier(n_estimators=100, max_depth=12, n_jobs=-1, random_state=42),
)
evaluate("Random Forest", rf)

# 15. Which features did the forest use most?
names = rf[:-1].get_feature_names_out()
importances = pd.Series(rf[-1].feature_importances_, index=names)
print(importances.sort_values(ascending=False).head(10))


#XGBoost
from xgboost import XGBClassifier

xgb = make_pipeline(
    make_preprocessor(),
    XGBClassifier(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="logloss",
        n_jobs=-1,
        random_state=42,
    ),
)
evaluate("XGBoost", xgb)


#Where is the model good or bad?
test_view = df.loc[test.index, ["size", "category", "in_stock"]].copy()
test_view["pred"] = xgb.predict(X_test)
test_view["correct"] = test_view["pred"] == test_view["in_stock"].astype(int)

print("Accuracy by pharmacy size:")
print(test_view.groupby("size")["correct"].mean())

print("\nAccuracy by medicine category:")
print(test_view.groupby("category")["correct"].mean().sort_values())


#Calibration check
from sklearn.calibration import calibration_curve
from sklearn.metrics import brier_score_loss
import matplotlib.pyplot as plt

proba = xgb.predict_proba(X_test)[:, 1]
frac_real, mean_pred = calibration_curve(y_test, proba, n_bins=10)

print(pd.DataFrame({"model said": mean_pred.round(3), "really happened": frac_real.round(3)}))
print("Brier score:", round(brier_score_loss(y_test, proba), 4))

plt.plot([0, 1], [0, 1], "--", label="perfect")
plt.plot(mean_pred, frac_real, marker="o", label="XGBoost")
plt.xlabel("Probability the model predicted")
plt.ylabel("Fraction really in stock")
plt.legend()
plt.show()


#Save the model and test loading it
import joblib

os.makedirs("ml/models", exist_ok=True)
joblib.dump({"model": xgb, "columns": cat_cols + num_cols}, "ml/models/availability_model.joblib")

loaded = joblib.load("ml/models/availability_model.joblib")

# What the app will do: one medicine, one pharmacy, one day
example = pd.DataFrame([{
    "category": "Pain & Fever", "size": "small",
    "day_of_week": 2, "month": 10, "days_since_restock": 5,
    "popularity": 0.95, "is_chronic": 0, "is_seasonal": 0,
    "base_price": 30, "restock_day": 4,
}])
chance = loaded["model"].predict_proba(example[loaded["columns"]])[0, 1]
print(f"Chance in stock: {chance:.0%}")

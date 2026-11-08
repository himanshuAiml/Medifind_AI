import os
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBRegressor

# 1. Load daily sales joined with medicine info
load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
query = """
select d.record_date, d.medicine_id, d.units_sold, m.is_seasonal
from demand_history d
join medicines m on d.medicine_id = m.id
order by d.record_date
"""
df = pd.read_sql(text(query), engine)
df["record_date"] = pd.to_datetime(df["record_date"])
df["is_seasonal"] = df["is_seasonal"].astype(int)
df["medicine_id"] = df["medicine_id"].astype(str)   # treat the id as a label, not a number
print("Data:", df.shape, "| from", df["record_date"].min().date(), "to", df["record_date"].max().date())

# 2. Turn dates into numeric features
start = df["record_date"].min()


def add_features(frame):
    frame = frame.copy()
    frame["t"] = (frame["record_date"] - start).dt.days
    frame["is_weekend"] = (frame["record_date"].dt.dayofweek >= 5).astype(int)
    angle = 2 * np.pi * frame["record_date"].dt.dayofyear / 365.25
    for k in (1, 2):
        frame[f"sin{k}"] = frame["is_seasonal"] * np.sin(k * angle)
        frame[f"cos{k}"] = frame["is_seasonal"] * np.cos(k * angle)
    return frame


df = add_features(df)
cat_cols = ["medicine_id"]
num_cols = ["t", "is_weekend", "is_seasonal", "sin1", "cos1", "sin2", "cos2"]
cols = cat_cols + num_cols

# 3. Time-based split: last 60 days are the test
cutoff = df["record_date"].max() - pd.Timedelta(days=60)
train = df[df["record_date"] <= cutoff]
test = df[df["record_date"] > cutoff]
print("Train:", train.shape, "| Test:", test.shape, "| cutoff:", cutoff.date())

X_train, X_test = train[cols], test[cols]
y_train = np.log(train["units_sold"])
actual = test["units_sold"]


# 4. Metric helper
def report(name, pred):
    mae = np.mean(np.abs(actual - pred))
    wape = np.sum(np.abs(actual - pred)) / np.sum(actual)
    print(f"{name}: MAE={mae:.1f} units/day  WAPE={wape:.1%}")


# 5. Baseline: each medicine's average of the last 28 training days
last28 = train[train["record_date"] > cutoff - pd.Timedelta(days=28)]
avg28 = last28.groupby("medicine_id")["units_sold"].mean()
report("Baseline (last 28-day average)", test["medicine_id"].map(avg28))


# 6. Models: one-hot encode the medicine, pass the numbers through
def make_model(regressor):
    pre = ColumnTransformer(
        [("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cat_cols)],
        remainder="passthrough",
    )
    return make_pipeline(pre, regressor)


lin = make_model(LinearRegression())
lin.fit(X_train, y_train)
report("Linear Regression", np.exp(lin.predict(X_test)))

xgb = make_model(XGBRegressor(n_estimators=300, learning_rate=0.05, max_depth=4,
                              subsample=0.8, colsample_bytree=0.8, n_jobs=-1, random_state=42))
xgb.fit(X_train, y_train)
report("XGBoost", np.exp(xgb.predict(X_test)))

# 7. Refit on ALL data and forecast the next 30 days
final_model = make_model(LinearRegression())
final_model.fit(df[cols], np.log(df["units_sold"]))
med_season = df.drop_duplicates("medicine_id").set_index("medicine_id")["is_seasonal"]


def forecast_next(medicine_id, days=28):
    medicine_id = str(medicine_id)
    future = pd.DataFrame({
        "record_date": pd.date_range(df["record_date"].max() + pd.Timedelta(days=1), periods=days)
    })
    future["medicine_id"] = medicine_id
    future["is_seasonal"] = int(med_season[medicine_id])
    future = add_features(future)
    future["forecast_units"] = np.exp(final_model.predict(future[cols])).round()
    return future[["record_date", "forecast_units"]]


for med_id in [1, 20]:
    print(f"\nForecast, medicine id {med_id}: weekly totals for the next 28 days")
    print(forecast_next(med_id).set_index("record_date").resample("W")["forecast_units"].sum())


# 8. Save the demand model with everything the API needs
import joblib

os.makedirs("ml/models", exist_ok=True)
joblib.dump(
    {
        "model": final_model,
        "columns": cols,
        "start": start,
        "last_date": df["record_date"].max(),
        "seasonal": med_season.to_dict(),
    },
    "ml/models/demand_model.joblib",
)

# Reload and check it gives identical predictions
saved = joblib.load("ml/models/demand_model.joblib")
sample = df[cols].head(5)
same = np.allclose(saved["model"].predict(sample), final_model.predict(sample))
print("Saved and reloaded OK:", same)

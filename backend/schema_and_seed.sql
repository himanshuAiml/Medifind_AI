-- ===== PART 1: tables + extra columns =====
create table if not exists medicines (
    id serial primary key,
    name text not null,
    generic_name text,
    category text,
    description text
);
create table if not exists pharmacies (
    id serial primary key,
    name text not null,
    address text,
    latitude float not null,
    longitude float not null,
    size text
);
create table if not exists inventory (
    id serial primary key,
    medicine_id integer references medicines(id),
    pharmacy_id integer references pharmacies(id),
    in_stock boolean not null default true,
    price float,
    recorded_at timestamp default now()
);

alter table medicines  add column if not exists popularity  numeric(3,2);
alter table medicines  add column if not exists is_chronic  boolean default false;
alter table medicines  add column if not exists is_seasonal boolean default false;
alter table medicines  add column if not exists base_price  numeric(8,2);
alter table pharmacies add column if not exists restock_day int;
alter table pharmacies add column if not exists reliability numeric(4,3);

-- ===== PART 2: medicines =====
insert into medicines (name, generic_name, category, popularity, is_chronic, is_seasonal, base_price) values
('Dolo 650',          'Paracetamol',                                   'Pain & Fever',  0.95, false, false,  30),
('Crocin Advance',    'Paracetamol',                                   'Pain & Fever',  0.85, false, false,  25),
('Combiflam',         'Ibuprofen + Paracetamol',                       'Pain & Fever',  0.80, false, false,  40),
('Brufen 400',        'Ibuprofen',                                     'Pain & Fever',  0.55, false, false,  22),
('Volini Gel',        'Diclofenac',                                    'Pain & Fever',  0.55, false, false, 110),
('Glycomet 500',      'Metformin',                                     'Diabetes',      0.75, true,  false,  28),
('Amaryl 2',          'Glimepiride',                                   'Diabetes',      0.45, true,  false, 110),
('Januvia 100',       'Sitagliptin',                                   'Diabetes',      0.25, true,  false, 480),
('Mixtard 30 Insulin','Human insulin',                                 'Diabetes',      0.30, true,  false, 170),
('Telma 40',          'Telmisartan',                                   'Blood Pressure',0.65, true,  false,  95),
('Amlong 5',          'Amlodipine',                                    'Blood Pressure',0.70, true,  false,  45),
('Concor 5',          'Bisoprolol',                                    'Heart',         0.50, true,  false, 130),
('Ecosprin 75',       'Aspirin',                                       'Heart',         0.60, true,  false,   6),
('Atorva 10',         'Atorvastatin',                                  'Cholesterol',   0.60, true,  false,  90),
('Thyronorm 50',      'Levothyroxine',                                 'Thyroid',       0.65, true,  false, 200),
('Augmentin 625',     'Amoxicillin + Clavulanic acid',                 'Antibiotic',    0.60, false, false, 220),
('Azithral 500',      'Azithromycin',                                  'Antibiotic',    0.60, false, false, 120),
('Mox 500',           'Amoxicillin',                                   'Antibiotic',    0.50, false, false,  60),
('Cifran 500',        'Ciprofloxacin',                                 'Antibiotic',    0.40, false, false,  75),
('Cetzine',           'Cetirizine',                                    'Allergy',       0.70, false, true,   20),
('Allegra 120',       'Fexofenadine',                                  'Allergy',       0.45, false, true,  210),
('Benadryl Syrup',    'Diphenhydramine',                               'Cold & Cough',  0.65, false, true,  115),
('Ascoril LS Syrup',  'Levosalbutamol + Bromhexine',                   'Cold & Cough',  0.55, false, true,  125),
('Sinarest',          'Paracetamol + Phenylephrine + Chlorpheniramine','Cold & Cough',  0.60, false, true,   60),
('Pantocid 40',       'Pantoprazole',                                  'Gastro',        0.80, false, false, 150),
('Digene',            'Magnesium + Aluminium hydroxide',               'Gastro',        0.60, false, false,  20),
('Electral ORS',      'Oral rehydration salts',                        'Gastro',        0.65, false, false,  22),
('Shelcal 500',       'Calcium + Vitamin D3',                          'Supplement',    0.60, true,  false, 120),
('Becosules',         'Vitamin B complex',                             'Supplement',    0.65, false, false,  45),
('Asthalin Inhaler',  'Salbutamol',                                    'Respiratory',   0.35, true,  false, 150);

-- ===== PART 3: pharmacies =====
insert into pharmacies (name, address, latitude, longitude, size, restock_day, reliability)
select
  (array['Shree','Sai','Krishna','Radha','Ganga','Jai','New','City','Life','Care'])[1 + floor(random()*10)::int]
  || ' ' ||
  (array['Medical Store','Pharmacy','Chemist','Medicos'])[1 + floor(random()*4)::int]
  || ' #' || g,
  'Mathura, Uttar Pradesh',
  round((27.4924 + (random()-0.5)*0.12)::numeric, 6),
  round((77.6737 + (random()-0.5)*0.12)::numeric, 6),
  case when r < 0.5 then 'small' when r < 0.8 then 'medium' else 'large' end,
  floor(random()*7)::int,
  round(((random()-0.5)*0.16)::numeric, 3)
from (select g, random() as r from generate_series(1,40) g) t;

-- ===== PART 4: stock history =====
create table if not exists stock_history (
    id bigserial primary key,
    record_date date not null,
    medicine_id int not null references medicines(id),
    pharmacy_id int not null references pharmacies(id),
    day_of_week int not null,
    month int not null,
    days_since_restock int not null,
    in_stock boolean not null,
    price numeric(8,2)
);

insert into stock_history (record_date, medicine_id, pharmacy_id, day_of_week, month, days_since_restock, in_stock, price)
select record_date, medicine_id, pharmacy_id, dow, mon, dsr,
       random() < prob,
       round((base_price * (1 - disc) * (0.98 + random()*0.04))::numeric, 2)
from (
  select d.record_date,
         m.id  as medicine_id,
         ph.id as pharmacy_id,
         extract(dow from d.record_date)::int   as dow,
         extract(month from d.record_date)::int as mon,
         ((extract(dow from d.record_date)::int - ph.restock_day + 7) % 7) as dsr,
         m.base_price,
         case ph.size when 'large' then 0.10 when 'medium' then 0.05 else 0 end as disc,
         greatest(0.03, least(0.97,
             case ph.size when 'large' then 0.90 when 'medium' then 0.78 else 0.60 end
           - (1 - m.popularity) * (case ph.size when 'large' then 0.08 when 'medium' then 0.25 else 0.45 end)
           - m.popularity * 0.04 * ((extract(dow from d.record_date)::int - ph.restock_day + 7) % 7)
           - case when m.is_seasonal
                  then 0.15 * ((1 + cos(2*pi()*(extract(doy from d.record_date)::float8 - 15)/365.0))/2)
                  else 0 end
           + case when m.is_chronic then 0.05 else 0 end
           + ph.reliability
         )) as prob
  from (select gs::date as record_date
        from generate_series(current_date - 365, current_date - 1, interval '1 day') gs) d
  cross join medicines m
  cross join pharmacies ph
) x;

create index if not exists idx_stock_lookup on stock_history (medicine_id, pharmacy_id, record_date);

-- ===== PART 5: demand history =====
create table if not exists demand_history (
    id bigserial primary key,
    record_date date not null,
    medicine_id int not null references medicines(id),
    units_sold int not null
);

insert into demand_history (record_date, medicine_id, units_sold)
select d.record_date, m.id,
  greatest(0, round(
      m.popularity * 200
    * (1 + 0.8 * case when m.is_seasonal
                      then (1 + cos(2*pi()*(extract(doy from d.record_date)::float8 - 15)/365.0))/2
                      else 0 end)
    * (1 + 0.0005 * (d.record_date - (current_date - 730)))
    * (case when extract(dow from d.record_date) in (0,6) then 0.85 else 1.0 end)
    * (0.85 + random()*0.3)
  ))::int
from (select gs::date as record_date
      from generate_series(current_date - 730, current_date - 1, interval '1 day') gs) d
cross join medicines m;

-- ===== PART 6: today's snapshot for the app =====
insert into inventory (medicine_id, pharmacy_id, in_stock, price)
select medicine_id, pharmacy_id, in_stock, price::float
from stock_history
where record_date = current_date - 1;

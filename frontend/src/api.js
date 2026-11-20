const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export async function searchMedicines(query) {
  const res = await fetch(
    `${API_URL}/medicines/search?q=${encodeURIComponent(query)}&limit=8`
  );
  if (!res.ok) throw new Error("Search failed. Is the backend running?");
  return res.json();
}
export async function getNearbyPharmacies({ lat, lng, radiusKm, medicineId }) {
  const params = new URLSearchParams({
    lat,
    lng,
    radius_km: radiusKm,
    limit: 10,
    medicine_id: medicineId,
  });
  const res = await fetch(`${API_URL}/pharmacies/nearby?${params}`);
  if (!res.ok) throw new Error("Could not load pharmacies. Is the backend running?");
  return res.json();
}
export async function getDemandForecast({ medicineId, days = 28 }) {
  const params = new URLSearchParams({ medicine_id: medicineId, days });
  const res = await fetch(`${API_URL}/forecast/demand?${params}`);
  if (!res.ok) throw new Error("Could not load the forecast");
  return res.json();
}
export async function getAlternatives(medicineId) {
  const res = await fetch(`${API_URL}/medicines/${medicineId}/alternatives`);
  if (!res.ok) throw new Error("Could not load alternatives");
  return res.json();
}
export async function getStats() {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error("Could not load stats");
  return res.json();
}
export function chance(p) {
  if (p >= 0.7)
    return { label: "Likely in stock", bar: "bg-emerald-500", text: "text-emerald-700", color: "#10b981" };
  if (p >= 0.4)
    return { label: "Maybe in stock", bar: "bg-amber-500", text: "text-amber-700", color: "#f59e0b" };
  return { label: "Unlikely in stock", bar: "bg-rose-500", text: "text-rose-700", color: "#f43f5e" };
}
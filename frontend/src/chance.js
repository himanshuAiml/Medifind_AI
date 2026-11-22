export function chance(p) {
  if (p >= 0.7)
    return { label: "Likely in stock", bar: "bg-[#465a40]", text: "text-[#33442e]", color: "#465a40" };
  if (p >= 0.4)
    return { label: "Maybe in stock", bar: "bg-[#967d43]", text: "text-[#78612e]", color: "#967d43" };
  return { label: "Unlikely in stock", bar: "bg-[#9e5454]", text: "text-[#7d3939]", color: "#9e5454" };
}


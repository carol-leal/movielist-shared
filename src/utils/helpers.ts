export const formatDate = (dateString: string) => {
  if (!dateString) return "Unknown";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

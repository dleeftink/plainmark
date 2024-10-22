function tid() {
  const now = new Date(Date.now());

  // Extract year, month, day, hours, minutes, and seconds
  const year = now.getUTCFullYear().toString().slice(-2);
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = now.getUTCDate().toString().padStart(2, "0");
  const hours = now.getUTCHours().toString().padStart(2, "0");
  const minutes = now.getUTCMinutes().toString().padStart(2, "0");
  const seconds = now.getUTCSeconds().toString().padStart(2, "0");

  // Format the date string
  return `${year}.${month}.${day}-${hours}:${minutes}:${seconds}`;
}

function getDomain(url) {
  // Remove protocol and www prefix
  const cleanUrl = new URL(url).href.replace(/^https?:\/\//, "").replace(/^www\./, "");

  // Extract domain name
  const domainParts = cleanUrl.split(".");

  // Determine main domain
  let mainDomain;
  if (domainParts.length >= 3) {
    mainDomain = domainParts.slice(-2).join(".");
  } else if (domainParts.length === 2) {
    mainDomain = domainParts.join(".");
  } else {
    return domainParts[0]; // Return first part if no clear domain structure
  }

  // Capitalize words
  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Get formatted name
  const formattedName = capitalizeWords(mainDomain).split(".")[0];

  return formattedName;
}
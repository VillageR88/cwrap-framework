const CSS_PROPERTIES_URL = "https://gist.githubusercontent.com/cblanquera/9e890e2fef9d7f5b819e0550c26566b4/raw/ede5585a05dcc0a2a28a57a40b07f759823360ee/css-properties.json";

export default async function fetchCSSProperties() {
  const response = await fetch(CSS_PROPERTIES_URL);
  return await response.json();
}
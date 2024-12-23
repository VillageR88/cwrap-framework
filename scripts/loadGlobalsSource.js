const globalsApiUrl = "../routes/globals.json";

export default async function loadGlobalsSource() {
  const url = `${globalsApiUrl}?v=${new Date().getTime()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.info("%c\u200Binfo: no globals source found", "color:skyBlue");
  }
}

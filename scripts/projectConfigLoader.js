const configUrl = "../config.json";

export default async function projectConfigLoader() {
  try {
    const response = await fetch(configUrl);
    const jsonObj = await response.json();
    if (jsonObj.customDevices)
      global.localSettings.customDevices = jsonObj.customDevices;
    if (jsonObj["no-gui"]) global.localSettings["no-gui"] = jsonObj["no-gui"];
  } catch (error) {
    console.info("%c\u200Binfo: project config not found", "color:skyBlue");
  }
}

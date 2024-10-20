export default async function resolveInitialSettings() {
    console.log("resolveInitialSettings() called"); // debugging
    // Store the initial settings in a file system of OS we gonna do it by fetch api
    // Fetch the initial settings from the server
    try {
        const request = await fetch("/api/initial-settings");
        const response = await request.json();
        console.log(response);
    } catch (error) {
        console.error("Error fetching initial settings:", error);
    }
}
import loadTheme from "./loadTheme.js";

/**
 * Loads initial settings for the application from the user's folder, which varies based on the operating system.
 *
 * - On Windows, the settings are typically loaded from the "Documents" folder.
 * - On other operating systems, the settings may be loaded from a different default user directory.
 *
 * This function attempts to fetch user-specific settings from the `/api/initial-settings` endpoint.
 * If the request is successful, it applies the retrieved theme and settings globally.
 * In case of an error or if the fetch fails, it falls back to a locally stored theme in `localStorage`,
 * or defaults to a "dark" theme if no local storage theme is found.
 *
 * @async
 * @function initialSettingsLoader
 * @throws {Error} Throws an error if the settings fetch request fails.
 */
export default async function initialSettingsLoader() {
	try {
		const response = await fetch("/api/initial-settings");
		if (!response.ok) {
			throw new Error();
		}
		const data = await response.json();
		loadTheme(data.theme);
		global.settings = data;
		// console.log("response", global.settings); // debugging
	} catch (error) {
		const localStorageTheme = localStorage.getItem("theme");
		if (localStorageTheme) {
			loadTheme(localStorageTheme);
		} else {
			loadTheme(" dark");
		}
		console.warn("Failed to fetch initial settings");
	}
}

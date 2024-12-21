const currentPath = window.location.pathname;
const skeletonApiUrl = `${window.location.origin}/routes${currentPath}/skeleton.json`;
const skeletonEmptyTemplate = `${window.location.origin}/templates/empty/routes/skeleton.json`;

/**
 * Fetch skeleton JSON from a given URL.
 */
async function fetchSkeleton(url) {
  console.log(`Fetching skeleton from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    console.error(
      `Failed to fetch skeleton: ${response.status} ${response.statusText}`
    );
    throw new Error("Skeleton source not found");
  }
  const data = await response.json();
  console.log("Fetched skeleton data:", data);
  return data;
}

/**
 * Attempt to find skeleton JSON in dynamic folder structure.
 * @param {string} parentPath - Parent directory path.
 * @param {string} lastPart - Last part of the URL to match.
 * @returns {Promise<Object>} - The fetched skeleton data.
 */
async function findSkeletonInDynamicFolders(parentPath, lastPart) {
  const response = await fetch(`/api/list-directory?path=${parentPath}`);
  if (!response.ok) {
    console.error("Failed to fetch directory listing");
    throw new Error("Directory listing not found");
  }
  const directories = await response.json();
  console.log("Fetched directory listing:", directories);

  // Filter directories to find dynamic ones
  const bracketDirectories = directories.filter((dir) => /^\[.*\]$/.test(dir));
  console.log("Filtered dynamic directories:", bracketDirectories);

  // Iterate over each dynamic folder and attempt to find the skeleton.json
  for (const dir of bracketDirectories) {
    const dynamicJsonUrl = `${window.location.origin}/routes${parentPath}/${dir}/skeleton.json?v=${new Date().getTime()}`;
    console.log(`Checking skeleton at: ${dynamicJsonUrl}`);

    try {
      const skeletonData = await fetchSkeleton(dynamicJsonUrl);
      if (skeletonData.routes?.includes(lastPart)) {
        console.log("Matched route in skeleton data:", skeletonData.routes);

        const index = skeletonData.routes.indexOf(lastPart);
        const updatedSkeletonData = JSON.stringify(skeletonData).replace(
          /cwrapRoutes\[(.*?)\]/g,
          (match, p1) => {
            const items = p1.split(",");
            return items[index];
          }
        );
        return { skeletonData: JSON.parse(updatedSkeletonData), resolvedDir: dir };
      }
    } catch (error) {
      console.warn(
        `Skeleton source not found in dynamic folder: ${dir}`,
        error
      );
    }
  }

  throw new Error("Skeleton source not found in dynamic folders");
}

/**
 * Main function to load skeleton data.
 * - Tries fetching the skeleton from the direct URL first.
 * - If that fails, it searches dynamic folders.
 * - If both fail, it loads an empty template.
 */
export default async function loadSkeletonSource() {
  const url = `${skeletonApiUrl}?v=${new Date().getTime()}`;
  const urlArray = currentPath.split("/").filter(Boolean);

  console.log("Current path array:", urlArray); // Logs path segments for debugging

  // If the path has segments, look through each to find skeleton in dynamic folders
  let finalSkeleton = null; // Variable to hold the final skeleton result
  let resolvedPath = ""; // Variable to hold the resolved path

  // Loop through all path segments to check for dynamic skeleton files
  for (let i = 0; i < urlArray.length; i++) {
    const partialPath = `/${urlArray.slice(0, i + 1).join("/")}`;
    const parentPath = `${resolvedPath}`;
    const lastPart = urlArray[i]; // Last part of the URL for current segment

    console.log(`Trying to find skeleton for partial path: ${partialPath}`);

    try {
      // First, check if the current segment is a static folder
      const staticSkeletonUrl = `${window.location.origin}/routes${partialPath}/skeleton.json?v=${new Date().getTime()}`;
      console.log(`Checking static skeleton at: ${staticSkeletonUrl}`);
      finalSkeleton = await fetchSkeleton(staticSkeletonUrl);
      console.log(`Found static skeleton for ${lastPart}:`, finalSkeleton);
      resolvedPath += `/${lastPart}`; // Update the resolved path
      continue; // If found, continue to the next segment
    } catch (staticError) {
      console.warn(`Static skeleton not found for partial path: ${partialPath}`, staticError);
    }

    try {
      // If not found as a static folder, check for dynamic folders
      const result = await findSkeletonInDynamicFolders(parentPath, lastPart);
      finalSkeleton = result.skeletonData;
      urlArray[i] = result.resolvedDir; // Update the urlArray with the resolved dynamic part
      resolvedPath += `/${result.resolvedDir}`; // Update the resolved path with the dynamic part
      console.log(`Found dynamic skeleton for ${lastPart}:`, finalSkeleton);
      // Continue to the next segment to check deeper if needed
    } catch (dynamicError) {
      console.warn(
        `Failed to find skeleton for partial path: ${partialPath}`,
        dynamicError
      );
    }
  }

  // If no dynamic folder match is found, fallback to the direct skeleton URL
  if (!finalSkeleton) {
    try {
      console.log(`Attempting to fetch skeleton from direct URL: ${url}`);
      finalSkeleton = await fetchSkeleton(url);
    } catch (error) {
      console.warn(
        "Failed to fetch direct skeleton, trying dynamic folders.",
        error
      );
      try {
        finalSkeleton = await findSkeletonInDynamicFolders(
          "/",
          currentPath.split("/").pop()
        ).skeletonData;
      } catch (dynamicError) {
        console.warn(
          "Skeleton source not found in dynamic folders, loading empty template instead.",
          dynamicError
        );
        const urlEmptyJsonTemplate = `${skeletonEmptyTemplate}?v=${new Date().getTime()}`;
        finalSkeleton = await fetchSkeleton(urlEmptyJsonTemplate);
      }
    }
  }

  return finalSkeleton; // Return the final skeleton after all checks
}
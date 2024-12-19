const currentPath = window.location.pathname;
const skeletonApiUrl = `routes/${currentPath}/skeleton.json`;
const skeletonEmptyTemplate = "templates/empty/routes/skeleton.json";

async function fetchSkeleton(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Skeleton source not found");
  }
  return response.json();
}

async function findSkeletonInDynamicFolders() {
  // Remove the last segment of the current path using regex
  const parentPath = currentPath.replace(/\/[^\/]*$/, "") || "/";
  // Capture the last part of the current path
  const lastPart = currentPath
    .split("/")
    .filter((segment) => segment)
    .pop();

  const response = await fetch(`/api/list-directory?path=${parentPath}`);
  if (!response.ok) {
    throw new Error("Directory listing not found");
  }
  const directories = await response.json();
  // Filter directories to only keep those in brackets
  const bracketDirectories = directories.filter((dir) => /^\[.*\]$/.test(dir));
  console.log("Filtered directories:", bracketDirectories);

  for (const dir of bracketDirectories) {
    const dynamicJsonUrl = `routes${parentPath}/${dir}/skeleton.json?v=${new Date().getTime()}`;
    console.log(`Checking URL: ${dynamicJsonUrl}`);
    try {
      const skeletonData = await fetchSkeleton(dynamicJsonUrl);
      if (skeletonData.routes?.includes(lastPart)) {
        console.log(
          "Matched route found in skeleton data:",
          skeletonData.routes
        );
        return skeletonData;
      }
    } catch (error) {
      console.warn(`Skeleton source not found in dynamic folder: ${dir}`);
    }
  }
  throw new Error("Skeleton source not found in dynamic folders");
}

export default async function loadSkeletonSource() {
  const url = `${skeletonApiUrl}?v=${new Date().getTime()}`;
  try {
    return await fetchSkeleton(url);
  } catch (error) {
    try {
      return await findSkeletonInDynamicFolders();
    } catch (dynamicError) {
      console.warn(
        "Skeleton source not found in dynamic folders, loading empty template instead."
      );
      const urlEmptyJsonTemplate = `${skeletonEmptyTemplate}?v=${new Date().getTime()}`;
      return await fetchSkeleton(urlEmptyJsonTemplate);
    }
  }
}

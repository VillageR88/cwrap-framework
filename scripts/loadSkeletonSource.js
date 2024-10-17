const currentPath = window.location.pathname;
const skeletonApiUrl = `routes/${currentPath}/skeleton.json`;
const skeletonEmptyTemplate = "templates/empty/routes/skeleton.json";


export default async function loadSkeletonSource() {
	const url = `${skeletonApiUrl}?v=${new Date().getTime()}`;
	try {
		const response = await fetch(url);
		const jsonObj = await response.json();
		return jsonObj;
	} catch (error) {
		console.warn("Skeleton source not found, loading empty template instead.");
		const urlEmptyJsonTemplate = `${skeletonEmptyTemplate}?v=${new Date().getTime()}`;
		const response = await fetch(urlEmptyJsonTemplate);
		const jsonObj = await response.json();
		return jsonObj;
	}
}

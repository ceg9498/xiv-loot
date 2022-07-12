/**
 * Indexing Objects in Typescript:
 * https://dev.to/mapleleaf/indexing-objects-in-typescript-1cgi
 */
function hasKey<O>(obj:O, key:PropertyKey): key is keyof O {
	return key in obj;
}

async function callBackendAPI(endpoint:string, value:string) {
	const response = await fetch(`/${endpoint}/${value}`);

	const body = await response.json();

	if (response.status !== 200) {
		console.warn(`error status: [${response.status}] ${response.statusText}`);
		throw Error('error: ',body.message);
	}
	return body;
}

export { hasKey, callBackendAPI };
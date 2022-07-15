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

function updateDB(type:string, id:string, data:any) {
	if(id === 'new') {
		fetch(`/${type}/add/${id}`, {
			method: "POST",
			headers: {
				'Content-type': "application/json"
			},
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.catch(e => console.error('[server error](updateDB:new)', e, JSON.stringify(data)));
	} else {
		fetch(`/${type}/update/${id}`, {
			method: "POST",
			headers: {
				'Content-type': "application/json"
			},
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.catch(e => console.error('[server error](updateDB)', e, JSON.stringify(data)));
	}
}

export { hasKey, callBackendAPI, updateDB };
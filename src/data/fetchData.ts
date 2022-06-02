import { IndexDB } from './IndexDB';
const equipmentStore = 'equipment';
const setStore = 'set';

async function fetchGearset(id:string, db:IndexDB|null) {
	if(db && db.isOpen()) {
		const res = await db.getItem(setStore, id);
		if(!res) {
			return fetch(`https://etro.gg/api/gearsets/${id}/`)
			.then(response => response.json())
			.then(data => {
				const refined = {
					id: data.id,
					name: data.name,
					jobAbbrev: data.jobAbbrev,
					jobIconPath: data.jobIconPath,
					weapon: data.weapon,
					offHand: data.offHand,
					head: data.head,
					body: data.body,
					hands: data.hands,
					legs: data.legs,
					feet: data.feet,
					ears: data.ears,
					neck: data.neck,
					wrists: data.wrists,
					fingerL: data.fingerL,
					fingerR: data.fingerR,
				};
				console.log(`Item ${id} was not saved`);
				db.setItem(setStore, refined);
				return refined;
			})
		}
		return res;
	} else {
		return fetch(`https://etro.gg/api/gearsets/${id}/`)
			.then(response => response.json())
			.then(setData => setData)
	}
}

async function fetchEquipment(id:string, db:IndexDB|null) {
	if(db && db.isOpen()) {
		const res = await db.getItem(equipmentStore, id);
		if(!res) {
			return fetch(`https://etro.gg/api/equipment/${id}/`)
			.then(response => response.json())
			.then(data => {
				const refined = {
					id: data.id,
					name: data.name,
					iconPath: data.iconPath,
					slotName: data.slotName
				};
				console.log(`Item ${id} was not saved`);
				db.setItem(equipmentStore, refined);
				return refined;
			});
		}
		return res;
	} else {
		return fetch(`https://etro.gg/api/equipment/${id}/`)
		.then(response => response.json())
		.then(equipData => equipData);
	}
}

export { fetchGearset, fetchEquipment };
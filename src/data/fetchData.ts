function fetchGearset(id:string) {
  return fetch(`https://etro.gg/api/gearsets/${id}/`)
  .then(response => response.json())
  .then(setData => setData)
}

function fetchEquipment(id:string) {
	return fetch(`https://etro.gg/api/equipment/${id}/`)
	.then(response => response.json())
	.then(equipData => equipData);
}

export { fetchGearset, fetchEquipment };
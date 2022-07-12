import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DisplaySet } from '../Components';
import {
	setType,
	obtainedSetType,
	equipType,
	obtainedItemType,
} from '../types';
import { hasKey } from '../Utilities';
import {
	slots,
	role,
	fetchGearset,
	fetchEquipment,
	IndexDB
} from '../data';
import '../App.css';

const db = new IndexDB('xivloot', 60);

async function callBackendAPI(endpoint:string, value:string) {
	const response = await fetch(`/${endpoint}/${value}`);

	const body = await response.json();

	if (response.status !== 200) {
		console.warn(`error status: [${response.status}] ${response.statusText}`);
		throw Error('error: ',body.message);
	}
	return body;
}

async function addSetBulk(
	members:{setID:string, obtained:any}[],
	db:IndexDB,
	setSets:Function,
	equipment:Map<string, Object>,
	addEquipment:Function,
	updateObtained:Function,
) {
	let sets:setType[] = [];
	for(let i = 0; i < members.length; i++) {
		const res = await await fetchGearset(members[i].setID, db);
		sets.push(res);
		slots.forEach(slot => {
			if(hasKey(res, slot.id) && res[slot.id] &&
			!equipment.has(res[slot.id])) {
				getEquip(res[slot.id], db, addEquipment);
			}
		});
		updateObtained(members[i].setID, members[i].obtained);
	};
	setSets(sets);
}

async function getEquip(id:string, db:IndexDB, addEquipment:Function) {
	let res = await fetchEquipment(id, db);
	const item = { name: res.name, iconPath: res.iconPath, id: res.id, slotName: res.slotName };
	addEquipment(id, item);
}

function Team(props:any){
	// external id: 62cc99b17433f8f343bcf9c8
	const { id } = useParams();
	useEffect(()=> {
		if(id)
			callBackendAPI('team', id)
			.then(res => {
				initData(res);
			})
			.catch(e => console.error(`[server error] `, e));
	}, [id]);
	const [name, setName] = useState('');
	const [sets, setSets] = useState<setType[]>([]);
	const [equipment, setEquipment] = useState(new Map());
	const addEquipment = (k:string, v:equipType) => {
		setEquipment(equipment.set(k, v));
	}
	const [obtained, setObtained] = useState<obtainedSetType>({});
	const updateObtained = (setId:string, values:obtainedItemType) => {
		const ob = obtained;
		ob[setId] = values;
		setObtained(ob);
	}

	function initData (team:{members:{setID: string; obtained: any;}[],name:string}) {
		// set the name
		setName(team.name);
		// obtain sets listed in Team Data
		addSetBulk(
			team.members,
			db,
			setSets,
			equipment,
			addEquipment,
			updateObtained);
	}

	return(
		<>
			<nav>
				<h1>{name}</h1>
			</nav>
			<article>
				<section id='tank-jobs'>
					{sets.filter(set => role[set.jobAbbrev] === 'tank').map((set, id) =>
						<DisplaySet
							key={id}
							id={id}
							setInfo={set}
							equipment={equipment}
							open={sets.length === 1 ? true : false}
							obtained={obtained[set.id]} />
					)}
				</section>
				<section id='heal-jobs'>
					{sets.filter(set => role[set.jobAbbrev] === 'heal').map((set, id) =>
						<DisplaySet
							key={id}
							id={id}
							setInfo={set}
							equipment={equipment}
							open={sets.length === 1 ? true : false}
							obtained={obtained[set.id]} />
					)}
				</section>
				<section id='dps-jobs'>
					{sets.filter(set => role[set.jobAbbrev] === 'dps').map((set, id) =>
						<DisplaySet
							key={id}
							id={id}
							setInfo={set}
							equipment={equipment}
							open={sets.length === 1 ? true : false}
							obtained={obtained[set.id]} />
					)}
				</section>
			</article>
		</>
	);
}

export default Team;

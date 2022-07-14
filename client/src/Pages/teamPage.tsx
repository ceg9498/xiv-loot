import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Distributor, Login } from '../Components';
import { equipType } from '../types';
import { Team } from '../types/storage';
import { hasKey, callBackendAPI, updateDB } from '../Utilities';
import {
	slots,
	fetchGearset,
	fetchEquipment,
	IndexDB
} from '../data';
import '../App.css';
import TeamDisplay from './teamDisplay';
import TeamEdit from './teamEdit';

const db = new IndexDB('xivloot', 60);

const emptyTeam = {
	_id: "",
	name: "",
	members: []
}

async function addSetBulk(
	team:Team,
	db:IndexDB,
	equipment:Map<string, Object>,
	addEquipment:Function,
) {
	for(let i = 0; i < team.members.length; i++) {
		const res = await await fetchGearset(team.members[i].setID, db);
		team.members[i].set = res;
		team.members[i].job = res.jobAbbrev;
		slots.forEach(slot => {
			if(hasKey(res, slot.id) && res[slot.id] &&
			!equipment.has(res[slot.id])) {
				getEquip(res[slot.id], db, addEquipment);
			}
		});
	};
	return team;
}

async function getEquip(id:string, db:IndexDB, addEquipment:Function) {
	let res = await fetchEquipment(id, db);
	const item = { name: res.name, iconPath: res.iconPath, id: res.id, slotName: res.slotName };
	addEquipment(id, item);
}

function TeamPage(props:any){
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

	const [team, setTeam] = useState<Team>({...emptyTeam});
	const [equipment, setEquipment] = useState(new Map());
	const addEquipment = (k:string, v:equipType) => {
		setEquipment(equipment.set(k, v));
	}
	const [editing, setEditing] = useState<boolean>(false);

	async function initData (nTeam:Team) {
		// obtain sets listed in Team Data
		addSetBulk(
			nTeam,
			db,
			equipment,
			addEquipment)
		.then(res => setTeam(res));
	}

	function updateObtained(name:string, itemId:string, value:boolean = true) {
		// ensure there's a team to be updated
		if(!team) return;

		// update the object locally
		const update = team;
		// remove all object references with the payload
		const payload = JSON.parse(JSON.stringify(team));
		for(let i = 0; i < update.members.length; i++) {
			if(update.members[i].name === name) {
				update.members[i].obtained[itemId] = value;
				payload.members[i].obtained[itemId] = value;
			}
			// do NOT include members[i].job or members[i].set in payload
			delete payload.members[i].job;
			delete payload.members[i].set;
		}
		// update the local copy
		setTeam({...update});

		// call server to update the database entry
		// this will use the team ID and update the entire object
		updateDB(payload._id, payload);
	}

	function updateMember() {
		if(!team) return;

		// remove all object references with the payload
		const payload = JSON.parse(JSON.stringify(team));

		for(let i = 0; i < payload.members.length; i++) {
			// If there's empty member names, delete them
			if(payload.members[i].name === ''){
				delete payload.members[i];
			} else {
				// do NOT include members[i].job or members[i].set in payload
				delete payload.members[i].job;
				delete payload.members[i].set;
			}
		}

		updateDB(payload._id, payload);

		// run an update
		initData(payload).then(res => console.log('done',res));
	}

	function removeMember(name:string) {
		if(!team) return;

		// update the object locally
		const update = team;
		// remove all object references with the payload
		const payload = JSON.parse(JSON.stringify(team));
		for(let i = 0; i < update.members.length; i++) {
			if(update.members[i].name === name) {
				update.members.splice(i,1);
				payload.members.splice(i,1);
			} else {
				// do NOT include members[i].job or members[i].set in payload
				delete payload.members[i].job;
				delete payload.members[i].set;
			}
		}

		setTeam({...update});
		updateDB(payload._id, payload);
	}

	return(
		<>
			<nav>
				<h1>{team && (team.name || team._id)}</h1>
				<button onClick={(e)=>{e.preventDefault(); setEditing(!editing)}}>
					{editing ?
						"Finish Editing"
					:
						"Edit"
					}
				</button>
				<span className="grow"></span>
				{!editing &&
					<Distributor
						members={team.members.map(({name}) => name)}
						giveItem={(name:string, item:string) => {
							updateObtained(name, item, true);
						}} />
				}
				<Login />
			</nav>
			{editing ?
				<TeamEdit team={team}
					updateMember={updateMember}
					removeMember={removeMember} />
			:
				<TeamDisplay
					team={team}
					equipment={equipment}
					updateObtained={updateObtained} />
			}
		</>
	);
}

export default TeamPage;

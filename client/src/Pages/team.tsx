import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DisplaySet } from '../Components';
import { equipType } from '../types';
import { Member, Team } from '../types/storage';
import { hasKey, callBackendAPI } from '../Utilities';
import {
	slots,
	role,
	fetchGearset,
	fetchEquipment,
	IndexDB
} from '../data';
import '../App.css';

const db = new IndexDB('xivloot', 60);

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
	const [team, setTeam] = useState<Team>();
	const [equipment, setEquipment] = useState(new Map());
	const addEquipment = (k:string, v:equipType) => {
		setEquipment(equipment.set(k, v));
	}

	async function initData (nTeam:Team) {
		// save the entire team object
		// obtain sets listed in Team Data
		addSetBulk(
			nTeam,
			db,
			equipment,
			addEquipment)
			.then(res => setTeam(res));
	}

	function updateObtained(name:string, itemId:string, value:boolean) {
		// call server to update the database entry
		// Data needed:
		// team id
		// member id
		// piece name

		// first, update the object locally
		if(team){
			const update = team;
			for(let i = 0; i < update.members.length; i++) {
				if(update.members[i].name === name) {
					update.members[i].obtained[itemId] = value;
					console.log('updating',update.members[i]);
					break;
				}
			}
			setTeam({...update});
		}

		// TODO: send the updated object to the database
		// do NOT include members[i].job or members[i].set!
	}

	return(
		<>
			<nav>
				<h1>{team && (team.name || team.id)}</h1>
			</nav>
			<article>
				<div id='not-dps'>
					<section id='tank-jobs'>
						{team && team.members.filter(member =>
							member.job && role[member.job] === 'tank').map((member, id) =>
							<DisplaySet
								key={id}
								id={id}
								member={member}
								equipment={equipment}
								updateObtained={updateObtained} />

						)}
					</section>
					<section id='heal-jobs'>
						{team && team.members.filter(member =>
							member.job && role[member.job] === 'heal').map((member, id) =>
							<DisplaySet
								key={id}
								id={id}
								member={member}
								equipment={equipment}
								updateObtained={updateObtained} />
						)}
					</section>
				</div>
				<section id='dps-jobs'>
					{team && team.members.filter(member =>
						member.job && role[member.job] === 'dps').map((member, id) =>
						<DisplaySet
							key={id}
							id={id}
							member={member}
							equipment={equipment}
							updateObtained={updateObtained} />
					)}
				</section>
			</article>
		</>
	);
}

export default TeamPage;

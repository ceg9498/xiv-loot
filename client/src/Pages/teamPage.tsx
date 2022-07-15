import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Distributor, Login } from '../Components';
import { equipType } from '../types';
import { Member, Team } from '../types/storage';
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

async function addSet(
	member:Member,
	db:IndexDB,
	equipment:Map<string, Object>,
	addEquipment:Function,
) {
	const res = await fetchGearset(member.setID, db);
	slots.forEach(slot => {
		if(hasKey(res, slot.id) && res[slot.id] &&
		!equipment.has(res[slot.id])) {
			getEquip(res[slot.id], db, addEquipment);
		}
	});
	return {job:res.jobAbbrev, set:{...res}};
}

async function getEquip(id:string, db:IndexDB, addEquipment:Function) {
	let res = await fetchEquipment(id, db);
	const item = { name: res.name, iconPath: res.iconPath, id: res.id, slotName: res.slotName };
	addEquipment(id, item);
}

function TeamPage(props:any){
	// team id: 62cc99b17433f8f343bcf9c8
	const { id } = useParams();
	useEffect(()=> {
		if(id)
			callBackendAPI('team', id)
			.then(teamRes => {
				setTeam(teamRes);
				// obtain team members
				for(let i = 0; i < teamRes.members.length; i++) {
					callBackendAPI('user', teamRes.members[i])
					.then(userRes => {
						// get the set
						if(userRes.setID){
							addSet(userRes, db, equipment, addEquipment)
							.then(setData => {
								userRes.job = setData.job;
								userRes.set = setData.set;
								setMembers(members => [...members, userRes]);
							});
						} else {
							setMembers(members => [...members, userRes]);
						}
					})
					.catch(e => console.error(`[server error](TeamPage:User)`,e));
				}
			})
			.catch(e => console.error(`[server error](TeamPage:Team)`, e));
	}, [id]);

	const [user, setUser] = useState<string>('');
	const [team, setTeam] = useState<Team>({...emptyTeam});
	const [members, setMembers] = useState<Member[]>([]);
	const [equipment, setEquipment] = useState(new Map());
	const addEquipment = (k:string, v:equipType) => {
		setEquipment(equipment.set(k, v));
	}
	const [editing, setEditing] = useState<boolean>(false);

	async function login() {

	}

	function updateObtained(id:string, itemId:string, value:boolean = true) {
		// update the object locally
		const update = members;
		// remove all object references with the payload
		const payload = JSON.parse(JSON.stringify(members));
		for(let i = 0; i < update.length; i++) {
			if(update[i]._id === id) {
				update[i].obtained[itemId] = value;
				payload[i].obtained[itemId] = value;
			}
			// do NOT include members[i].job or members[i].set in payload
			delete payload[i].job;
			delete payload[i].set;
		}
		// update the local copy
		setMembers([...update]);

		// call server to update the database entry
		// this will use the team ID and update the entire object
		updateDB('user', payload._id, payload);
	}

	function updateMember(member:Member, add:boolean = false) {
		// If the names is empty, do nothing
		if(member.name === ''){
			return;
		}

		// remove all object references with the payload
		const payload = JSON.parse(JSON.stringify(member));

		// fetch new gear & update local data
		if(member.setID && !member.set)
			addSet(member, db, equipment, addEquipment)
			.then(setData => {
				member.job = setData.job;
				member.set = setData.set;
				if(add) {
					setMembers((members) => [...members, member]);
				} else {
					const mList = [...members];
					for(let i = 0; i < mList.length; i++) {
						if(mList[i]._id === member._id) {
							mList[i] = {...member};
							break;
						}
					}
					setMembers([...mList]);
				}
			});
		// do NOT include members[i].job or members[i].set in payload
		delete payload.job;
		delete payload.set;

		if(add) {
			// add new member to the database
			const idList:string[] = [];
			for(let i = 0; i < members.length; i++) {
				idList.push(members[i]._id);
			}
			idList.push(member._id);
			const teamUpdate = {...team};
			teamUpdate.members = [...idList];
			updateDB('team', team._id, teamUpdate);
			updateDB('user', 'new', member);
		} else {
			// update existing member
			updateDB('user', payload._id, payload);
		}
	}

	function removeMember(id:string) {
		console.log(`Removing ${id}`);
		// update the object locally
		const update = team;
		// remove all object references with the payload
		const payload = JSON.parse(JSON.stringify(team));
		for(let i = 0; i < update.members.length; i++) {
			if(update.members[i] === id) {
				update.members.splice(i,1);
				payload.members.splice(i,1);
				break;
			}
		}
		setTeam({...update});
		updateDB('team', payload._id, payload);
		// remove from local members storage
		setMembers(members => members.filter(m => m._id !== id));
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
						members={members.map(({name}) => name)}
						giveItem={(name:string, item:string) => {
							updateObtained(name, item, true);
						}} />
				}
				<Login />
			</nav>
			{members.length === 0 &&
				<span>No team members</span>
			}
			{editing ?
				<TeamEdit members={[...members]}
					updateMember={updateMember}
					removeMember={removeMember} />
			:
				<TeamDisplay
					members={[...members]}
					equipment={equipment}
					updateObtained={updateObtained} />
			}
		</>
	);
}

export default TeamPage;

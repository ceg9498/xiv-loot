import React, { ChangeEvent } from 'react';
import { DisplaySet, DisplayItem } from './Components';
import {
	AppProps,
	AppState,
	setType,
} from './types';
import { hasKey } from './Utilities';
import {
	sampleIDs,
	slots,
	role,
	fetchGearset,
	fetchEquipment,
	IndexDB
} from './data';
import './App.css';
import { team } from './data/temp';

class App extends React.Component<AppProps, AppState>{
	constructor(props:any) {
		super(props);
		this.state = {
			src: '',
			sample: 'PLD',
			sets: [],
			equipment: new Map(),
			obtained: {},
			db: new IndexDB('xivloot', 60)
		};
		this.addSetBulk = this.addSetBulk.bind(this);
		this.setSrc = this.setSrc.bind(this);
		this.getSet = this.getSet.bind(this);
		this.toggleHas = this.toggleHas.bind(this);
	}

	callBackendAPI = async (endpoint:string) => {
		const response = await fetch(endpoint);

		const body = await response.json();

		if (response.status !== 200) {
			console.warn(`error status: [${response.status}] ${response.statusText}`);
			throw Error('error: ',body.message);
		}
		return body;
	};

	componentDidMount() {
		console.clear();
		// obtain sets listed in Team Data
		this.addSetBulk(team.members);
		this.callBackendAPI('/team')
			.then(res => {
				console.log('mount test res',res);
			})
			.catch(err => console.error('[server error]', err));
	}

	setSrc(e:ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		this.setState({
		src: e.target.value
		});
	}

	async addSetBulk(members:{setID:string, obtained:any}[]) {
		let sets:setType[] = [];
		let obtained = this.state.obtained;
		for(let i = 0; i < members.length; i++) {
			const res = await this.getSet(members[i].setID);
			sets.push(res);
			slots.forEach(slot => {
				if(hasKey(res, slot.id) && res[slot.id] &&
				!this.state.equipment.has(res[slot.id])) {
					this.getEquip(res[slot.id]);
				}
			});
			obtained[members[i].setID] = members[i].obtained;
		};
		this.setState({
			sets: sets,
			obtained: obtained,
		}, () => {setTimeout(() => {this.forceUpdate()}, 1000);});

		/*
		let obtained = this.state.obtained;
		obtained[set.id] = {};
		slots.forEach(slot => {
			if(hasKey(set, slot.id) && set[slot.id] &&
			!this.state.equipment.has(set[slot.id])) {
				this.getEquip(set[slot.id]);
				obtained[set.id][slot.id] = false;
			}
		});
		this.setState({
			sets: nSets,
			obtained: obtained
		}, () => {setTimeout(() => {this.forceUpdate()}, 1000);});
		*/
	}

	async getSet(id?:string) {
		if(!id) {
			if(this.state.src === '') {
				id = sampleIDs[this.state.sample];
			} else {
				id = this.state.src;
			}
		}
		return await fetchGearset(id, this.state.db);
	}

	async getEquip(id:string) {
		let res = await fetchEquipment(id, this.state.db);
		this.setState((prevState) => {
			const nextEntry = { name: res.name, iconPath: res.iconPath, id: res.id, slotName: res.slotName };
			return { equipment: prevState.equipment.set(id, nextEntry) }
		});
	}

	toggleHas(e:ChangeEvent<HTMLInputElement>, setId:string, itemId:string) {
		let obtained = this.state.obtained;
		obtained[setId][itemId] = !obtained[setId][itemId];
		this.setState({
			obtained: obtained
		});
	}

	render(){
		const equip = this.state.equipment;
		return(
		<>
			<nav>
				<h1>{team.name}</h1>
			</nav>
			<article>
				<section id='tank-jobs'>
					{this.state.sets.filter(set => role[set.jobAbbrev] === 'tank').map((set, id) =>
						<DisplaySet
							key={id}
							setInfo={set}
							open={this.state.sets.length === 1 ? true : false}>
							{slots.map(slot => hasKey(set, slot.id)  && set[slot.id]
							&& equip.has(set[slot.id]) &&
							<DisplayItem
								key={slot.pretty+id}
								position={slot.pretty}
								item={equip.get(set[slot.id])}
								obtained={this.state.obtained[set.id][slot.id]}
								toggleHas={(e:ChangeEvent<HTMLInputElement>) =>
									this.toggleHas(e, set.id, slot.id)}
								/>
							)}
						</DisplaySet>
					)}
				</section>
				<section id='heal-jobs'>
					{this.state.sets.filter(set => role[set.jobAbbrev] === 'heal').map((set, id) =>
						<DisplaySet
							key={id}
							setInfo={set}
							open={this.state.sets.length === 1 ? true : false}>
							{slots.map(slot => hasKey(set, slot.id)  && set[slot.id]
							&& equip.has(set[slot.id]) &&
							<DisplayItem
								key={slot.pretty+id}
								position={slot.pretty}
								item={equip.get(set[slot.id])}
								obtained={this.state.obtained[set.id][slot.id]}
								toggleHas={(e:ChangeEvent<HTMLInputElement>) =>
									this.toggleHas(e, set.id, slot.id)}
								/>
							)}
						</DisplaySet>
					)}
				</section>
				<section id='dps-jobs'>
					{this.state.sets.filter(set => role[set.jobAbbrev] === 'dps').map((set, id) =>
						<DisplaySet
							key={id}
							setInfo={set}
							open={this.state.sets.length === 1 ? true : false}>
							{slots.map(slot => hasKey(set, slot.id)  && set[slot.id]
							&& equip.has(set[slot.id]) &&
							<DisplayItem
								key={slot.pretty+id}
								position={slot.pretty}
								item={equip.get(set[slot.id])}
								obtained={this.state.obtained[set.id][slot.id]}
								toggleHas={(e:ChangeEvent<HTMLInputElement>) =>
									this.toggleHas(e, set.id, slot.id)}
								/>
							)}
						</DisplaySet>
					)}
				</section>
			</article>
		</>
		);
	}
}

export default App;

import { useState } from 'react';
import { DisplayItem } from './DisplayItem';
import { equipType } from '../types';
import { Member } from '../types/storage';
import { role, slots } from '../data';
import { hasKey } from '../Utilities';

export function DisplaySet(props:{
	id:number,
	member:Member,
	equipment:Map<string, equipType>,
	updateObtained:Function,
}){
	const { id, member, equipment } = props;

	const [obtained, updateObtained] = useState(member.obtained);

	function toggleHas(
		itemId:string
	) {
		const nValue = !obtained[itemId];
		updateObtained((obtained) => ({
			...obtained,
			[itemId]: nValue
		}));
		props.updateObtained(member.name, itemId, nValue);
	}

	if(member.set !== undefined){
		const set = member.set;
		return(
			<details
				id={member.name}
				className={role[set.jobAbbrev]}>
				<summary>[{set.jobAbbrev}] {member.name}</summary>
				{slots.map(slot => hasKey(member.set, slot.id)  && set[slot.id]
					&& equipment.has(set[slot.id]) &&
					<DisplayItem
						key={slot.pretty+id}
						position={slot.pretty}
						item={equipment.get(set[slot.id])}
						obtained={obtained[slot.id]}
						toggleHas={() =>
						toggleHas(slot.id)} />
				)}
			</details>
		);
	}

	return(
		<details
			id={member.name}
			className='unknown-role'>
			<summary>{member.name}</summary>
			<p>No set found.</p>
		</details>
	);
}
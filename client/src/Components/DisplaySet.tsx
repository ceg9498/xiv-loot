import { useState } from 'react';
import { DisplayItem } from './DisplayItem';
import { setType, obtainedItemType, equipType } from '../types';
import { role, slots } from '../data';
import { hasKey } from '../Utilities';

export function DisplaySet(props:{
	id:number,
	setInfo:setType,
	equipment:Map<string, equipType>,
	open:boolean,
	obtained:obtainedItemType,
}){
	const { id, setInfo, equipment, open } = props;

	const [obtained, updateObtained] = useState(props.obtained);

	function toggleHas(
		itemId:string
	) {
		updateObtained((obtained) => ({
			...obtained,
			[itemId]: !obtained[itemId]
		}));
	}

	return(
		<details
			id={setInfo.name}
			open={open}
			className={role[setInfo.jobAbbrev]}>
			<summary>{setInfo.jobAbbrev}</summary>
			{slots.map(slot => hasKey(setInfo, slot.id)  && setInfo[slot.id]
				&& equipment.has(setInfo[slot.id]) &&
				<DisplayItem
					key={slot.pretty+id}
					position={slot.pretty}
					item={equipment.get(setInfo[slot.id])}
					obtained={obtained[slot.id]}
					toggleHas={() =>
					toggleHas(slot.id)} />
			)}
		</details>
	);
}
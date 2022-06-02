	import React from 'react';
	import { equipType } from '../types';

	export function DisplayItem(props:{
		position:string,
		obtained:boolean,
		toggleHas:Function,
		item:equipType|undefined,
	}) {
		if(props.item === undefined) return null;
		return(
		<label className={`${props.obtained && 'isChecked'} gear-tile`}>
			<input type="checkbox" onChange={(e) => props.toggleHas(e)} />
			<img
			src={`https://etro.gg/s/icons${props.item.iconPath}`}
			className="gear-icon"
			alt={`Icon for ${props.item.name}`} />
			<span className="gear-slot">{props.position}</span>
			<span className="gear-name">{props.item.name}</span>
		</label>
		);
	}
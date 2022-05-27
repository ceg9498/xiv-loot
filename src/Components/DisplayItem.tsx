import React from 'react';

export function DisplayItem(props:{
	position:string,
	name:string,
	imgSrc:string,
	obtained:boolean,
	toggleHas:Function
}) {
	return(
	 <label className={`${props.obtained && 'isChecked'} gear-tile`}>
		<input type="checkbox" onChange={(e) => props.toggleHas(e)} />
		<img
		 src={`https://etro.gg/s/icons${props.imgSrc}`}
		 className="gear-icon"
		 alt={`Icon for ${props.name}`} />
		<span className="gear-slot">{props.position}</span>
		<span className="gear-name">{props.name}</span>
	 </label>
	);
 }
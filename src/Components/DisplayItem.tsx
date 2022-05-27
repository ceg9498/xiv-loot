import React from 'react';

export function DisplayItem(props:{position:string, name:string, imgSrc:string}) {
	const [isChecked, toggle] = React.useState(false);
	return(
	 <label className={`${isChecked && 'isChecked'} gear-tile`}>
		<input type="checkbox" onChange={()=>toggle(!isChecked)} />
		<img
		 src={`https://etro.gg/s/icons${props.imgSrc}`}
		 className="gear-icon"
		 alt={`Icon for ${props.name}`} />
		<span className="gear-slot">{props.position}</span>
		<span className="gear-name">{props.name}</span>
	 </label>
	);
 }
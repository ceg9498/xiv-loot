import { setType } from '../types';
import { role } from '../data/defaults';

export function DisplaySet(props:{setInfo:setType, open:boolean, children:any}){
	return(
	<details
	 id={props.setInfo.name}
	 open={props.open}
	 className={role[props.setInfo.jobAbbrev]}>
		<summary>{props.setInfo.jobAbbrev}</summary>
		{props.children}
	</details>
	);
}
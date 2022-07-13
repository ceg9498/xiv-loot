import { useState, useEffect } from 'react';
import { slots } from '../data';
import './distributor.css';

export function Distributor(props:{members:string[], giveItem:Function}) {
	const { members, giveItem } = props;
	const [member, setMember] = useState<string>('');
	const [piece, setPiece] = useState<string>('');

	useEffect(() => {
		if(member !== '' && piece !== '') {
			giveItem(member, piece);
			setMember('');
			setPiece('');
		}
	}, [member, piece, giveItem]);

	return(
		<form id="distributor">
			<select value={member} onChange={(e)=>{
				e.preventDefault();
				setMember(e.target.value);
			}}>
				<option value=''>(Name)</option>
				{members.map((member,index) =>
					<option key={index} value={member}>{member}</option>
				)}
			</select>
			<span>&nbsp;is getting&nbsp;</span>
			<select value={piece} onChange={(e) => {
				e.preventDefault();
				setPiece(e.target.value);
			}}>
				<option value=''>(piece)</option>
				{slots.map((slot:{id:string,pretty:string}, index:number) =>
					<option key={index} value={slot.id}>{slot.pretty}</option>
				)}
			</select>
		</form>
	)
}
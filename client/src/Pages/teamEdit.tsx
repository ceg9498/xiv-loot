import { useState } from 'react';
import { emptyObtained, newMember } from '../data/defaults';
import { Team } from '../types/storage';
import './teamEdit.css';

export default function TeamEdit(props:{team:Team, updateMember:Function, removeMember:Function}) {
	const { team, updateMember, removeMember } = props;
	const [ editing, setEditing ] = useState<string>('');
	const [ adding, setAdding ] = useState<boolean>(false);
	const [ nName, setName ] = useState<string>('');
	const [ nSetID, setSetID ] = useState<string>('');
	return(
		<>
			<article id="team-edit">
				<h2>Members</h2>
				<ul>
					{team.members.map((member, id) =>
						<li key={id}>
							<div className='member-info-text'>
								<span className="property">Name:</span>
								{editing && editing === member.name ?
									<input type="text" value={nName} onChange={(e)=>{
										e.preventDefault();
										setName(e.target.value);
									}} />
								:
									<span className='value'>{member.name}</span>
								}
								<br/>
								<span className="property">Etro ID:</span>
								{editing && editing === member.name ?
									<input type="text" value={nSetID} onChange={(e)=>{
										e.preventDefault();
										setSetID(e.target.value);
									}} />
								:
									<span className='value'>{member.setID}</span>
								}
							</div>
							<div className='member-info-buttons'>
								{editing === member.name ?
									<>
										<button
											className='emoji'
											aria-label='confirm edit'
											onClick={(e)=>{
												e.preventDefault();
												member.name = nName;
												if(member.setID !== nSetID) {
													member.setID = nSetID;
													const answer = window.confirm(
														'Set info is being updated. Do you want to reset gear progression for this character?'
													);
													if(answer) {
														member.obtained = emptyObtained;
													}
												}
												updateMember();
												setEditing('');
												setName('');
												setSetID('');
											}}>✔️</button>
										<button
											className='emoji'
											aria-label='cancel edit'
											onClick={(e)=>{
												e.preventDefault();
												setEditing('');
												setName('');
												setSetID('');
											}}>❌</button>
									</>
								:
									<>
										<button
											className='emoji'
											aria-label='edit'
											onClick={(e)=>{
												e.preventDefault();
												if(adding) {
													setAdding(false);
												}
												setEditing(member.name);
												setName(member.name);
												setSetID(member.setID);
												}}>✏️</button>
										<button
											className='emoji'
											aria-label='delete'
											onClick={(e)=>{
												e.preventDefault();
												const answer = window.confirm(
													`Are you sure you want to delete ${member.name}?`);
												if(answer) {
													removeMember(member.name);
												}
											}}>🗑️</button>
										</>
									}
							</div>
						</li>
					)}
					{adding &&
						<li>
							<div className='member-info-text'>
								<span className="property">Name:</span>
								<input type="text" value={nName} onChange={(e)=>{
									e.preventDefault();
									setName(e.target.value);
								}} />
								<br/>
								<span className="property">Etro ID:</span>
								<input type="text" value={nSetID} onChange={(e)=>{
									e.preventDefault();
									setSetID(e.target.value);
								}} />
							</div>
							<div className='member-info-buttons'>
								<button
									className='emoji'
									aria-label='confirm edit'
									onClick={(e)=>{
										e.preventDefault();
										let member = newMember;
										member.name = nName;
										member.setID = nSetID;
										team.members.push(member);
										updateMember();
										setEditing('');
										setName('');
										setSetID('');
										setAdding(false);
									}}>✔️</button>
								<button
									className='emoji'
									aria-label='cancel edit'
									onClick={(e)=>{
										e.preventDefault();
										setAdding(false);
										setEditing('');
										setName('');
										setSetID('');
									}}>❌</button>
									</div>
									</li>
					}
				</ul><br/>
				<button
					className='add-member'
					onClick={(e) => {
						console.log('add pressed')
						e.preventDefault();
						setEditing('new member');
						setAdding(true);
					}}
					>Add a member</button>
			</article>
		</>
	);
}
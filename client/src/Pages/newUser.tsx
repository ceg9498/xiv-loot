import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Member } from "../types/storage";
import { callBackendAPI } from "../Utilities";

function findCharacterName(
	memberList:Member[],
	id:string,
	setCharName:Function
) {
	for(let i = 0; i < memberList.length; i++) {
		if(memberList[i]._id === id) {
			console.log('found', memberList[i])
			setCharName(memberList[i].name);
		}
	}
}

export default function NewUser(props:any) {
	const { teamid, userid } = useParams();
	const [teamName, setTeamName] = useState<string>('');
	const [charName, setCharName] = useState<string>('');
	useEffect(()=> {
		if(teamid)
			callBackendAPI('team', teamid)
			.then(res => {
				setTeamName(res.name);
				if(userid){
					findCharacterName(res.members, userid, setCharName);
				}

			})
			.catch(e => console.error(`[server error] `, e));
	}, [teamid, userid]);

	console.log(teamName, charName)

	return(
		<>
			<nav>
				<h1>{teamName}</h1>
			</nav>
			<article style={{maxWidth:'500px'}}>
				<h2>Hi {charName} 👋</h2>
				<p>To manage your character, please <a href='#'>login with Discord</a>. We'll use this to make sure that only you and your group's leader(s) can make edits to your character.</p>
			</article>
		</>
	)
}
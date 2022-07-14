import { DisplaySet } from "../Components";
import { equipType } from "../types";
import { Team } from "../types/storage";
import { role } from "../data";

export default function TeamDisplay(props:{
	team:Team,
	equipment:Map<string, equipType>,
	updateObtained:Function
}) {
	const { team, equipment, updateObtained } = props;
	return(
		<article id='team-display'>
			<div id='not-dps'>
				<section id='tank-jobs'>
					{team && team.members.filter(member =>
						member.job && role[member.job] === 'tank').map((member, id) =>
						<DisplaySet
							key={id}
							id={id}
							member={member}
							equipment={equipment}
							updateObtained={updateObtained} />

					)}
				</section>
				<section id='heal-jobs'>
					{team && team.members.filter(member =>
						member.job && role[member.job] === 'heal').map((member, id) =>
						<DisplaySet
							key={id}
							id={id}
							member={member}
							equipment={equipment}
							updateObtained={updateObtained} />
					)}
				</section>
			</div>
			<section id='dps-jobs'>
				{team && team.members.filter(member =>
					member.job && role[member.job] === 'dps').map((member, id) =>
					<DisplaySet
						key={id}
						id={id}
						member={member}
						equipment={equipment}
						updateObtained={updateObtained} />
				)}
			</section>
		</article>
	);
}
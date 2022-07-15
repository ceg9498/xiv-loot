import { DisplaySet } from "../Components";
import { equipType } from "../types";
import { Member } from "../types/storage";
import { role } from "../data";

export default function TeamDisplay(props:{
	members:Member[],
	equipment:Map<string, equipType>,
	updateObtained:Function
}) {
	const { members, equipment, updateObtained } = props;
	return(
		<article id='team-display'>
			<div id='not-dps'>
				<section id='tank-jobs'>
					{members.filter(member =>
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
					{members.filter(member =>
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
				{members.filter(member =>
					member.job && role[member.job] === 'dps').map((member, id) =>
					<DisplaySet
						key={id}
						id={id}
						member={member}
						equipment={equipment}
						updateObtained={updateObtained} />
				)}
			</section>
			<section id='unknown-role'>
				{members.filter(member =>
					!member.job || !role[member.job]).map((member, id) =>
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
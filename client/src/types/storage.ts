import { setType, obtainedItemType } from ".";

interface User {
	id: string;
	sets: string[];
	teams: string[];
}

interface Team {
	_id: string;
	name: string;
	members: Member[];
}

/**
 * SetAndUser allows the set data to be associated with a User
 */
interface Member {
	id: string;
	name: string;
	job?: string;
	setID: string;
	set?: setType;
	obtained: obtainedItemType;
}

export type { User, Team, Member };
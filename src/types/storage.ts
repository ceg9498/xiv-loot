interface User {
	id: string;
	sets: string[];
	teams: string[];
}

interface Team {
	id: string;
	sets: SetAndUser[];
}

/**
 * SetAndUser allows the set data to be associated with a User
 */
interface SetAndUser {
	// a set can remain "unclaimed" within a team,
	// so a user ID will not be required
	user?: string;
	// however, the information for the set will still be required,
	// though Empty String will be an acceptable value
	set: string;
}

export type { User, Team };
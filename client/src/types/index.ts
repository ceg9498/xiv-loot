import { IndexDB } from '../data/IndexDB';

type AppProps = {};
type AppState = {
	teamId:string,
};

type TeamProps = {
	id:string,
};
type TeamState = {
	src: string,
	sample: string,
	sets: setType[],
	obtained: obtainedSetType,
	equipment: Map<string,equipType>,
	db: IndexDB,
};

type setType = {
	id:string,
	name:string,
	jobAbbrev:string,
	jobIconPath:string,
	weapon:string,
	offHand:string,
	head:string,
	body:string,
	hands:string,
	legs:string,
	feet:string,
	ears:string,
	neck:string,
	wrists:string,
	fingerL:string,
	fingerR:string,
};

type obtainedSetType = {
	[setId:string]: obtainedItemType,
}
type obtainedItemType = {
	[slotId:string]: boolean,
}

type equipDict = {
	[index: string]: equipType,
}

type equipType = {
	id:string,
	name:string,
	iconPath:string,
	slotName:string,
}

type slotType = {
	id: string,
	pretty: string,
}

type Dictionary = { [index:string]: string };

export type {
	Dictionary,
	slotType,
	equipType,
	equipDict,
	setType,
	AppProps,
	AppState,
	TeamProps,
	TeamState,
	obtainedSetType,
	obtainedItemType,
}
import { slotType, Dictionary, obtainedItemType } from '../types';
import { Member } from '../types/storage';

const slots: slotType[] = [
	{
	id: 'weapon',
	pretty: 'Weapon',
	},
	{
	id: 'offHand',
	pretty: 'Offhand'
	},
	{
	id: 'head',
	pretty: 'Head'
	},
	{
	id: 'body',
	pretty: 'Body'
	},
	{
	id: 'hands',
	pretty: 'Hands'
	},
	{
	id: 'legs',
	pretty: 'Legs'
	},
	{
	id: 'feet',
	pretty: 'Feet'
	},
	{
	id: 'ears',
	pretty: 'Ears'
	},
	{
	id: 'neck',
	pretty: 'Neck'
	},
	{
	id: 'wrists',
	pretty: 'Wrists'
	},
	{
	id: 'fingerL',
	pretty: 'Left Finger'
	},
	{
	id: 'fingerR',
	pretty: 'Right Finger'
	}
];
const tank = 'tank';
const heal = 'heal';
const dps = 'dps';
const role:Dictionary = {
	PLD: tank,
	WAR: tank,
	DRK: tank,
	GNB: tank,
	WHM: heal,
	SCH: heal,
	AST: heal,
	SGE: heal,
	MNK: dps,
	DRG: dps,
	NIN: dps,
	SAM: dps,
	RPR: dps,
	BRD: dps,
	MCH: dps,
	DNC: dps,
	BLM: dps,
	SMN: dps,
	RDM: dps
}

const sampleIDs:Dictionary = {
	PLD: '221f9cb0-e058-457e-bb49-b619f5177c46',
	DRK: 'dda8aef5-41e4-40b6-813c-df306e1f1cee',
	GNB: '88fbea7d-3b43-479c-adb8-b87c9d6cb5f9',
	WHM: 'e78a29e3-1dcf-4e53-bbcf-234f33b2c831',
	RPR: 'b301e789-96da-42f2-9628-95f68345e35b',
	MNK: '841ecfdb-41fe-44b4-8764-b3b08e223f8c',
	MCH: '6b4b1ba5-a821-41a0-b070-b1f50e986f85',
	SMN: '840a5088-23fa-49c5-a12a-3731ca55b4a6',
	DNC: 'fc9341ef-6acf-4389-a0b7-1015c9f46ffa'
}

const emptyObtained:obtainedItemType = {
	weapon: false,
	offhand: false,
	head: false,
	body: false,
	hands: false,
	legs: false,
	feet: false,
	ears: false,
	neck: false,
	wrists: false,
	fingerL: false,
	fingerR: false
}

const newMember:Member = {
	_id: '',
	name: '',
	setID: '',
	obtained: emptyObtained
}

export {
	slots,
	role,
	sampleIDs,
	emptyObtained,
	newMember
}
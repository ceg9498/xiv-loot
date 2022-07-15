const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;

app.listen(port, () => log(`Listening on port ${port}`));
app.use(express.json())

// Database connection
const { MongoClient, ObjectId } = require('mongodb');

app.get('/team/:id', (req, res) => {
	findTeamByID(req.params.id)
	.then(result => { res.send(result) });
});

app.get('/user/:id', (req, res) => {
	findUserByID(req.params.id)
	.then(result => { res.send(result) });
});

app.post('/team/update/:teamid', (req, res) => {
	updateTeam(req.params.teamid, req.body)
	.then((result) => res.send(result))
	.catch((e) => console.error('[server] (L28)', e));
});

app.post('/user/update/:userid', (req, res) => {
	updateUser(req.params.userid, req.body)
	.then((result) => res.send(result))
	.catch((e) => console.error('[server] (L34)', e));
});

app.post('/user/add/:userid', (req, res) => {
	updateUser(req.params.userid, req.body, true)
	.then((result) => res.send(result))
	.catch((e) => console.error('[server] (L34)', e));
});

app.get('/login', (req, res) => {
	// allow team member to "claim" character
	res.redirect('https://discord.com/api/oauth2/authorize?client_id=997198834012782655&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Flogin%2Fredirect&response_type=code&scope=identify');
	// TODO: find team teamid and replace userid with the id from Discord
});

app.get('/login/redirect', (req, res) => {
	findUserByID(req.query.code)
	.then(r =>
		findTeamByID(r.teamid)
		.then(r =>
			r.redirect(`http://localhost:3000/team/${r._id}`))
	);
	res.redirect(`http://localhost:3000/user/${req.query.code}`);
});

async function findTeamByID(id) {
	const client = new MongoClient(process.env.DB_CONNECT);
	try {
		await client.connect();
		const db = await client.db("xiv-loot");
		const teams = await db.collection("teams");

		const result = await teams.findOne(ObjectId(id));

		if (result) {
			return result;
		} else {
			console.warn(`No result found for id ${id}.`);
		}

	} catch(e) {
		console.error('[error](findTeamById):',e);
	} finally {
		await client.close();
	}
}

async function findUserByID(id) {
	const client = new MongoClient(process.env.DB_CONNECT);
	try {
		await client.connect();
		const db = await client.db("xiv-loot");
		const users = await db.collection("users");

		const result = await users.findOne({_id: id});

		if (result) {
			return result;
		} else {
			console.warn(`No result found for id ${id}.`);
		}

	} catch(e) {
		console.error('[error](findUserById):',e);
	} finally {
		await client.close();
	}
}

async function updateUser(id, data, add = false) {
	const client = new MongoClient(process.env.DB_CONNECT);
	try {
		await client.connect();
		const db = await client.db("xiv-loot");
		const users = await db.collection("users");

		console.log('sending user data:',data);

		let result;
		if(add) {
			result = await users.insertOne(data);
		} else {
			result = await users.findOneAndUpdate(
				{_id: id},
				{$set: data},
				{returnDocument: 'after'}
			);
		}

		if (result) {
			console.log('result of user update:', result);
			return result;
		} else {
			console.warn(`No result found for id ${id}.`);
		}

	} catch(e) {
		console.error('[error](updateUser):',e);
	} finally {
		await client.close();
	}
}

async function updateTeam(id, data) {
	const client = new MongoClient(process.env.DB_CONNECT);
	try {
		await client.connect();
		const db = await client.db("xiv-loot");
		const teams = await db.collection("teams");

		console.log('sending team data:',data);

		const result = await teams.findOneAndUpdate(
			{_id: ObjectId(id)},
			{$set: {name: data.name, members: data.members}},
			{returnDocument: 'after'}
		);

		if (result) {
			console.log('result of team update:', result);
			return result;
		} else {
			console.warn(`No result found for id ${id}.`);
		}

	} catch(e) {
		console.error('[error](updateTeam):',e);
	} finally {
		await client.close();
	}
}

function log(msg) {
	console.log(`[server] ${msg}`);
}
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;

app.listen(port, () => log(`Listening on port ${port}`));

// Database connection
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.DB_CONNECT);

app.get('/team/:id', (req, res) => {
	findTeamByID(req.params.id)
	.then(result => { res.send(result) });
});

app.get('/team/update/:teamid/:setid', (req, res) => {

});

async function findTeamByID(id) {
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
		console.error(e);
	} finally {
		await client.close();
	}
}

async function updateObtained(id, obtained) {
	try {
		await client.connect();
		const db = await client.db("xiv-loot");
		const teams = await db.collection("teams");

		const result = await teams.findOneAndUpdate(
			ObjectId(id),
			obtained
		);

		if (result) {
			return result;
		} else {
			console.warn(`No result found for id ${id}.`);
		}

	} catch(e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

function log(msg) {
	console.log(`[server] ${msg}`);
}
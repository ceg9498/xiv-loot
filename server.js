const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;

app.listen(port, () => log(`Listening on port ${port}`));

app.get('/', (req, res) => {
	log(`/ requested`);
	res.send({msg: '/ responded'});
})

app.get('/team', (req, res) => {
	const team = `team endpoint`;
	log(`${team} requested`);
	res.send({msg:team});
});

function log(msg) {
	console.log(`[server] ${msg}`);
}
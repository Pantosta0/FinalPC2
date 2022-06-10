const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const db = require("./queries");
const info = require("./message-data");

// parsing middlewares and encoding
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// creating databases if don´t exist
db.createTablesIfDontExist();

//informative endpoint
app.get('/', (request, response) => {
    response.json({ status: "success", ...info });
})

// endpoint to check connection
app.get('/checkConnection', async (request, response) => {
    const connectionResult = await db.checkConnection();
    response.json({ status: connectionResult === "ok" ? "success" : "error", data: { connection: connectionResult } });
})

// endpoint to create new hash
app.get('/hash/:id', db.createNewHash);

// endpoint to validate a hash
app.get('/validate/:id', db.validateHash);

// return s table
app.get('/stable', db.getAllSTableInfo);

// return a table
app.get('/atable', db.getAllATableInfo);

// return a table
app.get('/delete', db.deleteAllInfo);

// start server 
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});
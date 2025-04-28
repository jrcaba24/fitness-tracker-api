const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const userRoutes = require("./routes/users.js");


require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () => console.log("We're connected to the database"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = 3000;

const corsOptions = {
	origin: [
		'http://localhost:3000',
	],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use("/users", userRoutes);

if(require.main === module){
	app.listen(process.env.PORT || port, () => console.log(`Server running at port ${process.env.PORT || port}`));
}

module.exports = {app,mongoose};
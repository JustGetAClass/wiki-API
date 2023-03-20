const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));

async function main() {
	const url = "mongodb://127.0.0.1:27017/wikiDB";
	await mongoose.connect(url, { useNewUrlParser: true });
}

const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", (req, res) => {
	Article.find()
		.then((foundArticles) => {
			res.send(foundArticles);
		})
		.catch((err) => res.send(err));
});

app.post("/articles", (req, res) => {
	const newArticle = new Article({
		title: req.body.title,
		content: req.body.content,
	});
	newArticle
		.save()
		.then(() => res.send("successfully added!"))
		.catch((err) => res.send(err));
});

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});

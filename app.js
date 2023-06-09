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

//* Request targetting all articles ////////////////////

app.route("/articles")

	.get((req, res) => {
		Article.find()
			.then((foundArticles) => {
				res.send(foundArticles);
			})
			.catch((err) => res.send(err));
	})

	.post((req, res) => {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content,
		});
		newArticle
			.save()
			.then(() => res.send("successfully added new article!"))
			.catch((err) => res.send(err));
	})

	.delete((req, res) => {
		Article.deleteMany()
			.then(() => res.send("Successfully deleted all articles!"))
			.catch((err) => res.send(err));
	});

//* Request targetting a specific article ////////////////////

app.route("/articles/:articleTitle")

	.get((req, res) => {
		Article.findOne({ title: req.params.articleTitle })
			.then((foundArticle) => res.send(foundArticle))
			.catch((err) =>
				res.send("No articles matching that title was found!")
			);
	})
	//* replaces both title or content regardless of which field is filled in.
	.put((req, res) => {
		Article.replaceOne(
			{
				title: req.params.articleTitle,
			},
			{
				title: req.body.title,
				content: req.body.content,
			}
		)
			.then(() => res.send("Successfully Updated article!"))
			.catch((err) => res.send(err));
	})
	//* can either replace title or content without changing the other
	.patch((req, res) => {
		Article.updateOne(
			{
				title: req.params.articleTitle,
			},
			req.body
		)
			.then(() => res.send("Successfully patched article!"))
			.catch((err) => res.send(err));
	})

	.delete((req, res) => {
		Article.deleteOne({
			title: req.params.articleTitle,
		})
			.then(() => res.send("Successfully deleted article"))
			.catch((err) => res.send(err));
	});

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});

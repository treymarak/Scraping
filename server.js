var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var mongojs = require("mongojs");
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

// var databaseUrl = "scraper";
// var collections = ["scrapedData"];

// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

// var Note = require('./models/Note.js');
// var Article = require('./models/Article.js');


app.get('/', function(req, res) {
  res.send(index.html);
});


app.get('/scrape', function(req, res) {
	// console.log(res);
  request("https://news.ycombinator.com/", function(error, response, html) {
		// console.log(html);
    var $ = cheerio.load(html);
    $('tbody tr').each(function(i, element) {
				var result = {};

				result.title = $(this).children('td').children('a').text();
				result.link = $(this).children('td').children('a').attr('href').text()
				console.log(result);
				// var entry = new Article (result);

				// console.log(this);

				// entry.save(function(err, doc) {
				//   if (err) {
				//     console.log(err);
				//   } else {
				//     console.log(doc);
				//   }
				// });


    });
  });
  res.send("Scrape Complete");
});


// app.get('/articles', function(req, res){
// 	Article.find({}, function(err, doc){
// 		if (err){
// 			console.log(err);
// 		} else {
// 			res.json(doc);
// 		}
// 	});
// });


// app.get('/articles/:id', function(req, res){
// 	Article.findOne({'_id': req.params.id})
// 	.populate('note')
// 	.exec(function(err, doc){
// 		if (err){
// 			console.log(err);
// 		} else {
// 			res.json(doc);
// 		}
// 	});
// });


app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});

		}
	});
});




app.listen(3000, function() {
  console.log('App running on port 3000!');
});
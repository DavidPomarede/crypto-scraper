var cheerio = require("cheerio");
var request = require("request");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var Save = require("../models/Save");


module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        request("https://www.coindesk.com/", function (error, response, html) {

            var $ = cheerio.load(html);
            console.log(response.body);
            $("a.stream-article").each(function (i, element) {
                var result = {};
                result.title = $(element).attr("title");
                result.summary = $(element).children("div.meta").children("p").text();
                result.link = $(element).attr("href");
                // result.byline = $("div.post-preview-item-inline__text").children("p.byline").text();
                if (result.title && result.link) {
                    var entry = new Article(result);
                    Article.update(
                        {link: result.link},
                        result,
                        { upsert: true },
                        function (error, doc){
                            if (error) {
                                console.log(error);
                            }
                        }
                    );
                }
            });
            res.json({"code" : "success"});
        });
    });

    app.get("/articles", function (req, res) {
        Article.find({}, function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.send(doc);
            }
        });
    });

    app.get("/articles/:id", function (req, res) {
        Article.find({
                "_id": req.params.id
            })
            .populate("note")
            .exec(function (error, doc) {
                if (error) {
                    console.log(error)
                } else {
                    res.send(doc);
                }
            });
    });

    app.get("/saved/all", function (req, res) {
        Save.find({})
            .populate("note")
            .exec(function (error, data) {
                if (error) {
                    console.log(error);
                    res.json({"code" : "error"});
                } else {
                    res.json(data);
                }
            });
    });

    app.post("/save", function (req, res) {
        var result = {};
        result.id = req.body._id;
        result.summary = req.body.summary;
        result.byline = req.body.byline;
        result.title = req.body.title;
        result.link = req.body.link;
        var entry = new Save(result);

        entry.save(function (err, doc) {
            if (err) {
                console.log(err);
                res.json(err);
            }
            else {
                res.json(doc);
            }
        });
    });

    app.delete("/delete", function (req, res) {
        var result = {};
        result._id = req.body._id;
        Save.findOneAndRemove({
            '_id': req.body._id
        }, function (err, doc) {
            if (err) {
                console.log("error:", err);
                res.json(err);
            }
            else {
                res.json(doc);
            }
        });
    });

    app.get("/notes/:id", function (req, res) {
        if(req.params.id) {
            Note.find({
                "article_id": req.params.id
            })
            .exec(function (error, doc) {
                if (error) {
                    console.log(error)
                } else {
                    res.send(doc);
                }
            });
        }
    });


    app.post("/notes", function (req, res) {
        if (req.body) {
            var newNote = new Note(req.body);
            newNote.save(function (error, doc) {
                if (error) {
                    console.log(error);
                } else {
                    res.json(doc);
                }
            });
        } else {
            res.send("Error");
        }
    });

    app.get("/notepopulate", function (req, res) {
        Note.find({
            "_id": req.params.id
        }, function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.send(doc);
            }
        });
    });

    app.delete("/deletenote", function (req, res) {
        var result = {};
        result._id = req.body._id;
        Note.findOneAndRemove({
            '_id': req.body._id
        }, function (err, doc) {
            if (err) {
                console.log("error:", err);
                res.json(err);
            }
            else {
                res.json(doc);
            }
        });
    });
}
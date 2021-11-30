const express = require("express");
const bodyParser = require("body-parser");
app = express();

const MongoClient = require("mongodb").MongoClient;
const { ObjectID } = require("bson");

let db;
const url = "mongodb://localhost:27017";
const dbName = "myCity";
const client = new MongoClient(url);

client.connect((err) => {
    if (err) return console.log(err);
    db = client.db(dbName);
    app.listen(3000, () => console.log("API started"));
});
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/City", (req, res) => {
    db.collection("City")
        .find()
        .toArray((err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.status(200).json(result);
        });
});

app.post("/City", (req, res) => {
    let joke = {
        text: req.body.text,
    };

    db.collection("City").insertOne(joke, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.status(200).json(joke);
    });
});

app.delete("/City/:id", (req, res) => {
    db.collection("City").deleteOne({ _id: ObjectID(req.params.id) }, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.status(200).json(result);
    });
});

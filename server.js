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

app.get("/Weather", (req, res) => {
    db.collection("Weather")
        .find()
        .toArray((err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.status(200).json(result);
        });
});

app.post("/Weather", (req, res) => {
    let weather = {
        text: req.body.text,
    };

    db.collection("Weather").insertOne(weather, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.status(200).json(weather);
    });
});

app.delete("/Weather/:id", (req, res) => {
    db.collection("Weather").deleteOne({ _id: ObjectID(req.params.id) }, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.status(200).json(result);
    });
});

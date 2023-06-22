const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();

const url = "mongodb://localhost:27017";
const dbName = "todo";
const collectionName = "items";

var items_name = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    } else {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      collection.find().toArray((err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal server error");
        } else {
          items_name = result.map((item) => ({ id: item._id, name: item.itemName }));
          console.log(result);
          res.render("list", {
            kindOfDay: "Today",
            newListItem: items_name,
          });
        }

        client.close();
      });
    }
  });
});

app.get("/:customListName", function (req, res) {
  console.log(req.params.customListName);
});

app.post("/", (req, res) => {
  const item = req.body.new_item;

  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    } else {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      collection.insertOne({ itemName: item }, (err, result) => {
        if (err) {
          console.log(err);
        }

        client.close();
        res.redirect("/");
      });
    }
  });
});

app.post("/delete", (req, res) => {
  const item = req.body.checkbox;

  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    } else {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      collection.deleteOne({ _id: item }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("deleted successfully");
          res.redirect("/");
        }

        client.close();
      });
    }
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

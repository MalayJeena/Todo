const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const {ObjectId} = require("mongodb");

const app = express();

const url = "mongodb://127.0.0.1:27017";
const dbName = "todo";
const collectionName = "items";

var items_name = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((client) => {
      const db = client.db('todo');
      const collection = db.collection(collectionName);
      collection.find({}).toArray()
          .then((foundItems) => {
              console.log(foundItems);
              res.render("list", {
                  kindOfDay: "Today",
                  newListItem: foundItems,
              });
          })
          .catch((error) => {
              console.log(error.message);
              res.status(500).send("Internal server error");
          })
          .finally(() => {
              client.close();
          });
  })
  .catch((err) => {
      throw err;
  });
});

app.get("/:customListName", function (req, res) {
  console.log(req.params.customListName);
});

app.post("/", (req, res) => {
  var item = req.body.new_item;
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const db = client.db('todo');
        const collection = db.collection(collectionName);
          collection.insertOne({itemsname: item})
              .then((client) => {
                console.log("Inserted Successfully",client);
                  res.redirect('/');
              })
              .catch((error) => {
                  console.log(error.message);
                  res.status(500).send("Internal server error");
              })
              .finally(() => {
                  client.close();
              });
          })
      .catch((err) => {
          throw err;
      });
});


app.post("/delete", (req,res) => {
  //console.log(req.body.checkbox);
  const itemId = req.body.checkbox;
  // const objectId = ObjectId(itemId)

  console.log(itemId);

  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const db = client.db('todo');
        const collection = db.collection(collectionName);
          collection.deleteOne({_id: new ObjectId(itemId)})
              .then((client) => {
                  console.log("Deleted Successfully",client);
                  res.redirect('/');
              })
              .catch((error) => {
                  console.log(error.message);
                  res.status(500).send("Internal server error");
              })
              .finally(() => {
                  client.close();
              });
          })
      .catch((err) => {
          throw err;
      });
});



app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

const express = require("express");
const bodyParser = require("body-parser");
// const day = require(__dirname+"/date.js");
const Pool = require("pg").Pool;
//console.log(day());

const app = express();

const pool = new Pool({
    user: "postgres",
	host: "localhost",
	database: "todo",
	password: "root",
	port: 5432,
});

var items_name = [];    // [{1: book, 2: pen}] {id: 1, name: book}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", (req, res) => {
    // const todayDay = day();

    pool.query("SELECT id, itemname FROM items", (error, response) => {
      if (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
      } else {
        items_name = response.rows.map((row) => ({ id: row.id, name: row.itemname }));
        console.log(response.rows);
        // console.log(items_name);
        res.render("list", {
          kindOfDay: "Today",
          newListItem: items_name,
        });
      }
    });
    
});


app.get("/:customListName", function(req,res){
    console.log(req.params.customListName);
});


app.post("/", (req, res) => {
    var item = req.body.new_item;
    // items_name.push(item);
    //console.log(item_name);
    pool.query("INSERT INTO items(itemName) VALUES($1)", [item], (error, response) => {
        if (error) {
            console.log(error.message);
        }
    });
    res.redirect("/");
});


app.post("/delete", (req,res) => {
    //console.log(req.body.checkbox);
    const item = req.body.checkbox;
    pool.query("DELETE FROM items WHERE id=$1",[item], (err, result) => {
        if (err){
            console.log(err.message);
        }else {
            console.log("deleted successfuly")
            res.redirect("/");
        }
    });

});



app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
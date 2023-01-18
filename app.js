//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongo
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser : true});

const itemsSchema ={
  name : String
};
const Item = mongoose.model("Item",itemsSchema);

const cook= new Item ({
  name :"Eat"
});
const eat= new Item ({
  name :"Code"
});
const repeat= new Item ({
 name :"Repeat"
});

const defaultItems = [cook,eat,repeat];

const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {
    Item.find({},function(err,foundItems){
      if(foundItems.length === 0){
        Item.insertMany(defaultItems,function(err){
          if(err){
          console.log(err);
          }
          else{
            console.log("Inserted succesfully!");
          }
        });
        res.redirect("/");
      }
      else{
        res.render("list", {listTitle: "Today", newListItems: foundItems});
      }
    });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name : itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/"); //to get that updated in page
  }
  else{
    List.findOne({name: listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }
});

app.post("/delete",function(req,res){
const checkedItemId= req.body.cbox;
const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
          console.log("Removed succesfully!");      
      res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id:checkedItemId}}},function(err,foundList){  //pull is used to delete a single documents= from the array items
      if(!err){
        res.redirect("/"+ listName);
      }
    });
  }
});

app.get("/:customListName",(req,res)=>{
  const customListName =_.capitalize(req.params.customListName);
  List.findOne({name : customListName},function(err,foundList){
    if(!err){
      if(!foundList){
       // create new list
        const list = new List({
          name : customListName,
          items : defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      
        
      }
      else{
        //show existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        
      }
    }
  });
  
});




app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

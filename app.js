//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname+"/date.js");



const items = ["read","code","sleep"];
const workItems=[];

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",(req,res)=>{
  let day=date.getDate();
res.render("list", { day : day, newListItems: items });
});


app.post("/",(req,res)=>{
 const item =  req.body.newItem;
if(req.body.list === "Work"){
  workItems.push(item);
  res.redirect("/work");
}else{
  items.push(item);
  res.redirect("/");
}
  console.log(item);

});

app.get("/work",(req,res)=>{
  res.render("list",{listTitle: "Work List",newListItems : workItems})
});
app.get("/about",(req,res)=>{
  res.render("about");
});
app.listen(3000,()=>{
    console.log("Server started");
});

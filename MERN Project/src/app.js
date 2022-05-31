const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

require("./db/conn")
let mongoose = require("mongoose");

let bodyParser = require("body-parser");

let User = require("./models/User");
const Contact = require("./models/Contact")
const hbs = require("hbs")
const path = require("path")



const port = process.env.PORT || 4000

const app = express()

const templatePath = path.join(__dirname, "../templates/views")
const jsPath = path.join(__dirname, "../public/js")
const partialsPath = path.join(__dirname, "../templates/partials") 

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static("public"))

hbs.registerPartials(partialsPath)

app.set("view engine", "hbs")
app.set("views", templatePath)

app.use(bodyParser.urlencoded({ extended: true }));

// routes
let destlist = [
    "Europe",
    "Canada",
    "Thailand",
    "Australia",
    "Greece",
];
app.get("/", (req, res)=>{


    res.render("home", {
        value1: "active",
        destList: destlist,
    })

})

app.post("/check-status", (req, res)=>{
    res.render("destination")
})

app.get("/about", (req, res)=>{
    res.render("about", {
        value2: "active",
    })
})

app.get("/about/:id", (req, res)=>{
    console.log(req.params.id)
    res.render("about", {
        value2: "active",
    })
})

app.get("/blog", (req, res)=>{
    res.render("blog", {
        value5: "active",
    })
})

app.get("/destination", (req, res)=>{
    res.render("destination", {
        value3: "active",
    })
})

app.get("/hotel", (req, res)=>{
    res.render("hotel", {
        value4: "active",
    })
})

app.get("/contact", (req, res)=>{
    res.render("contact", {
        value6: "active",
    })
})

app.post("/contact", (req, res)=>{
    let name = req.body.name
    let email = req.body.email
    let subject = req.body.subject
    let message = req.body.message
    let contact = new Contact({
        id : Date.now(),
        name : name,
        email : email,
        subject : subject,
        message : message,
    })
    contact.save()
    res.render("contact")
})



app.get("/register",(req, res)=>{
    res.render("register")
})


app.post("/register",(req, res)=>{
    if(req.body.password != req.body.password1){
        return res.render("register",{
            "message" : "Password Doesn't Match"
        })
    }

    let exists = false;
    User.find({}, function(err, users){
        users.forEach(user => {
            if(user.email === req.body.email){
                console.log(user.email == req.body.email);
                exists = true;
            }
        });
    })
    if(exists === false){
        bcrypt.hash(req.body.password, 10, function(err, hashedPass){
            if(err){
                res.json({
                    "error":err
                })
            }
        
            let user = new User({
                id:Date.now(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPass
            })
            user.save()
            
        })
        res.redirect("/login")
    }
    else{
        return res.render("register",{
            "message" : "Account Already Exists",
        })
    }
})

app.get("/login",(req, res)=>{
    res.render("login")
})


app.post("/login", (req, res)=>{
    let exists = false;
    let loggedUser = null
    
    User.find({}, function(err, users){
        for (let index = 0; index < users.length; index++) {
            console.log(users[index].email);
            if(users[index].email == req.body.email){
                
                loggedUser = users[index];
                exists = true;
            }
            
        }
        
            if(exists){
                bcrypt.compare(req.body.password, loggedUser.password, function(err, result){
                    if(err){
                        return res.render("login", {
                            "message" : "Password Doesn't match!"
                        })
                    }
                    if(result){
                        let token = jwt.sign({name: loggedUser.email}, "verySecretValue", {expiresIn:"1h"})
                        console.log(token);
                        res.render("home", {
                            "loggedUser" : loggedUser,
                            "destList" : destlist,
                        })
                    }
                    else{
                        res.render("login", {
                            "message" : "Password Doesn't match!"
                        })
                    }
                })
            }
            else{
                return res.render("login", {
                    "message" : "Account Not found!"
                })
            }
        })


})






// listen to portal
app.listen(port, ()=>{
    console.log(`http://127.0.0.1/${port}` );
})


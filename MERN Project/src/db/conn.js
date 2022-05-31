// const mongoose = require("mongoose")

// mongoose.connect("mongodb://127.0.0.1:27017/onegovacay", {useNewUrlParser: true}).then(()=>{
//     console.log("Connected to the database!!");
// }).catch((error)=>{
//     console.log(error);
// })

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/onegovacay', {useNewUrlParser: true});
const conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;
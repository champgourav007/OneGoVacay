const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
    id:{
        type:Number
    },
    name:{
        type:String
    },
    email:{
        type:String,
    },
    subject:{
        type:String
    },
    message:{
        type:String
    }
}, {timestamps:true})

const Contact = mongoose.model('contact', userSchema)
module.exports = Contact
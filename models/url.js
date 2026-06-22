const mongoose=require("mongoose");
const { type } = require("node:os");

const url=new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true,
    },
    redirectUrl:{
        type:String,
        required:true,

    },
    visitHistory:[{
        timestamp:{
            type:Number,
        }
    }]
} ,
{
    timestamps:true
}
);
const Url=mongoose.model("Data",url);

module.exports=Url;

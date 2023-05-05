const { default: mongoose } = require("mongoose")
const AuthSchemaCustomers = new mongoose.Schema({
    Name:{
        type:String,
        require:true,
    },
    Uses:{
        type:String,
        require:true,
    },
    Subject:{
        type:String,
        default:""
    },
    description:{
        type:String,
        require:true,
    },
    Imgurl:
     {
        type:String,
        require:true
     }


})

module.exports = mongoose.model("Products",AuthSchemaCustomers)
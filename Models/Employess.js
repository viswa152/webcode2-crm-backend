const { default: mongoose } = require("mongoose")
const AuthSchemaEmployee = new mongoose.Schema({
    Name:{
        type:"String",
        require:true,
    },
    Email:{
        type:"String",
        require:true,
    },
    Address:{
        type:"String",
        require:true,
    },
    Position:{
        type:"String",
        require:true,
    },
    Type:{
        type:"string",
        default:"Employee",
    }

})

module.exports = mongoose.model("Auth",AuthSchemaEmployee)
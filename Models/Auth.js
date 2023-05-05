const { default: mongoose } = require("mongoose")
const AuthSchema = new mongoose.Schema({
    FirstName:{
        type:"String",
        require:true,
    },
    LastName:{
        type:"String",
        require:true,
    },
    Email:{
        type:"String",
        require:true,
    },
    Password:{
        type:"String",
        require:true,
    },
    Type:{
        type:"string",
        default:"User",
    },
    resetToken:{
        type:"String",
        default:""
    },
    Address:{
        type:"String",
        default:""
    },
    Position:{
        type:"String",
        default:""

    },

})

module.exports = mongoose.model("Auth",AuthSchema)
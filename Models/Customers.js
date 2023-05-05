const { default: mongoose } = require("mongoose")
const AuthSchemaCustomers = new mongoose.Schema({
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
    CompanyName:{
        type:"String",
        require:true,
    },
    Password:{
        type:"String",
        require:true,
    },
    DomainName:{
        type:"String",
        require:true,
    },
    Status:{
        type:"string",
        default:"Created",
    },
    Subject:{
        type:"string",
        default:""
    }

})

module.exports = mongoose.model("Customers",AuthSchemaCustomers)
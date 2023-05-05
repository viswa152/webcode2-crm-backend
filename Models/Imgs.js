const { default: mongoose } = require("mongoose")
const ImgSchema = new mongoose.Schema({

    Imgurl:
     {
        type:String,
        require:true
     }


})

module.exports = mongoose.model("Img",ImgSchema)
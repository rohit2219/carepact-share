import mongoose from "mongoose";

const fileUpload = mongoose.Schema({
    invoiceno : {
        type:String,
        required:true
    },
    filepath: {
        type: String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    Date:{
        type: Date,
        default:Date.now
    }
})

const fileUploadLog = mongoose.model('fileUploadLog', fileUpload);

export default fileUploadLog
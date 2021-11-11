const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Making file schema
const FileSchema = new Schema({
    fileName: {type : String, required: true},
    path: {type: String, required: true},
    size: {type : Number, required: true},
    uuid: {type : String, required: true},
    sender: {type : String, required: false},
    receiver: {type : String, required: false}
}, {timestamps: true});

//Exporting model File. A collection named files will be created for this model
module.exports = mongoose.model('File', FileSchema);
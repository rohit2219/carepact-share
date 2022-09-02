import mongoose from "mongoose";

const inventoryuploadschema = mongoose.Schema({
    file_path: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default:Date.now
    }
});

const Inventory_upload = mongoose.model("Inventory_upload", inventoryuploadschema);

export default Inventory_upload;
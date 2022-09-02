import mongoose from "mongoose";

const inventorylogschema = mongoose.Schema({
    user_id: {
        type: String,
        // required: true,
      },
    itemcode: {
        type: String,
        required: true,
    },
    itemname: {
        type: String,
        required: true,
      },
    batch: {
        type: String,
        default:0,
    
    },
    old_qty: {
        type: Number,
        default:0,
        
    },
    new_qty: {
        type: Number,
        default:0,
    },
    new_price: {
        type: Number,
        default:0,
    },
    old_price: {
        type: Number,
        default:0,
        
    },
    old_mrp: {
        type: Number,
        default:0,
        
    },
    new_mrp: {
        type: Number,
        default:0,
    },
    old_hsn: {
        type: String,
        default:0,
        
    },
    new_hsn: {
        type: String,
        default:0,
    },
    action: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default:Date.now
    }
});

const Inventory_log = mongoose.model("Inventory_log", inventorylogschema);

export default Inventory_log;

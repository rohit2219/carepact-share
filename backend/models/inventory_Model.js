import mongoose from "mongoose";

const inventoryschema = mongoose.Schema({
  
  item_name: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  exp_date: {
    type: Date,
    required: true,
  },
  rate: {
    type: String,
    required: true,
  },
  rack: {
    type: String,
    required: true,
  },
  subrack: {
    type: String,
    required: true,
  },
  fridge: {
    type: String,
    required: true,
  },
  mrp: {
    type: String,
    required: true,
  },
  hsn: {
    type: String,
    required: true,
  },
  taxper: {
    type: String,
    required: true,
  },
  stock_qty: {
    type: Number,
    required: true,
  },
  composition: {
    type: String,
    required: true,
  },
  tax_per: {
    type: String,
    
  },
});

const Inventory_stock = mongoose.model("Inventory_stock", inventoryschema);

export default Inventory_stock;

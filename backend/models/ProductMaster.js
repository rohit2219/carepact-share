import mongoose from "mongoose";

const product_master = mongoose.Schema({
  m_line_id: {
    type: String,
    // required: true,
  },
  manufacture: {
    type: String,
    // required: true,
  },
  product: {
    type: String,
    // required: true,
  },
  Itemcode: {
    type: String,
    // unique: true,
    // required: true,
  },
  major_content: {
    type: String,
    // required: true,
  },
  group_id: {
    type: String,
    // required: true,
  },
  schname: {
    type: String,
    // required: true,
  },
  itemcategoryId:{
    type: String,
    // required: true,
  },
  pack: {
    type: String,
    // required: true,
  },
  rack: {
    type: String,
    // required: true,
  },
  subrack: {
    type: String,
    // required: true,
  },
  uom: {
    type: String,
    // required: true,
  },
  hsn: {
    type: String,
    // required: true,
  },
  mrp: {
    type: String,
    // required: true,
  },
 
  strip_sale: {
    type: String,
    // required: true,
  },
 
 fridge: {
    type: String,
    // required: true,
  },
  box: {
    type: Number,
    // required: true,
  },
  case: {
    type: Number,
    // required: true,
  }
});

const ProductMaster = mongoose.model("product_master", product_master);

export default ProductMaster;

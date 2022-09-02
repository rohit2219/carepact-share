import mongoose from "mongoose";

const product_master_duplicate = mongoose.Schema({
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
    type: Number,
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
  },
  duplicate_grade: {
    type: Number,
    default:0
    // required: true,
  },
  exp_date: {
     type: String
     },
  batch:{
    type:String
  }
});

const ProductMaster_duplicate = mongoose.model("product_master_duplicate", product_master_duplicate);

export default ProductMaster_duplicate;

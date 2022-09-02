import mongoose from "mongoose";

const product_master = mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  manufacture: {
    type: String,
    required: true,
  },
  hsn: {
    type: String,
    required: true,
  },
  sch_name: {
    type: String,
    required: true,
  },
  uom: {
    type: String,
    required: true,
  },
  strip: {
    type: String,
    required: true,
  },
  pack: {
    type: String,
    required: true,
  },
  loc: {
    type: String,
    required: true,
  },
  rack: {
    type: String,
    required: true,
  },
  subtrack: {
    type: String,
    required: true,
  },
  mrp: {
    type: String,
    required: true,
  },
  major_content: {
    type: String,
    required: true,
  },
  sgst: {
    type: String,
    required: true,
  },
  strd_disc: {
    type: String,
    required: true,
  },
  cgst: {
    type: String,
    required: true,
  },
  max_disc: {
    type: String,
    required: true,
  },
  igst: {
    type: String,
    required: true,
  },
  gst_flag: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("product_master", product_master);

export default Product;

import mongoose from 'mongoose'

const ProductMasterSchema = new mongoose.Schema(
  {
    products: [{
      itemname: { type: String },
      itemcode: { type: String },
      manufacture: { type: String },
      pur_rate: { type: Number },
      batchno: { type: String },
      qty: { type: Number },
      hsncode: { type: String },
      rack: { type: String },
      subrack: { type: String },
      fridge: { type: String },
      dis_per: { type: String },
      mrp: { type: Number },
      freeqty: { type: Number },
      dis_amnt: { type: String },
      sgst: { type: Number },
      cgst: { type: Number },
      taxper: { type: Number },
      tax_amnt: { type: String },
      taxable_amnt: { type: String },
      exp_date: { type: Date },
      netamount:{ type: Number },
      verifyStatus: { type: Boolean , default: false},
      
    }],
    invoiceno: { type: String },
    supplierId: { type: String },
    supplierName: { type: String },
    billdate: { type: String },
    payment: { type: String },
    grand_total:{ type: Number },
    status: { type: String },
    type: { type: String },
    verify: { type: Boolean , default: false},
    
  },
  { timestamps: true }
);

const PurchaseMaster = mongoose.model("PurchaseMaster", ProductMasterSchema);

export default PurchaseMaster

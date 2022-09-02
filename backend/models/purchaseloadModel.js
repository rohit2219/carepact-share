import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema;


const PurchaseItemSchema = new mongoose.Schema({

    itemname: { type: String },
    pur_rate: { type: Number },
    batchno: { type: String },
    qty: { type: Number },
    hsncode: { type: String },
    rack: { type: String },
    subrack: { type: String },
    fridge: { type: String },
    dis_per: { type: String },
    sch_disc_per: { type: String },
    mrp: { type: Number },
    freeqty: { type: Number },
    dis_amnt: { type: String },
    sgst: { type: Number },
    cgst: { type: Number },
    taxper: { type: Number },
    tax_amnt: { type: String },
    taxable_amnt: { type: String },
    exp_date: { type: String },
    netamount: { type: Number },
    scan_verify: { type: String },
    verify_qty: { type: String },
    verify_freeqty: { type: String },
    totalCount: { type: Number, default: 0 }


});
const PurchaseItem = mongoose.model("PurchaseItem", PurchaseItemSchema);


const PurchaseMasterSchema = new mongoose.Schema({
    products: [PurchaseItemSchema],
    invoiceno: { type: String },
    distributor: { type: String },
    billdate: { type: String },
    grand_total: { type: Number },
    status: { type: String },
    customername: { type: String },
    customer_contactno: { type: Number },
    serverfilelocation: { type: String },
    isactive: { type: Number, default: 0 },
    billfile: {
        data: Buffer,
        contentType: String,
    },
    billfilesize: {
        type: String,
    },
    verify_complete: { type: Boolean, default: false },
    partial_verify_status: { type: String }

}, { timestamps: true })


const PurchaseloadMaster = mongoose.model('PurchaseloadMaster', PurchaseMasterSchema)

export default PurchaseloadMaster
import mongoose from "mongoose";

import moment from 'moment'
const currentDate = moment().format('DD/MM/YYYY');
const carePactLogsSchema = mongoose.Schema({
    uniqid: { type: String, default: "" },
    purchaseId: { type: String, required: true, trim: true },
    flag: { type: String, required: true, trim: true },
    distributorId: { type: String, trim: true },
    purchase_invoice_number: { type: String, trim: true },
    products: [{
        product_name: { type: String, trim: true },
        mrp: { type: String, trim: true },
        xpiry_date: { type: String, trim: true },
        batchno: { type: String, trim: true },
        grade: { type: Number, trim: true },
    }],
    duplicate_products: [{
        item_name: { type: String, trim: true },
        batch: { type: String, trim: true }
    }],
    customer_name: { type: String, trim: true },
    distributor_name: { type: String, trim: true },
    ocrInput: { type: String, trim: true },
    grade: { type: String, trim: true },
    identified_Item: { type: String, trim: true },
    timeStamp: { type: String, trim: true, default: Date.now },
    images: { type: String, trim: true },
    customerReportMessage: { type: String, trim: true },
    base64ImageString: { type: String, dafaul: "" },
    awsflag: { type: Boolean, default: false },

    date: { type: String, default: currentDate }

})

const CarePactLogsModel = mongoose.model('carepactLogs', carePactLogsSchema);
export default CarePactLogsModel
import mongoose from "mongoose";

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
    savedLogLength: { type: Number, default: 0 }

})

const saveLongInLocalCarepactSchema = mongoose.Schema({
    datalength: { type: Number, default: 0 }
})

const saveLongInAWSCarepactSchema = mongoose.Schema({
    datalength: { type: Number, default: 0 }
})
const CarePactLogsModel = mongoose.model('carepactLogs', carePactLogsSchema);
const carepactLogsLengthInLocalModel = mongoose.model('carepactLogsLengthInLocal', saveLongInLocalCarepactSchema);
const carepactLogsLengthInAwsModel = mongoose.model('carepactLogsLengthInAWS', saveLongInAWSCarepactSchema);

export default CarePactLogsModel
export { carepactLogsLengthInLocalModel, carepactLogsLengthInAwsModel }
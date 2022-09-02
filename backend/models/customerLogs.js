import mongoose from "mongoose";

import moment from 'moment'
const currentDate = moment().format('DD/MM/YYYY');
const customerLogsSchema = mongoose.Schema({
        purchaseId: { type: String, required: true, trim: true },
        products: [{
            product_name: { type: String, trim: true },
            mrp: { type: String, trim: true },
            xpiry_date: { type: String, trim: true },
            batchno: { type: String, trim: true },
            grade: { type: Number, trim: true },
        }],
        purchase_invoice_number: { type: String, trim: true },

        timeStamp: { type: String, trim: true, default: Date.now() },

        date: { type: String, default: currentDate },
        images: { type: String, trim: true },
        customer_name: { type: String, trim: true },
        verify: { type: Boolean, default: false },

    }, {
        timestamps: true,
    }

)

const customerLogsModel = mongoose.model('customerLogs', customerLogsSchema);

export default customerLogsModel
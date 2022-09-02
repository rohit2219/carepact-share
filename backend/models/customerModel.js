import mongoose from "mongoose";

import moment from 'moment'
const currentDate = moment().format('DD/MM/YYYY');
const customerSchema = mongoose.Schema({
        name: { type: String, trim: true, default: "" },
        address: { type: String, trim: true, default: "" },
        phone: { type: Number, trim: true, default: "" },
        location: { type: String, trim: true, default: "" },
        customerLogId: { type: String, trim: true, default: "" },
        scannerId: { type: String, trim: true, default: "" },
        customerUniqueId: { type: String, trim: true, default: "" },
        date: { type: String, default: currentDate },
    }, {
        timestamps: true,
    }

)

const customerModel = mongoose.model('customerDetail', customerSchema);

export default customerModel
import mongoose from 'mongoose'

const accountSchema = mongoose.Schema(
  {
    supplierId: {
      type: String,
      required: true,
    },
    supplierName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 1,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index:true,
        sparse:true
    },
    mobile: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    supplierGst: {
        type: Number,
    },
    gstType: {
      type: String,
      required: true,
    },
    discount: {
        type: Number,
        rdefault: 0.0,
    },
    gstValid: {
        type: Date,
    },
    supplierDlno1: {
        type: Number,
    },
    supplierDlno2: {
        type: Number,
    },
    autoLock: {
        type: String,
        required: true,
        default: 1,
    },
    accountHead: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: Number,
    },
    bankName: {
        type: String,
        required: true,
    },
    branchName: {
        type: String,
    },
    bankIfsc: {
      type: String,
      required: true,
    },
    bankMicr: {
      type: String,
      required: true,
    },
    billType: {
      type: String,
      required: true,
    },
    panNo: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
    },
    creditDays: {
      type: Number,
      default: 0
    },
    creditLimit: {
      type: Number,
      default: 0
    },
    debitDays: {
      type: Number,
      default: 0
    },
    debitLimit: {
      type: Number,
      default: 0
    },
    noOfbills: {
      type: Number,
      default: 0
    },
    lockDays: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    allowSales: {
      type: Boolean,
      required: true,
      default: false,
    },
    allowPurchase: {
      type: Boolean,
      required: true,
      default: false,
    },
    isLock: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  {
    timestamps: true,
  }
)

const Account = mongoose.model('Account', accountSchema)

export default Account

import mongoose from 'mongoose'

const returnSchema = new mongoose.Schema({
    productarray: [{
        itemcode: {
            type:String,
            
        },
        itemname: {
            type:String,
            required:true
        },
        batchno: {
            type:String,
            required:true
        },
        qty: {
            type: Number,
            required:true
            },
        exp_date: { 
            type: Date 
          },
        pur_rate: {
            type:Number,
            required:true
        },
        gst: {
            type:Number
        },
        discount: {
            type:Number
        },
        dis_amnt: {
            type:Number    
        },
        tax_amnt: {
            type:Number    
        },
        subtotal: {
            type:Number    
        },
      }],
      SupplierId: {
        type:String      
      },
      debitNo: {
        type:String    
      }, 
      Supplier: {
        type:String    
      },
      paymentMethod: {
        type:String    
      }, 
      returnType: {
        type:String    
      }, 
      returnStatus: {
        type:String    
      },  
      fileName: {
        type:String    
      }, 
      creditAmount: {
        type:Number    
      }, 
      creditNo: {
        type:String    
      },  
    date: {
        type: Date,
        default:Date.now
    }
    
})

const PurchaseReturn = mongoose.model('PurchaseReturn', returnSchema);

export default PurchaseReturn

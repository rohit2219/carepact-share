import Account from '../models/accountModel.js'
import PurchaseMaster from '../models/PurchaseMaster.js'
import asyncHandler from 'express-async-handler'
import ProductMaster from '../models/ProductMaster.js'
import Inventory_stock from '../models/inventory_Model.js'
import PurchaseReturn from '../models/PurchaseReturn.js'
import User from '../models/authModels.js'
import PurchaseloadMaster from "../models/purchaseloadModel.js"
import _ from 'lodash'

const getData = asyncHandler(async (req, res) => {
    Account.find({}, function(err, data) {
        if (err) {
          res.send({
            message: "CO-PRC-GD- data not found"
        }
        // err
    );
        } else {
          
          res.send(data);
        }
      });
  })
  const addReturn = asyncHandler(async (req, res) => {
    const {dataValues, contactArray } = req.body;
    const debitNo = dataValues.debitNo;
    const SupplierId = dataValues.SupplierId;
    const Supplier = dataValues.Supplier;
    const paymentMethod = dataValues.paymentMethod;
    const returnType = dataValues.returnType;
    // console.log(contactArray);
    const productarray= [];
    
    if (contactArray && contactArray.length === 0) {
      res.status(400).json({
        message: "CO-PRC-AR- No return items"
    })
    return;
    } 
    else {
      for(var i = 0; i < contactArray.length; i++) {
        // console.log(product[i].select);
        
          productarray.push({
            itemcode:req.body.contactArray[i].itemcode,
            itemname:req.body.contactArray[i].itemname,
            batchno:req.body.contactArray[i].batchno,
            qty:req.body.contactArray[i].qty,
            pur_rate:req.body.contactArray[i].pur_rate,
            gst:req.body.contactArray[i].gst,
            discount:req.body.contactArray[i].discount,
            subtotal:req.body.contactArray[i].subtotal,
            dis_amnt:req.body.contactArray[i].dis_amnt,
            tax_amnt:req.body.contactArray[i].tax_amnt,             
          });                    
          
    }
        // console.log(productarray);
        const returnOrder = new PurchaseReturn({
          productarray,
          debitNo,
          SupplierId,
          Supplier,
          paymentMethod,
          returnType,
        });
        returnOrder.save()
  
        .then(data =>{
          // console.log("haii");
          // res.json(data)
          res.send({ data: "Record has been Inserted..!!" });
        })
        .catch(error =>{
            res.json(error)
          })
        }
  
})
const insertReturn = asyncHandler(async (req, res) => {
  const {dataValues, product } = req.body;
  // console.log(product);

  
  const debitNo = dataValues.debitNo;
  const SupplierId = dataValues.SupplierId;
  const Supplier = dataValues.Supplier;
  const paymentMethod = dataValues.paymentMethod;
  const returnType = dataValues.returnType;
  const returnStatus = "P";
  const productarray= [];

  if (product && product.length === 0) {
    res.status(400).json({
      message: "CO-PRC-IR- No return items"
  })

  return;
  } else {
    for(var i = 0; i < product.length; i++) {
      // console.log(product[i].select);
      if(product[i].select === true)
      {
        productarray.push({
          itemcode:req.body.product[i].itemcode,
          itemname:req.body.product[i].itemname,
          batchno:req.body.product[i].batchno,
          exp_date:req.body.product[i].exp_date,
          qty:req.body.product[i].qty,
          pur_rate:req.body.product[i].pur_rate,
          gst:req.body.product[i].taxper,
          discount:req.body.product[i].dis_per,
          subtotal:req.body.product[i].netamount,
          dis_amnt:req.body.product[i].dis_amnt,
          tax_amnt:req.body.product[i].tax_amnt,             
        });   
        
      Inventory_stock.findOneAndUpdate({itemcode: req.body.product[i].itemcode}, {$inc : { "stock_qty": -req.body.product[i].qty}}, {useFindAndModify: false}, function(err, data) {
        // then(data =>{
        //   // console.log("haii");
        //     res.json(data)
        //     // res.send({ data: "Record has been Inserted..!!" });
        //   })
        //   .catch(error =>{
        //     // console.log(error)
        //       res.json(error)
        //     })
      });



     }      
  }
      // console.log(productarray);
      const returnOrder = new PurchaseReturn({
        productarray,
        debitNo,
        SupplierId,
        Supplier,
        paymentMethod,
        returnType,
        returnStatus,
      });
      returnOrder.save()

      .then(data =>{
      // console.log("haii");
        res.json(data)
        // res.send({ data: "Record has been Inserted..!!" });
      })
      .catch(error =>{
        res.json({ message: "CO-PRC-IR- not found" }
                    // error
                )
        })
      }
      
});
  // const suggestions = asyncHandler(async (req, res) => {
  // // var colName=req.params.supplierId;
  // // PurchaseMaster.find({item: {'$regex':new RegExp("^"+req.body.name,"i")}}, function(err, data) {
  //   // { "instock": { warehouse: "A", qty: 5 } }
  //   // find({
  //   //   instock: { qty: 5, warehouse: 'A' }
  //   // });
  //   // PurchaseMaster.find({products:{itemname:{'$regex':new RegExp("^"+req.body.name,"i")}}},function(err, data) {  
  //     // { "results.product": "xyz" }
  //   PurchaseMaster.find({ "products.itemname": {'$regex':new RegExp("^"+req.body.name,"i")}},function(err, data) {
  //   // PurchaseMaster.find({ $and: [ { products: {'$regex':new RegExp("^"+req.body.name,"i")}}, { supplierId: {'$regex':new RegExp("^"+req.body.supplierId,"i")} } ] } , function(err, data) {
  //       if (err) {
  //         res.send(err);
  //       } else {
          
  //         res.send(data);
  //       }
  //     });
  // })
  
  const suggestions = asyncHandler(async (req, res) => {
    Inventory_stock.find({item_name: {'$regex':new RegExp("^"+req.body.name,"i")}}, function(err, data) {
        if (err) {
          res.send({ message: "CO-PRC-SUGG- no data found" }
          // err
      );
        } else {
          
          res.send(data);
        }
      });
  })

  const getproducts = asyncHandler(async (req, res) => {
    // console.log(req.params.id);
    const supplier=req.params.id;
   PurchaseMaster.find({ supplierId: supplier }).populate('Inventory_stock').exec(function(err, data) {
    if (err) {
      res.send({
        message: "CO-PRC-GPRD- No data found"
    });
    } else {
      //console.log(data)
     var productarray= data[0].products;
     var products = []; 

     for(var i = 0; i < productarray.length; i++) {
       //console.log(productarray[i]);
       
       products.push({
                   itemcode:productarray[i].itemcode,
                   itemname:productarray[i].itemname,
                   batchno:productarray[i].batchno,
                   pur_rate:productarray[i].pur_rate,
                   hsncode:productarray[i].hsncode,
                   qty:productarray[i].qty,
                   tax_amnt:productarray[i].tax_amnt,
                   dis_amnt:productarray[i].dis_amnt,
                   dis_per:productarray[i].dis_per,
                   taxper:productarray[i].taxper,
                   taxable_amnt:productarray[i].taxable_amnt,
                   exp_date:productarray[i].exp_date,        
                   });                        
     } 
    // console.log(products);
     res.send(products);
     
    }
    }
   );
  })
  const supplierDetails = asyncHandler(async (req, res) => {
    const supplierId = req.params.id; 
    // console.log(req.params.id);
    Account.findOne({supplierId: supplierId}, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        // console.log(data);
        res.send(data);
      }
    });
})


const getreturn = asyncHandler(async (req, res) => {
  PurchaseReturn.find({}, function(err, data) {
      if (err) {
        res.send({
          message: "CO-PRC-GR- no return found"
      });
      } else {
        // console.log(data);
        res.send(data);
      }
    });
})

const getreturndetails = asyncHandler(async (req, res) => {
  // console.log(req.params.id)
  const debitNo = req.params.id;  
  // console.log(debitNo);
  PurchaseReturn.find({ debitNo: debitNo }).exec(function(err, data) {
    if (err) {
      res.send({
        message: "CO-PRC-GRD- no return details found "
    });
    } else {
      // console.log(data)
     var productdetails= data[0].productarray;
     var products = []; 
    //  console.log(productdetails)
     for(var i = 0; i < productdetails.length; i++) {
       //console.log(productarray[i]);
       
       products.push({
                   itemcode:productdetails[i].itemcode,
                   itemname:productdetails[i].itemname,
                   batchno:productdetails[i].batchno,
                   exp_date:productdetails[i].exp_date,
                   pur_rate:productdetails[i].pur_rate,
                   qty:productdetails[i].qty,
                   tax_amnt:productdetails[i].tax_amnt,
                   dis_amnt:productdetails[i].dis_amnt,
                   discount:productdetails[i].discount,
                   gst:productdetails[i].gst,
                   subtotal:productdetails[i].subtotal,        
                   });                        
     } 
    // console.log(products);
     res.send(products);
     
    }
 });
})

const getProductData = asyncHandler(async (req, res) => {
  // console.log(req.params.id)
  Inventory_stock.findById(req.params.id, function(err,data){
  if (err) {
    res.send({
      message: "CO-PRC-GPD- no product data found"
  });
    } else {
      
      res.send(data);
    }
 }); 
})
const getsupplier = asyncHandler(async (req, res) => {
  const debitNo = req.params.id; 
  PurchaseReturn.findOne({ debitNo: debitNo },'SupplierId paymentMethod date returnStatus', function(err, data) {
      if (err) {
        res.send(err);
      } else {       
        res.send(data);
      }
    });
})
const testdata = asyncHandler(async (req, res) => {
  const id = req.params.id; 
  // console.log(id);
  Inventory_stock.aggregate(
    [
      {$group : {
         _id : "$itemcode", 
          data : {$push : "$$ROOT"}
          }
      },
      {
      $match: {itemcode: id }
    }

  ]
   );
})



const cancelitem = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const {returnDetailsData} = req.body;
  for(var i = 0; i < returnDetailsData.length; i++) {
    const productId= req.body.returnDetailsData[i].itemcode;
    const batchno= req.body.returnDetailsData[i].batchno;
    const qty= req.body.returnDetailsData[i].qty;

    Inventory_stock.findOneAndUpdate({itemcode: productId}, {$inc : { "stock_qty": qty}}, {useFindAndModify: false}, function(err, data) {
      // console.log(req.params.id);
      if (err) {
        res.send({
          message: " CO-PRC-CI- no canceled item found"
      });
      }
      else{
        res.status(201).json({"msg":"record cancelled"});
      }
  
    });
  }
  // console.log(returnDetailsData);
  PurchaseReturn.findOneAndUpdate({debitNo: req.params.id}, { returnStatus: 'c'}, {useFindAndModify: false}, function(err, data) {
    // console.log(req.params.id);
    // if (err) {
    //   console.log('got an error');
    // }
    // else{
    //   res.status(201).json({"msg":"record cancelled"});
    // }

  });
})


const creditupdate = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const {customerData} = req.body;
  console.log(customerData);

    const fileName= '/home/user/poswebapp/uploads/'+req.body.customerData.fileName;
    const creditAmount= req.body.customerData.creditAmount;
    const creditNo= req.body.customerData.creditNo;

 
  // console.log(returnDetailsData);
  PurchaseReturn.findOneAndUpdate({debitNo: req.params.id}, { returnStatus: 'A' , fileName:fileName, creditAmount:creditAmount, creditNo:creditNo}, {useFindAndModify: false}, function(err, data) {
    

  });
})

const getUploadpurchases = asyncHandler(async (req, res) => {
  // console.log("hello there")
  var today = new Date(); 
  today.setDate(today.getDate() - 2); 
  //console.log(today);  
  // PurchaseloadMaster.find({},function(err, data) {

  PurchaseloadMaster.find({createdAt:{"$gte":today}},function(err, data) {
    if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
  });
})

export {
    getData, suggestions, getproducts, addReturn, getreturn,getreturndetails, getProductData,
     insertReturn, getsupplier, supplierDetails,testdata, cancelitem,creditupdate,
     getUploadpurchases
  }
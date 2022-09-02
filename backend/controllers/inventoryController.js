import asyncHandler from 'express-async-handler'
import Inventory_stock from '../models/inventory_Model.js'
import ProductMaster from '../models/ProductMaster.js'
import Inventory_log from '../models/inventoryLog.js'
import Inventory_upload from '../models/inventory_upload.js'
import ProductMaster_duplicate from '../models/ProductMaster_duplicate.js'
import { spawn } from 'child_process'
import formidable from 'formidable'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx';
import excelToJson from 'convert-excel-to-json'
'use strict';

var timeFlag=false

const getinventory = asyncHandler(async(req, res) => {

    Inventory_stock.find({}).sort({ 'item_name': 1 }).exec(function(err, data) {
        if (err) {
            res.send({ Error: "CO-IC-getinventory - Not Found" });
        } else {
            res.send(data);
            var productarray = data;
            // console.log(productarray);
            for (var i = 0; i < productarray.length; i++) {
                const product = productarray[i].item_name;
                const rack = productarray[i].rack;
                const subrack = productarray[i].subrack;
                const fridge = productarray[i].fridge;
                const mrp = productarray[i].mrp;
                const hsn = productarray[i].hsn;
                const m_line_id = "";
                const manufacture = "";
                const major_content = productarray[i].composition;
                const group_id = "";
                const schname = "";
                const itemcategoryId = "";
                const pack = "";
                const uom = "";
                const strip_sale = "";
                const box = "";
                var front = 'posweb';
                var Itemcode = front + Math.floor(Math.random() * 10000);

                ProductMaster.find({ product: productarray[i].item_name }, function(err, docs) {
                    if (!docs.length) {
                        const returnOrder = new ProductMaster({
                            Itemcode,
                            product,
                            rack,
                            subrack,
                            fridge,
                            mrp,
                            hsn,
                            m_line_id,
                            manufacture,
                            major_content,
                            group_id,
                            schname,
                            itemcategoryId,
                            pack,
                            uom,
                            strip_sale,
                            box
                        });
                        // console.log(returnOrder);
                        returnOrder.save();
                    }
                });
            }
        }
    });
});

const getInventoryProduct = asyncHandler(async(req, res) => {
    const itemcode = req.params.id;
    const batch = req.params.batch;
    Inventory_stock.find({ itemcode: itemcode, batch: batch }, function(err, data) {
        if (err) {
            res.send({ Error: " CO-IC-getInventoryProduct - Inventory Product not found" }
                // err
            );
        } else {
            res.send({ Message: "Inventory Data Found ", data });
        }
    });
})

const suggestions = asyncHandler(async(req, res) => {

    ProductMaster.find({ product: { '$regex': new RegExp("^" + req.body.name, "i") } }, function(err, data) {
        if (err) {
            res.send({ Error: "CO-IC-suggestions - no data found" }
                // err
            );
        } else {
            res.send({
                Message: "Data Found Successfully",
                data
            });
        }
    });
})

const addInventory = asyncHandler(async(req, res) => {
    const { contactArray } = req.body;
    const productarray = [];

    if (contactArray && contactArray.length === 0) {
        res.status(400).json({
            message: "CO-IC-addInventory- No return items"
        });
        return;
    } else {
        for (var i = 0; i < contactArray.length; i++) {

            productarray.push({
                itemcode: req.body.contactArray[i].itemcode,
                item_name: req.body.contactArray[i].item_name,
                batch: req.body.contactArray[i].batch,
                exp_date: req.body.contactArray[i].exp_date,
                stock_qty: req.body.contactArray[i].stock_qty,
                rate: req.body.contactArray[i].rate,
                taxper: req.body.contactArray[i].taxper,
                rack: req.body.contactArray[i].rack,
                subrack: req.body.contactArray[i].subrack,
                fridge: req.body.contactArray[i].fridge,
                mrp: req.body.contactArray[i].mrp,
                hsn: req.body.contactArray[i].hsn,

            });

        }
        Inventory_stock.collection.insertMany(productarray, function(err, docs) {
            if (err) {
                res.send({ message: "CO-IC-addInventory-  record has not inserted" }
                    // err
                );
            } else {
                res.send({ data: "Record has been Inserted..!!" });
            }
        });
    }

})

const inventoryEdit = asyncHandler(async(req, res, next) => {
    const { row } = req.body;

    if (req.body.row.isEditMode === true) {

        Inventory_log.updateOne({ itemcode: req.params.id, batch: req.params.batchno }, {
                $set: {
                    'itemcode': req.body.row.itemcode,
                    'itemname': req.body.row.item_name,
                    'batch': req.body.row.batch,
                    'exp_date': req.body.row.exp_date,
                    'new_qty': req.body.row.stock_qty,
                    'new_price': req.body.row.rate,
                    'new_mrp': req.body.row.mrp,
                    'new_hsn': req.body.row.hsn,
                    'action': "update"
                }
            },
            function(err, data) {
                if (err) {
                    res.send({
                            message: "CO-IC-inventoryEdit-  Inventory Not Updated"
                        }
                        // err
                    );
                } else {
                    res.send({ Message: "Updated data Found", data });
                }
            }
        );

        Inventory_stock.updateOne({ itemcode: req.params.id, batch: req.params.batchno }, {
                $set: {
                    'itemcode': req.body.row.itemcode,
                    'item_name': req.body.row.item_name,
                    'batch': req.body.row.batch,
                    'exp_date': req.body.row.exp_date,
                    'stock_qty': req.body.row.stock_qty,
                    'rate': req.body.row.rate,
                    'rack': req.body.row.rack,
                    'subrack': req.body.row.subrack,
                    'fridge': req.body.row.fridge,
                    'mrp': req.body.row.mrp,
                    'hsn': req.body.row.hsn,
                    'taxper': req.body.row.taxper
                }
            },

        );
    }
})

const deleteRecord = asyncHandler(async(req, res) => {
    const batch = req.params.batch;
    const { dataValues } = req.body;

    const user_id = dataValues.user_id;
    const itemcode = dataValues.itemcode;
    const itemname = dataValues.itemname;
    const action = dataValues.action;

    Inventory_stock.findOne({ itemcode: req.params.id, batch: req.params.batch }, function(err, data) {
        data.remove();
        if (err) {
            res.send({
                    message: "CO-IC-deleteRecord- record not deleted"
                }
                // err
            );
        } else {
            // console.log(data);
            res.send({ Message: "After Deleting Data Found Successfully ", data });
        }
    });
    const returnOrder = new Inventory_log({
        user_id,
        itemcode,
        itemname,
        action
    });
    returnOrder.save()
})

const insertLog = asyncHandler(async(req, res) => {

    const { array } = req.body;
    const productarray = [];

    if (array && array.length === 0) {
        res.status(400).json({
            message: "CO-IC-insertLog-  No return items"
        })
        return;
    } else {
        for (var i = 0; i < array.length; i++) {

            productarray.push({
                itemcode: req.body.array[i].itemcode,
                itemname: req.body.array[i].item_name,
                batch: req.body.array[i].batch,
                old_qty: req.body.array[i].stock_qty,
                old_price: req.body.array[i].rate,
                old_mrp: req.body.array[i].mrp,
                old_hsn: req.body.array[i].hsn,
                action: "update",
            });

        }
        Inventory_log.collection.insertMany(productarray, function(err, docs) {
            if (err) {
                res.send({ message: "CO-IC-insertLog- Record has not inserted" });
            } else {
                res.send({ data: "Record has been Inserted..!!" });
            }
        });
    }
})

const uploadInventoryDetails = asyncHandler(async(req, res,next) => {
    
     
    let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  let date_ob = new Date();
  var rand = "inv_"+Math.floor(Math.random() * 10000);

  form.parse(req,(err,fields, file) => {
    
    var extension = file.billfile.name.substring(file.billfile.name.indexOf("."));
    var __dirname = path.resolve();
    // var newPath = __dirname+"/uploads/inventory_file/stock.xls";
    
    var newPath = __dirname +"/uploads/inventory_file/"+rand+extension;
    // console.log(newPath);
    // var absolutePath = path.resolve(newPath);

    // //console.log(file, "WEll")
   fs.writeFile(newPath, fs.readFileSync(file.billfile.path), (err,data)=> {
            if (err) {
                console.log ('err', err)
            }
            else{
              // console.log("success");
              let result=[];
              // console.log(newPath);
              result = excelToJson({
                sourceFile: newPath,
                name: 'Customers',
                //need to add this bcz it is not oroginal file
                header:{
                  // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
                  rows: 13
                 
                  },
                  columnToKey: {
                      L: 'item_name',
                      W: 'stock_qty',
                      H: 'batch',
                      J: 'exp_date',
                      AC: 'mrp',
                      E: 'rate',
                     
                }
              });
              const data= [];
              function pad2(n) {
                return (n < 10 ? '0' : '') + n;
              }
              for (let i = 0; i < result[Object.keys(result)[0]].length; i++) {
                if (result[Object.keys(result)[0]][i].batch) {
                  // console.log(result[Object.keys(result)[0]][i]);
                  var date = new Date(result[Object.keys(result)[0]][i].exp_date);
                  var month = pad2(date.getMonth()+1);//months (0-11)
                  var day = pad2(date.getDate());//day (1-31)
                  var year= date.getFullYear();
                  var formattedDate =  day+"-"+month+"-"+year;
                  var dateobj= new Date() ;
                  var cmonth = dateobj.getMonth();
                  var cyear = dateobj.getFullYear();
                  if((year > cyear) || (year = cyear && month > cmonth ) )
                    {
                  data.push({
                    item_name:result[Object.keys(result)[0]][i].item_name,
                    batch:result[Object.keys(result)[0]][i].batch,
                    exp_date:formattedDate.toString(),
                    mrp :(result[Object.keys(result)[0]][i].mrp).toFixed(2),
                    rate :result[Object.keys(result)[0]][i].rate,
                    stock_qty:result[Object.keys(result)[0]][i+1].stock_qty
                   
                    })
                  }
                  else{
                    // console.log(result[Object.keys(result)[0]][i].item_name+"     "+formattedDate.toString());
                  }
                  }
                
                  }
                //   console.log(data);
             Inventory_stock.collection.insertMany(data, function (err, data) {
                  if (err) {
                    // res.send(err);
                    console.log(err);
                  } else {
                    next();
                    const logFile = new Inventory_upload({
                      file_path:newPath,
                      status:"SUCCESS",
                      date:new Date()
                    })
                    logFile.save();
                    // console.log(data);
                    res.send({ data: "Record has been Inserted..!!" });
                  }
                });
                
            }
          }
    );
    
    });
    
    
})
const gettime = asyncHandler(async(req,res)=>{

    Inventory_upload.aggregate([
      { $sort: { item: 1, date: 1 } },
      {
        $group:
          {
            _id: "$item",
            date: { $last: "$date" }
          }
      }
    ],
    function (err, data) {
      // console.log(data);
       res.send(data);
    })
    })
    
const deleteInventory= asyncHandler(async(req,res,next)=>{
    Inventory_stock.deleteMany({},function(err,data){
        if (err) {
        console.log(err);
        }
        else{
        // console.log("records deleted");
        // next();
        }
    })
    ProductMaster_duplicate.deleteMany({},function(err,data){
        if (err) {
        console.log(err);
        }
        else{
        // console.log("records deleted");
        next();
        }
    })
})
const insertProduct = asyncHandler(async(req,res,next)=>{
    Inventory_stock.find({},function(err,data){
      if(err)
      {
        console.log(err);
      }
      else{
       async function insert_product() {
          var result=_.uniqBy(data, function (e) {
            return e.item_name;
          });
        //   var result2=_.uniqBy(data, function (e) {
        //     return e.stock_qty = 0;
        //   });
        // console.log(result2.length);
          for await(let num of result) {
           await ProductMaster.findOne({product:num.item_name}, function(err,data) {
              if (data==null) {
                var front = 'posweb';
                var Itemcode = front + Math.floor(Math.random() * 10000);
        
                const product = num.item_name;
                const mrp = num.mrp;
                const batch = num.batch;
                const product_master = new ProductMaster({
                  Itemcode,
                  product,
                  mrp,
                  batch
                  
                })
                product_master.save();
              }
            })
            
              }
              for await(let num of data) {
                if(num.stock_qty !=0)
                {
              //  await ProductMaster_duplicate.findOne({product:num.item_name}, function(err,product) {
                  // if (product==null) {
                    var front = 'posweb';
                    var Itemcode = front + Math.floor(Math.random() * 10000);
            
                    const product = num.item_name;
                    const mrp = num.mrp;
                    const batch = num.batch;
                    const exp_date=num.exp_date;
                    const duplicate_instance = new ProductMaster_duplicate({
                      Itemcode,
                      product,
                      mrp,
                      batch,
                      exp_date
                    })
                   await duplicate_instance.save();
                  // }
                // }) 
              } 
                  }
                  
                  
              }
  
              async function second() {
                
               await insert_product() ;
             
                next();
              
              }
              second();
        }
      
    })
})  
const grading = asyncHandler(async(req,res)=>{
  // console.log("grading starts");
  ProductMaster_duplicate.find({},async function(err,data){
    if(err)
    {
      console.log(err);
    }
    else{
      console.log("grade for 100 started")
      for (let i = 0; i < data.length; i++) {
        //grade for 100
        ProductMaster_duplicate.find({$and: [{batch:data[i].batch}, {mrp:data[i].mrp},{exp_date:data[i].exp_date}]}, function (err, results) {
          if (err) {
            console.log(err);
          }
          else{
            
            if (results.length>1) {
              for (let j = 0; j < results.length; j++) {
                // console.log(results[j].item_name);
                // if (results[j].item_name != data[i].item_name) {
                  // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                  // })
                  ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                  })
                // }
              }
              
            }
          }
        }) 
    }
    console.log("grade 100 finishing");
    console.log("grade 90 starts");
    for (let i = 0; i < data.length; i++) {
      //grade for 100
      ProductMaster_duplicate.find({$and: [{batch:data[i].batch}, {exp_date:data[i].exp_date}]}, function (err, results) {
        if (err) {
          console.log(err);
        }
        else{
          
          if (results.length>1) {
            for (let j = 0; j < results.length; j++) {
              // console.log(results[j].item_name);
              // if (results[j].item_name != data[i].item_name) {
                // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                // })
                ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 90}}, { duplicate_grade: 90}, function(err, data) {
                })
              // }
            }
            
          }
        }
      }) 
  }
  console.log("grade 90 finishing");
  console.log("grade 70 starts");
    for (let i = 0; i < data.length; i++) {
      //grade for 100
      ProductMaster_duplicate.find({$and: [{batch:data[i].batch}, {mrp:data[i].mrp}]}, function (err, results) {
        if (err) {
          console.log(err);
        }
        else{
          
          if (results.length>1) {
            for (let j = 0; j < results.length; j++) {
              // console.log(results[j].item_name);
              // if (results[j].item_name != data[i].item_name) {
                // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                // })
                ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 70}}, { duplicate_grade: 70}, function(err, data) {
                })
              // }
            }
            
          }
        }
      }) 
  }
  console.log("grade 70 finishing");
  console.log("grade 60 starts");
    for (let i = 0; i < data.length; i++) {
      //grade for 100
      ProductMaster_duplicate.find({batch:data[i].batch}, function (err, results) {
        if (err) {
          console.log(err);
        }
        else{
          
          if (results.length>1) {
            for (let j = 0; j < results.length; j++) {
              // console.log(results[j].item_name);
              // if (results[j].item_name != data[i].item_name) {
                // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                // })
                ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 60}}, { duplicate_grade: 60}, function(err, data) {
                })
              // }
            }
            
          }
        }
      }) 
  }
  console.log("grade 60 finishing");
  console.log("grade 40 starts");
    for (let i = 0; i < data.length; i++) {
      //grade for 100
      ProductMaster_duplicate.find({$and: [{exp_date:data[i].exp_date}, {mrp:data[i].mrp}]}, function (err, results) {
        if (err) {
          console.log(err);
        }
        else{
          
          if (results.length>1) {
            for (let j = 0; j < results.length; j++) {
              // console.log(results[j].item_name);
              // if (results[j].item_name != data[i].item_name) {
                // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                // })
                ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 40}}, { duplicate_grade: 40}, function(err, data) {
                })
              // }
            }
            
          }
        }
      }) 
  }
  console.log("grade 40 finishing");
  
  
  // //grade for 30
  var exp_array=_.uniqBy(data, function (e) {
    return e.exp_date;
  });
  // console.log(exp_array.length);
  for await (let num of exp_array) {
      ProductMaster_duplicate.find({$and: [{exp_date:num.exp_date},{duplicate_grade:{$eq :0}}]}, function (err, results) {
        if (results.length>1) {
          for (let j = 0; j < results.length; j++) {
            ProductMaster_duplicate.updateOne({exp_date: num.exp_date, duplicate_grade: { $lt: 30}}, { duplicate_grade: 30}, function(err, data) {
            })
          }
           
        }
      })
  }
  //grade 30 finished
  //grade for 10
  var mrp_array=_.uniqBy(data, function (e) {
    return e.mrp;
  });
  for await (let num of mrp_array) {
      ProductMaster_duplicate.find({$and: [{mrp:num.mrp},{duplicate_grade:{$eq :0}}]}, function (err, results) {
        if (results.length>1) {
          for (let j = 0; j < results.length; j++) {
            ProductMaster_duplicate.updateOne({mrp: num.mrp, duplicate_grade: { $lt: 10}}, { duplicate_grade: 10}, function(err, data) {
            })
          }
           
        }
      })
  }
 // grade 10 finished
}
})
 })

const inventory = asyncHandler(async(req,res)=>{
    timeFlag=true;
    var d = new Date();
    let year = d.getFullYear();

    var __dirname = path.resolve();
    var dir = "uploads/inventory_file/"

    fs.readdir(dir, async function(err, files) {
        if (err) {
            return res.json({
                Error: "CO-PC-INtrvlFUNC- Unable to scan directory"
            })
        }
    //    files.forEach(async function(file) {
        await Promise.all(files.map(async (file) => {
            const workbook = xlsx.readFile(dir + file);
            
            const sheet_name_list = workbook.SheetNames; 
            const value = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])[0];
            var key = Object.keys(value)[0];
            try{
            if (key === "__EMPTY_1") {
                try {
                    await Inventory_stock.collection.deleteMany({});
                    console.log("inv delete");
                    await ProductMaster_duplicate.collection.deleteMany({});
                    console.log('ProductMaster_duplicate delete');
                    var newPath = dir + file;
                    let result=[];
                    // console.log(newPath);
                    result = excelToJson({
                      sourceFile: newPath,
                      name: 'Customers',
                      //need to add this bcz it is not oroginal file
                      header:{
                        // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
                        rows: 13
                       
                        },
                        columnToKey: {
                          L: 'item_name',
                          H: 'batch',
                          J: 'exp_date',
                          AC: 'mrp',
                          E: 'rate',
                          W: 'stock_qty',
                          
                      }
                    });
                    const data= [];
                    const pdata= [];
                    function pad2(n) {
                      return (n < 10 ? '0' : '') + n;
                    }
                    for (let i = 0; i < result[Object.keys(result)[0]].length; i++) {
                      if (result[Object.keys(result)[0]][i].batch) {
                        
                        var date = new Date(result[Object.keys(result)[0]][i].exp_date);
                        var month = pad2(date.getMonth()+1);//months (0-11)
                        var day = pad2(date.getDate());//day (1-31)
                        var year= date.getFullYear();
                        var formattedDate =  day+"-"+month+"-"+year;
                        var dateobj= new Date() ;
                        var cmonth = dateobj.getMonth();
                        var cyear = dateobj.getFullYear();
                        if((year > cyear) || (year = cyear && month > cmonth ) )
                          {
                        data.push({
                          item_name:result[Object.keys(result)[0]][i].item_name,
                          batch:result[Object.keys(result)[0]][i].batch,
                          exp_date:formattedDate.toString(),
                          mrp :(result[Object.keys(result)[0]][i].mrp).toFixed(2),
                          rate :result[Object.keys(result)[0]][i].rate,
                          stock_qty:result[Object.keys(result)[0]][i+1].stock_qty
                         
                          })
    
                        }
                        //
                        
                        if(result[Object.keys(result)[0]][i+1].stock_qty !=0)
                        {   
                            var front = 'posweb';
                            pdata.push({
                                product:result[Object.keys(result)[0]][i].item_name,
                                batch:result[Object.keys(result)[0]][i].batch,
                                exp_date:formattedDate.toString(),
                                mrp :(result[Object.keys(result)[0]][i].mrp).toFixed(2),
                                 Itemcode : front + Math.floor(Math.random() * 10000)
                                })
                        
                        } 
                        }
                        
                        }
                        console.log("file reading completed");
                        await Inventory_stock.collection.insertMany(data);
                        console.log("inventory inserted");
                        await ProductMaster_duplicate.insertMany(pdata);
                        console.log("duplicate inserted");
                        const product_insert = await insertProduct_test();
                        console.log("product master inserted");
                        await grading_test();
                        console.log("grading");
                        await fs.rename('uploads/inventory_file/' + file, 'uploads/fileUpload/' + file, function(err) {
                            if (err) throw err;
                            
                        });
                  } catch (err) {
                    console.error(err);
                  }
            }
            else{
                console.log("invalid file format");
            }
            
        }
        catch (err) {
            console.error(err);
          }
            }))
            setTimeout(inventory,  15000)
    })
timeFlag=false;
})
setTimeout(inventory, 15000);

async function grading_test (){
    console.log("grading starts");
    ProductMaster_duplicate.find({},async function(err,data){
      if(err)
      {
        console.log(err);
      }
      else{
        // console.log("grade for 100 started")
        for (let i = 0; i < data.length; i++) {
          //grade for 100
          ProductMaster_duplicate.find({$and: [{batch:data[i].batch}, {mrp:data[i].mrp},{exp_date:data[i].exp_date}]}, function (err, results) {
            if (err) {
              console.log(err);
            }
            else{
              
              if (results.length>1) {
                for (let j = 0; j < results.length; j++) {
                  // console.log(results[j].item_name);
                  // if (results[j].item_name != data[i].item_name) {
                    // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                    // })
                    ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                    })
                  // }
                }
                
              }
            }
          }) 
      }
      // console.log("grade 100 finishing");
      // console.log("grade 90 starts");
      for (let i = 0; i < data.length; i++) {
        //grade for 100
        ProductMaster_duplicate.find({$and: [{batch:data[i].batch}, {exp_date:data[i].exp_date}]}, function (err, results) {
          if (err) {
            console.log(err);
          }
          else{
            
            if (results.length>1) {
              for (let j = 0; j < results.length; j++) {
                // console.log(results[j].item_name);
                // if (results[j].item_name != data[i].item_name) {
                  // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                  // })
                  ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 90}}, { duplicate_grade: 90}, function(err, data) {
                  })
                // }
              }
              
            }
          }
        }) 
    }
    // console.log("grade 90 finishing");
    // console.log("grade 70 starts");
      for (let i = 0; i < data.length; i++) {
        //grade for 100
        ProductMaster_duplicate.find({$and: [{batch:data[i].batch}, {mrp:data[i].mrp}]}, function (err, results) {
          if (err) {
            console.log(err);
          }
          else{
            
            if (results.length>1) {
              for (let j = 0; j < results.length; j++) {
                // console.log(results[j].item_name);
                // if (results[j].item_name != data[i].item_name) {
                  // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                  // })
                  ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 70}}, { duplicate_grade: 70}, function(err, data) {
                  })
                // }
              }
              
            }
          }
        }) 
    }
    // console.log("grade 70 finishing");
    // console.log("grade 60 starts");
      for (let i = 0; i < data.length; i++) {
        //grade for 100
        ProductMaster_duplicate.find({batch:data[i].batch}, function (err, results) {
          if (err) {
            console.log(err);
          }
          else{
            
            if (results.length>1) {
              for (let j = 0; j < results.length; j++) {
                // console.log(results[j].item_name);
                // if (results[j].item_name != data[i].item_name) {
                  // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                  // })
                  ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 60}}, { duplicate_grade: 60}, function(err, data) {
                  })
                // }
              }
              
            }
          }
        }) 
    }
    // console.log("grade 60 finishing");
    // console.log("grade 40 starts");
      for (let i = 0; i < data.length; i++) {
        //grade for 100
        ProductMaster_duplicate.find({$and: [{exp_date:data[i].exp_date}, {mrp:data[i].mrp}]}, function (err, results) {
          if (err) {
            console.log(err);
          }
          else{
            
            if (results.length>1) {
              for (let j = 0; j < results.length; j++) {
                // console.log(results[j].item_name);
                // if (results[j].item_name != data[i].item_name) {
                  // ProductMaster_duplicate.updateOne({product: data[i].item_name, batch:data[i].batch, duplicate_grade: { $lt: 100}}, { duplicate_grade: 100}, function(err, data) {
                  // })
                  ProductMaster_duplicate.updateOne({product: results[j].product, batch:results[j].batch, duplicate_grade: { $lt: 40}}, { duplicate_grade: 40}, function(err, data) {
                  })
                // }
              }
              
            }
          }
        }) 
    }
    // console.log("grade 40 finishing");
    
    
    // //grade for 30
    var exp_array=_.uniqBy(data, function (e) {
      return e.exp_date;
    });
    // console.log(exp_array.length);
    for await (let num of exp_array) {
        ProductMaster_duplicate.find({$and: [{exp_date:num.exp_date},{duplicate_grade:{$eq :0}}]}, function (err, results) {
          if (results.length>1) {
            for (let j = 0; j < results.length; j++) {
              ProductMaster_duplicate.updateOne({exp_date: num.exp_date, duplicate_grade: { $lt: 30}}, { duplicate_grade: 30}, function(err, data) {
              })
            }
             
          }
        })
    }
    //grade 30 finished
    //grade for 10
    var mrp_array=_.uniqBy(data, function (e) {
      return e.mrp;
    });
    for await (let num of mrp_array) {
        ProductMaster_duplicate.find({$and: [{mrp:num.mrp},{duplicate_grade:{$eq :0}}]}, function (err, results) {
          if (results.length>1) {
            for (let j = 0; j < results.length; j++) {
              ProductMaster_duplicate.updateOne({mrp: num.mrp, duplicate_grade: { $lt: 10}}, { duplicate_grade: 10}, function(err, data) {
              })
            }
             
          }
        })
    }
   // grade 10 finished
  }
  })


}

async function insertProduct_test (){
    console.log("product duplicate inserting");
    Inventory_stock.find({},function(err,data){
      if(err)
      {
        console.log(err);
      }
      else{
        async function insert_product() {
          var result=_.uniqBy(data, function (e) {
            return e.item_name;
          });
        //   var result2=_.uniqBy(data, function (e) {
        //     return e.stock_qty = 0;
        //   });
        // console.log(result2.length);
          for await(let num of result) {
           await ProductMaster.findOne({product:num.item_name}, function(err,data) {
              if (data==null) {
                var front = 'posweb';
                var Itemcode = front + Math.floor(Math.random() * 10000);
        
                const product = num.item_name;
                const mrp = num.mrp;
                const batch = num.batch;
                const product_master = new ProductMaster({
                  Itemcode,
                  product,
                  mrp,
                  batch
                  
                })
                product_master.save();
              }
            })
            
              }
           
              }
  
              async function second() {
                
               await insert_product() ;
             
                // grading_test();
              
              }
              second();
        }
      
    })
}


export {
    getinventory,
    getInventoryProduct,
    suggestions,
    addInventory,
    inventoryEdit,
    deleteRecord,
    insertLog,
    uploadInventoryDetails,
    gettime,
    deleteInventory,
    grading,
    insertProduct
}
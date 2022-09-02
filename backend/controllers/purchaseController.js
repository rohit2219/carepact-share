import Account from '../models/accountModel.js'
import ProductMaster from '../models/ProductMaster.js'
import asyncHandler from 'express-async-handler'
import Inventory_stock from '../models/inventory_Model.js'

import PurchaseMaster from '../models/PurchaseMaster.js'
import PurchaseloadMaster from "../models/purchaseloadModel.js"
import ProductMaster_duplicate from '../models/ProductMaster_duplicate.js'
import { spawn } from 'child_process'
import formidable from 'formidable'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx';
import fileUploadLog from '../models/fileUploadLog.js'
'use strict';

const intervalFunc = asyncHandler(async(req, res) => {

    var d = new Date();
    let year = d.getFullYear();

    var __dirname = path.resolve();
    var dir = "uploads/purchasebills/"

    fs.readdir(dir, function(err, files) {
        if (err) {
            return res.json({
                Error: "CO-PC-INtrvlFUNC- Unable to scan directory"
            })
        }
        files.forEach(async function(file) {
           
           
            const workbook = xlsx.readFile(dir + file);
            const sheet_name_list = workbook.SheetNames; 
            // console.log(xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])[0]);
            const value = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])[0];
            var key = Object.keys(value)[0];
            

            if (key === "c2code") {
                var invoiceNo=value['invno'];

                async function check_file(invoiceNo)
                {
                    var d = new Date();
                    let year = d.getFullYear();
                        await fileUploadLog.find({invoiceno: invoiceNo, status: "SUCCESS"},
                        (err, data) => {
                            if (err) {
                                res.json({
                                    Error: "CO-PC-IntervalFunc- no data"
                                })

                            } else {

                                if (data.length) {
                                    console.log("Duplicate Invoice!!!"+ ""+ invoiceNo);
                                }
                                
                                else {
                                    var newPath = dir + file;
                                    var absolutePath = path.resolve(newPath);
                                    let purchaseload = new PurchaseloadMaster({
                                        invoiceno: invoiceNo,
                                        billdate: d,
                                        serverfilelocation: absolutePath

                                    });
                                // purchaseload.serverfilelocation = absolutePath
                                purchaseload.save((err, purchaseload) => {
                                    if (err) {
                                        console.log(err);
                                        return (err, res.status(400).json({
                                            error: "file save unsuccessful in formidable"

                                        }))
                                    }
                                    console.log(purchaseload._id, "has this been saved?")

                                })
                                var dataToSend;
                                const pythonPath = __dirname + "/controllers/Omeco_bill_update.py"
                                const pythonProcess = spawn('python3', [pythonPath, purchaseload._id]);
                                pythonProcess.stdout.on('data', function(data) {
                                    dataToSend = data.toString();
                                    console.log(dataToSend);
                                    let arr=dataToSend.split("status")
                                    // console.log(arr);
                                    let status=arr[1].split('\"')
                                    // console.log(status[2]);
                                   let dbstatus
                                   status[2]==="Purchase details updated succesfully"? dbstatus="SUCCESS":dbstatus="FAIL";
                                   let uploadLog = new fileUploadLog({
                                      invoiceno: invoiceNo,
                                      filepath: absolutePath,
                                      status: dbstatus
                                     })
                                    uploadLog.save((err, data) => {
                                        if (err) {
                                            console.log(err);
                                            res.json({
                                                Error: "Not saved to log"
                                            })
                                        } else {
                                            console.log("Saved to log");
                                            
                                            fs.rename('uploads/purchasebills/' + file, 'uploads/fileUpload/' + file, function(err) {
                                                if (err) throw err;
                                                
                                            });
                                        }
  
                                    })
                                });

                                }
                            }
                        }
                    );
                }
                async function first() {
                    const result_status = await check_file(invoiceNo);
                }
                    
                first();
            }
           
            else {
                console.log("File Format is Invalid");
            }

        });
    });
})
setInterval(intervalFunc, 15000);



const getData = asyncHandler(async(req, res) => {
    Account.find({}, function(err, data) {
        if (err) {
            res.send(err);
        } else {

            res.send(data);
        }
    });
})


const mainFormdata = asyncHandler(async(req, res) => {

    const supplierName = req.body.contactArray[0].supplierName;
    const supplierId = req.body.contactArray[0].supplierId;
    const billdate = req.body.contactArray[0].billdate;
    const invoiceno = req.body.contactArray[0].invoiceno;
    const payment = req.body.contactArray[0].payment;
    const status = 'c';
    const type = 'purchase';

    var products = [];
    var grand_total = 0.0;

    for (var i = 0; i < req.body.contactArray.length; i++) {

        grand_total = grand_total + parseFloat(req.body.contactArray[i].netamnt)

        products.push({
            itemcode: req.body.contactArray[i].itemcode,
            itemname: req.body.contactArray[i].item,
            manufacture: req.body.contactArray[i].manufacture,
            batchno: req.body.contactArray[i].batchno,
            exp_date: req.body.contactArray[i].exp_date,
            pur_rate: req.body.contactArray[i].pur_rate,
            mrp: req.body.contactArray[i].mrp,
            qty: req.body.contactArray[i].qty,
            hsncode: req.body.contactArray[i].hsn,
            rack: req.body.contactArray[i].rack,
            subrack: req.body.contactArray[i].subrack,
            fridge: req.body.contactArray[i].fridge,
            freeqty: 5,
            dis_per: req.body.contactArray[i].disper,
            dis_amnt: req.body.contactArray[i].disamnt,
            taxper: req.body.contactArray[i].taxper,
            sgst: req.body.contactArray[i].sgst,
            cgst: req.body.contactArray[i].sgst,
            tax_amnt: req.body.contactArray[i].taxamount,
            taxable_amnt: req.body.contactArray[i].taxable_amnt,
            exp_date: req.body.contactArray[i].exp_date,
            netamount: req.body.contactArray[i].netamnt

        });
    }
    grand_total = Math.ceil(grand_total);

    if (products && products.length === 0) {
        res.status(400).json({
            Message: "CO-PC-mainFormdata-  No order items"
        })
        return
    } else {
        const order = new PurchaseMaster({
            products,
            invoiceno,
            supplierId,
            supplierName,
            billdate,
            payment,
            grand_total,
            status,
            type
        })

        const createdOrder = await order.save()

    }

})


const purchaseSavedata = asyncHandler(async(req, res) => {

    const supplierName = req.body[0].supplierName
    const supplierId = req.body[0].supplierId;
    const billdate = req.body[0].billdate;
    const invoiceno = req.body[0].invoiceno;
    const payment = req.body[0].payment;
    const grand_total = req.body[0].grand_total;
    const status = 'p';
    const type = 'purchase';

    var products = [];

    for (var i = 0; i < req.body.length; i++) {

        products.push({
            itemcode: req.body[i].itemcode,
            itemname: req.body[i].item,
            batchno: req.body[i].batchno,
            exp_date: req.body[i].exp_date,
            pur_rate: req.body[i].pur_rate,
            mrp: req.body[i].mrp,
            qty: req.body[i].qty,
            hsncode: req.body[i].hsn,
            rack: req.body[i].rack,
            subrack: req.body[i].subrack,
            fridge: req.body[i].fridge,
            freeqty: 5,
            dis_per: req.body[i].disper,
            dis_amnt: req.body[i].disamnt,
            taxper: req.body[i].taxper,
            sgst: req.body[i].sgst,
            cgst: req.body[i].sgst,
            tax_amnt: req.body[i].taxamount,
            taxable_amnt: req.body[i].taxable_amnt,
            // exp_date:req.body[i].exp_date, 
            netamount: req.body[i].netamnt

        });
    }

    if (products && products.length === 0) {
        res.status(400).json({
            Message: "CO-PC-purchaseSavedata - No order items"
        })
        return
    } else {
        const order = new PurchaseMaster({
            products,
            invoiceno,
            supplierId,
            supplierName,
            billdate,
            payment,
            grand_total,
            status,
            type
        })

        const createdOrder = await order.save()
        res.send({ data: "Record has been Inserted..!!" });
    }

})




const inventoryPush = asyncHandler(async(req, res, next) => {

    var pdata = [];

    for (var i = 0; i < req.body.contactArray.length; i++) {

        pdata.push({
            itemcode: req.body.contactArray[i].itemcode,
            item_name: req.body.contactArray[i].item,
            batch: req.body.contactArray[i].batchno,
            exp_date: req.body.contactArray[i].exp_date,
            rate: req.body.contactArray[i].pur_rate,
            rack: req.body.contactArray[i].rack,
            subrack: req.body.contactArray[i].subrack,
            fridge: req.body.contactArray[i].fridge,
            mrp: req.body.contactArray[i].mrp,
            hsn: req.body.contactArray[i].hsn,
            taxper: req.body.contactArray[i].taxper,
            stock_qty: req.body.contactArray[i].qty,
            composition: '',
            tax_per: req.body.contactArray[i].taxper,
        });
    }
    Inventory_stock.collection.insertMany(pdata, function(err, docs) {
        if (err) {
            res.json({
                    Error: "CO-PC-inventoryPush-  Record has not been Inserted"
                })
                // res.send(err);
        } else {
            next()
            res.send({ data: "Record has been Inserted..!!" });
        }
    });
})

const formData = asyncHandler(async(req, res) => {
    var newProduct = new ProductMaster(req.body)
    newProduct.save(function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-formData-  Record has not been Inserted"
            });
        } else {
            res.send({ data: "Record has been Inserted..!!" });

        }
    });
})
const suggestions = asyncHandler(async(req, res) => {
    var mysort = { product: 1 };
    ProductMaster.find({ product: { '$regex': new RegExp("^" + req.body.name, "i") } }, function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-suggestions-  No data found"
            });
        } else {

            res.send({ Message: "data found successfully", data });
        }
    }).sort(mysort);
})

const markPurchaseEntryVerified = asyncHandler(async(req, res) => {
    let purchase = req.PurchaseloadMaster;
    purchase.verify_complete = req.body.verify_complete;
    console.log(purchase.verify_complete, req.body.verify_complete, "confirmation")
    purchase.save((err, updatedPurchase) => {

        if (err) {
            // console.log(err)

            return res.status(400).json({
                Error: "CO-PC-markPEVNo purchase found in database really"
            })
        };
        return res.json(updatedPurchase);
    });
});

// end

const manuf_suggestions = asyncHandler(async(req, res) => {
    var mysort = { manufacture: 1 };
    Manufacture_Model.find({ manufacture: { '$regex': new RegExp("^" + req.body.name, "i") } }, function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-man_Sugg -  no data"
            });
        } else {

            res.send(data);
        }
    }).sort(mysort);
})

const group_suggestions = asyncHandler(async(req, res) => {
    var mysort = { item_group_name: 1 };
    group_model.find({ item_group_name: { '$regex': new RegExp("^" + req.body.name, "i") } }, function(err, data) {
        if (err) {
            res.send({ Error: "CO-PC-Manuf_Sugg - No data" });
        } else {

            res.send(data);
        }
    }).sort(mysort);
})

const category_suggestions = asyncHandler(async(req, res) => {
    var mysort = { item_category_name: 1 };
    category_model.find({ item_category_name: { '$regex': new RegExp("^" + req.body.name, "i") } }, function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-Category_Sugg -  no data found"
            });
        } else {

            res.send({ Message: "data found", data });
        }
    }).sort(mysort);
})

const saveData = asyncHandler(async(req, res) => {
    var mod = new model(req.body);
    mod.save(function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-saveData -  Record has not been Inserted"
            });
        } else {
            res.send({ data: "Record has been Inserted..!!" });
        }
    });
})


const itemView = asyncHandler(async(req, res) => {


    PurchaseMaster.find({ _id: req.params.id }, function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-itemView - no item view"
            });
        } else {
            var productarray = data[0].products;
            var products = [];
            var grand_total = data[0].grand_total;
            var invoiceno = data[0].invoiceno;
            for (var i = 0; i < productarray.length; i++) {
                products.push({
                    id: productarray[i]._id,
                    itemcode: productarray[i].itemcode,
                    itemname: productarray[i].itemname,
                    batchno: productarray[i].batchno,
                    pur_rate: productarray[i].pur_rate,
                    hsncode: productarray[i].hsncode,
                    exp_date: productarray[i].exp_date,
                    qty: productarray[i].qty,
                    disamnt: productarray[i].dis_amnt,
                    taxper: productarray[i].taxper,
                    taxable_amnt: productarray[i].taxable_amnt,
                    taxamount: productarray[i].tax_amnt,
                    netamnt: productarray[i].netamount,
                    grand_total: grand_total,
                    invoiceno: invoiceno
                });
            }
            res.send(products);

        }
    });
})





const purchaseHistory = asyncHandler(async(req, res) => {

    PurchaseMaster.find({}).sort({ createdAt: 'desc' }).exec(function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-purchaseHistory- no histrory data"
            });
        } else {
            res.send(data);
        }
    });
})

const purchaseEditdata = asyncHandler(async(req, res, next) => {

    PurchaseMaster.updateOne({ _id: req.params.id }, { $push: { "products": req.body.list1 } },
        (err, order) => {
            if (err) {

                return res.status(400).json({

                    Error: "CO-PC-purchaseEditdata-  Cannot update order"
                })
            }
            next()
        }
    )
})


const purchaseEditstatus = asyncHandler(async(req, res) => {
    PurchaseMaster.updateOne({ _id: req.params.id }, { status: 'c' }, function(err, data) {
        if (err) {
            res.json({
                Error: "CO-PC-PES- status not updated"
            })
        } else {
            res.status(201).json({ message: "status updated" });
        }
    });
});

const purchaseProductdelete = asyncHandler(async(req, res, next) => {

    PurchaseMaster.findOne({ _id: req.params.id }, function(error, itemdata) {
        var plength = itemdata.products.length
        for (var i = 0; i < plength; i++) {
            PurchaseMaster.updateOne({ _id: req.params.id }, { $pop: { "products": "-1" } },
                (err, order) => {
                    if (err) {
                        return res.status(400).json({

                            Error: " CO-PC-PPD-  Cannot update order"
                        })
                    }
                }

            )
        }
        next()
    });
})


const productview = asyncHandler(async(req, res) => {

    ProductMaster.find({}, function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-ProductView -  no data found"
            });
        } else {

            res.send(data);
        }
    });
})



const verifyUpdate = asyncHandler(async(req, res) => {
    console.log("verification complete!!")
    PurchaseloadMaster.updateOne({ _id: req.params.id }, { verify_complete: true, partial_verify_status: false }, function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-VerfyUpd -  status not updated"
            });
        } else {
            res.status(201).json({ "msg": "status updated" });
        }

    });

})
const setPurchaseActiveStatus = asyncHandler(async(req, res) => {
    console.log("Active atatus", req.params.id, req.body)
    PurchaseloadMaster.updateOne({ _id: req.params.id }, { isactive: req.body.isactive }, function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-SPAS -  Purchase active status not updated"
            });
        } else {
            res.status(201).json({ message: "Purchase active status updated" });
        }

    });

})

const deleteOrderById = asyncHandler(async(req, res) => {
    PurchaseMaster.findOne({ _id: req.params.id }, function(error, itemdata) {
        itemdata.remove();
        if (error) {
            res.send({
                Message: "CO-PC-DOBI- record not deleted"
            });
        } else {
            res.status(201).json({ "msg": "record deleted" })
        }
    });
})

const deleteProduct = asyncHandler(async(req, res) => {
    const pid = req.params.pid;
    PurchaseMaster.updateOne({ _id: req.params.id }, { $pull: { "products": { _id: req.params.pid } } },
        (err, order) => {
            if (err) {

                return res.status(400).json({

                    Error: "CO-PC-DP-  Cannot update order"
                })
            }
            res.json(order);
        })

})

const updateScanningStatus = asyncHandler(async(req, res) => {
    const pid = req.params.pid;
    PurchaseMaster.findOneAndUpdate({ _id: req.params.id, "products.itemcode": req.params.pid }, { "$set": { "products.$.verifyStatus": true }, verify: true }, { useFindAndModify: false },
        (err, order) => {
            if (err) {
                res.send({
                    Error: " CO-PC- Status not updated"
                })
            } else {
                res.status(201).json({ message: "status updated" });
            }
        })
})

const uploadPurchase = asyncHandler(async(req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    let date_ob = new Date;
    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();

    form.parse(req, (err, fields, file) => {
        const { invoiceNo, supplierName, customerName, billTotal } = fields;
        var d = new Date();
        var n = d.getTime();
        var extension = file.billfile.name.substring(file.billfile.name.indexOf("."));
        var __dirname = path.resolve();
        var newPath = "uploads/purchasebills/" + "pur_" + year + "-" + month + "-" + invoiceNo + n + extension;
        var absolutePath = path.resolve(newPath);
        console.log(newPath, date, "purchase file location")
        fs.writeFile(newPath, fs.readFileSync(file.billfile.path), (err) => {
            if (err) {
                res.json({
                        Message: "CO- PC- PU-  No purchase update"
                    })
                    // console.log('err', err)
            }
        });


        let purchaseload = new PurchaseloadMaster({
            invoiceno: invoiceNo,
            billdate: d,
            grand_total: billTotal,
            customername: customerName
        });
        purchaseload.serverfilelocation = absolutePath

        purchaseload.save((err, purchaseload) => {
            if (err) {
                return (err, res.status(400).json({
                    error: " CO-PC-PurUp-  file save unsuccessful in formidable"
                }))
            }
            // console.log(purchaseload._id, "has this been saved?")


        })

        var dataToSend;
        const pythonPath = __dirname + "/controllers/Omeco_bill_update.py"
        const pythonProcess = spawn('python3', [pythonPath, purchaseload._id]);
        pythonProcess.stdout.on('data', function(data) {
            console.log("inside the process python")
            dataToSend = data.toString();

        });
        pythonProcess.stderr.on('data', (data) => {


            console.log(dataToSend);
        });
        pythonProcess.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            if (code === 0) {
                var status = "S";
            } else {
                var status = "F";
            }
            res.send(dataToSend)
        })

    })
})

const getUploadpurchases = asyncHandler(async(req, res) => {
    console.log("hello there")
    PurchaseloadMaster.find({}).sort({ createdAt: 'desc' }).exec(function(err, data) {
        if (err) {
            res.send({
                Error: "CO-PC-GUP - no data"
            });
        } else {
            console.log(data)
            res.send(data);
        }
    });
})

const getUploadpurchaseByid = asyncHandler(async(req, res) => {
    PurchaseloadMaster.findById(req.params.id, function(err, result) {
        if (err) {
            res.send({
                Message: "GetUplPurId-  No data found"
            });
        } else {
            res.send(result);
            var productarray = result.products;
            var pdata = [];
            for (var i = 0; i < productarray.length; i++) {
                const product = productarray[i].itemname;
                const rack = productarray[i].rack;
                const subrack = productarray[i].subrack;
                const fridge = productarray[i].fridge;
                const mrp = productarray[i].mrp;
                const hsn = productarray[i].hsnode;
                const m_line_id = "";
                const manufacture = "";
                const major_content = "";
                const group_id = "";
                const schname = "";
                const itemcategoryId = "";
                const pack = "";
                const uom = "";
                const strip_sale = "";
                const box = "";
                var front = 'posweb';
                var Itemcode = front + Math.floor(Math.random() * 10000);

                ProductMaster.find({ product: productarray[i].itemname }, function(err, docs) {
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
                        console.log(returnOrder);
                        returnOrder.save();
                    }
                });
            }
        }
    });
});

const deleteUploadedOrderById = asyncHandler(async(req, res) => {
    PurchaseloadMaster.findOne({ _id: req.params.id }, function(error, itemdata) {
        itemdata.remove();
        if (error) {
            res.send({
                message: "CO-PC-DUOById- record not deleted"
            });
        } else {
            res.status(201).json({ Message: "record deleted" })
        }
    });
})

const deletebox = asyncHandler(async(req, res) => {
    ProductMaster.update({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, { $unset: { box: "" } }, function(err, data) {
        if (err) {
            res.send({
                    message: "CO-PC- Box Not Deleted"
                })
                // console.log(er);
        } else {
            res.status(201).json({ "msg": "Box Deleted" });
        }
    });
})

const updatebox = asyncHandler(async(req, res) => {
    var pdata = [];
    var front = 'posweb';
    var rand = front + Math.floor(Math.random() * 10000);

    ProductMaster.count({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, function(err, count) {
        if (count === 0) {

            pdata.push({
                m_line_id: req.body.m_line_id,
                manufacture: req.body.manufacture,
                Itemcode: rand,
                product: req.body.product,
                major_content: req.body.major_content,
                group_id: req.body.group_id,
                schname: req.body.schname,
                itemcategoryId: req.body.itemcategoryId,
                pack: req.body.pack,
                uom: req.body.uom,
                rack: req.body.rack,
                subrack: req.body.subrack,
                fridge: req.body.fridge,
                mrp: req.body.mrp,
                hsn: req.body.hsn,
                strip_sale: req.body.strip_sale,
                box: req.params.box
            });
            ProductMaster.collection.insertMany(pdata, function(err, docs) {
                if (err) {
                    res.send({
                        Warning: "CO- PC-UPBOX- Record has not been Inserted"
                    });
                } else {

                    res.send({ data: "Record has been Inserted..!!" });
                }
            });
        } else {
            ProductMaster.findOne({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, 'box', function(err, data) {
                if (data.box == null) {
                    ProductMaster.findOneAndUpdate({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, { box: req.params.box }, function(err, data) {
                        if (err) {
                            res.json({
                                    Message: " CO-PC-UPBox- Box Not added"
                                })
                                // console.log(err);
                        } else {
                            res.status(201).json({ "msg": "Box Added" });
                        }

                    });
                } else {
                    console.log("BOX value already have");
                }
            })
        }
    });
})
const getboxvalue = asyncHandler(async(req, res) => {
    ProductMaster.findOne({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, 'box', function(err, data) {
        if (err) {
            res.json({
                    Message: "CO-Pc_getboxval - No data"
                })
                // console.log(err);
        } else {
            res.send(data);
            console.log(data);
        }
    });

})

const verifyCount = asyncHandler(async(req, res) => {
    let noarray = [];
    PurchaseloadMaster.findById({ _id: req.params.id }, function(err, data) {
        if (err) {
            res.send({
                    Message: "CO-PC-vfyCnt- NO Count Found"
                })
                // console.log(err);
        } else {
            for (let i = 0; i < req.body.products.length; i++) {

                const newQty = req.body.products[i].qty

                for (let j = 0; j < data.products.length; j++) {

                    const oldQty = data.products[j].qty

                    if (req.body.products[i].itemname == data.products[j].itemname) {

                        if (newQty > oldQty) {
                            var freeQty = newQty - oldQty
                            if ((newQty - freeQty) == oldQty && data.products[j].freeqty == freeQty) {
                                PurchaseloadMaster.findOneAndUpdate({ _id: req.params.id, "products.itemname": { '$regex': new RegExp("^" + req.body.products[i].itemname, "i") } },

                                    { "$set": { "products.$.verify_qty": true, "products.$.verify_freeqty": true, "products.$.totalCount": newQty }, partial_verify_status: req.params.status }, { useFindAndModify: false },
                                    (err, order) => {
                                        if (err) {
                                            res.json({
                                                    message: "CO-PC-vfyCnt- Product count not verified"
                                                })
                                                // console.log(err);
                                        } else {
                                            console.log("Product count verified");
                                        }
                                    })
                            }
                        } else {

                            PurchaseloadMaster.findOneAndUpdate({ _id: req.params.id, "products.itemname": req.body.products[i].itemname }, { "$set": { "products.$.verify_qty": true, "products.$.verify_freeqty": true, "products.$.totalCount": newQty }, partial_verify_status: req.params.status }, { useFindAndModify: false },
                                (err, order) => {
                                    if (err) {
                                        res.json({
                                                message: "CO-PC-vfyCnt- Product count not verified"
                                            })
                                            // console.log(err);
                                    } else {
                                        console.log("Product count verified");
                                    }
                                })
                        }
                    }

                }

            }

            res.status(201).json({ "msg": "Product count verified" });
        }
    })

});
//case updation
const updatecase = asyncHandler(async(req, res) => {
    var pdata = [];
    var front = 'posweb';
    var rand = front + Math.floor(Math.random() * 10000);

    ProductMaster.count({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, function(err, count) {
        if (count === 0) {

            pdata.push({
                m_line_id: req.body.m_line_id,
                manufacture: req.body.manufacture,
                Itemcode: rand,
                product: req.body.product,
                major_content: req.body.major_content,
                group_id: req.body.group_id,
                schname: req.body.schname,
                itemcategoryId: req.body.itemcategoryId,
                pack: req.body.pack,
                uom: req.body.uom,
                rack: req.body.rack,
                subrack: req.body.subrack,
                fridge: req.body.fridge,
                mrp: req.body.mrp,
                hsn: req.body.hsn,
                strip_sale: req.body.strip_sale,
                box: req.params.case
            });
            ProductMaster.collection.insertMany(pdata, function(err, docs) {
                if (err) {
                    res.send({
                        Message: "CO-PC-UpCAse-  Record has not been Inserted"
                    });
                } else {

                    res.send({ data: "Record has been Inserted..!!" });
                }
            });
        } else {
            ProductMaster.findOne({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, 'case', function(err, data) {
                if (data.box == null) {
                    ProductMaster.findOneAndUpdate({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, { case: req.params.case }, function(err, data) {
                        if (err) {
                            res.send({
                                Message: "CO-PC-UpCs- Case not added"
                            })
                        } else {
                            res.status(201).json({ "msg": "Case Added" });
                        }

                    });
                } else {
                    console.log("Case value already have");
                }
            })
        }
    });
});

const getcasevalue = asyncHandler(async(req, res) => {
    ProductMaster.findOne({ product: { '$regex': new RegExp("^" + req.params.name, "i") } }, 'case', function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                message: "CO-PC- GCV- No Data"
            })
        } else {
            res.send(data);
        }
    })
});

const deletecase = asyncHandler(async(req, res) => {

})
const updateVerification = asyncHandler(async(req, res) => {
    PurchaseloadMaster.findOneAndUpdate({ _id: req.params.id },

        { partial_verify_status: false }, { useFindAndModify: false },
        (err, order) => {
            if (err) {
                res.send({
                        message: "CO-PC-UV-  Status Not Updated"
                    })
                    // console.log(err);
            } else {
                console.log("status updated");
            }
        })
})
async function deleteInventory_test(){
    await Inventory_stock.deleteMany({},function(err,data){
       if (err) {
         console.log(err);
       }
       else{
         console.log("records deleted from inv");
         // next();
       }
     })
    await ProductMaster_duplicate.deleteMany({},function(err,data){
       if (err) {
         console.log(err);
       }
       else{
         console.log("records deleted from duplicates");
        //  insert_inventory();
         // next();
       }
     })
     return 
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
             
                grading_test();
              
              }
              second();
        }
      
    })
  }
 
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
export {
    getData,
    itemView,
    mainFormdata,
    formData,
    suggestions,
    saveData,
    manuf_suggestions,
    group_suggestions,
    category_suggestions,
    purchaseHistory,
    purchaseEditdata,
    productview,
    inventoryPush,
    purchaseEditstatus,
    purchaseProductdelete,
    purchaseSavedata,
    verifyUpdate,
    deleteOrderById,
    deleteProduct,
    updateScanningStatus,
    uploadPurchase,
    getUploadpurchases,
    getUploadpurchaseByid,
    deleteUploadedOrderById,
    markPurchaseEntryVerified,
    setPurchaseActiveStatus,
    updatebox,
    deletebox,
    verifyCount,
    getboxvalue,
    updatecase,
    getcasevalue,
    deletecase,
    updateVerification,
    grading_test,
    insertProduct_test,
    deleteInventory_test

}
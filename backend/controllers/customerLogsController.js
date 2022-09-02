import customerLogsModel from '../models/customerLogs.js'
import chalk from "chalk";

import fs from 'fs';
const saveCustomerLogs = async(Data, SocketImgPath) => {
    var PurchaseId;
    var Images;
    var TimeStamp;
    var Products;
    var Customer_Name;
    var Purchase_Invoice_Number;

    Data.map((data, ind) => {
        // console.log(data.products)
        PurchaseId = data.purchaseid
        Products = data.products
        TimeStamp = data.time_stamp
        Images = data.image
        Purchase_Invoice_Number = data.purchase_invoice_number
        Customer_Name = data.customer_name

    });


    const purchaseInvoiceNumber = await customerLogsModel.find({ purchase_invoice_number: Purchase_Invoice_Number })
    if (purchaseInvoiceNumber.length !== 0) {
        console.log("data is already there in CustumerLogs", purchaseInvoiceNumber.length)
    } else {

        let base64Image = Images.split(';base64,').pop();
        let SocketImgName = `ProductImg${TimeStamp}.png`
        fs.writeFile(`${SocketImgPath}/${SocketImgName}`, base64Image, { encoding: 'base64' }, function(err) {
            console.log('File created in customerlog');
        });


        try {
            const customerLogsData = new customerLogsModel({
                    purchaseId: PurchaseId,
                    products: Products,
                    timeStamp: TimeStamp,
                    images: `${SocketImgName}`,
                    // images: `${SocketImgPath}/${SocketImgName}`,
                    purchase_invoice_number: Purchase_Invoice_Number,
                    customer_name: Customer_Name,

                })
                // console.log(newreturnObject);
            const result = await customerLogsData.save();
            if (result) {
                console.log(chalk.green.inverse("data saved successfully on customerLogs from the socket"))
            } else {
                console.error(chalk.red.inverse("Data not save on CustomerLogs from socket"))
            }


        } catch (err) {
            console.error(err);
        }


    }



}


const tempCust = (data, SocketImgPath) => {
    var Data = [data]
    saveCustomerLogs(Data, SocketImgPath)
}



const getCustomerLogs = (req, res) => {
    // console.log("Get Data from Customerlogs");
    try {
        customerLogsModel.find({}, (err, data) => {

            if (data) {
                res.json({
                    Success: "Custumer logs Data",
                    data
                })
            } else if (err) {

            }


        })
    } catch (err) {
        console.error(err)
        res.status(404).json({ Error: 'custumerlogs not found' })
    }
}

const verifyProduct = async(req, res) => {
    const _id = req.params.id;
    try {
        // const _id = req.params.id;
        const result = await customerLogsModel.findByIdAndUpdate(_id, {
            $set: {
                verify: true
            }
        }, { new: true, useFindAndModify: false })
        if (result) {
            console.log(chalk.green.inverse(" Product verified successfully"))
            res.status(200).send({
                Success: "Product verified Successfully ",
                result
            })
        } else {
            console.error(chalk.red.inverse("Product not updated", result))
            res.json({
                Error: "Product did not verified Successfully ",
                _id

            })
        }
    } catch (Error) {
        res.json({
            Error: "Product did not verfified Successfully",
            _id
        })
        console.error(chalk.red.inverse(Error));
    }
}

const deletecustLogByid = async(req, res) => {
    try {
        const _id = req.params.id;
        const result = await customerLogsModel.findByIdAndDelete(_id)
        if (result) {
            console.log(chalk.green.inverse("customerLog Deleted successfully"))
            res.status(200).send({
                Success: "customerLog deleted Successfully ",
                result
            })
        } else {
            console.error(chalk.red.inverse("customerLog not delete"))
            res.json({
                Error: "customerLog not delete",

            })
        }
    } catch (Error) {
        res.status(500).send({
            Error: "customerLog not delete",

        })
        console.error(chalk.red.inverse(Error));
    }
}

export {

    saveCustomerLogs,
    tempCust,
    getCustomerLogs,
    verifyProduct,
    deletecustLogByid
}
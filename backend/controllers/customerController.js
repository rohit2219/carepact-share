import chalk from "chalk";

import customerModel from "../models/customerModel.js"

const saveCustomerDetails = async(req, res) => {
    var name = 'Thomson Pharma'
    const address = req.body.address //         Thadikkaran's Building, Erijeri Angady
    const location = req.body.location //         Sales (Default)
    const customerLogId = req.body.customerLogId // <received form aws log server>
    const timeStamp = `${Date.now()}`
    const customerUniqueId = `${name}${timeStamp.substr(-6)}`
    const scannerId = req.body.scannerId //   <nil> default

    try {
        const customerDetails = new customerModel({
            name,
            address,
            location,
            customerLogId,
            customerUniqueId: customerUniqueId.replace(" ", ""),
            scannerId
        })

        const result = await customerDetails.save();
        if (result) {
            console.log(chalk.green.inverse("Customer Details Save Successfully"))
            res.json({
                Status: "Success",
                Message: "Customer Details Save Successfully",
                details: result
            })
        }
    } catch (err) {
        console.log(chalk.red.inverse("Customer Details not Save Successfully"))
        res.json({
            Status: "fail",
            Message: "Customer Details not Save Successfully",
            Error: err
        })
    }

}

const getCustomerDetails = async(req, res) => {
    try {
        const result = await customerModel.find();
        if (result && result.length > 0) {
            console.log(chalk.green.inverse("Customer Details find successfully"))
            res.json({
                Status: true,
                NoOfCustomer: await result.length,
                Message: " Customer Details find successfully",
                details: result
            })
        } else {
            console.log(chalk.yellow.inverse("no Customer details find"))
            res.json({
                Status: true,
                NoOfCustomer: await result.length,
                Message: " no Customer Details find",
                details: result
            })
        }
    } catch (err) {
        console.log(chalk.red.inverse("Customer Details not find successfully"))
        res.json({
            Status: false,
            Message: " Customer Details not find successfully",
            details: err
        })
    }
}

const getCustomerDetailsByCustomerUniqoeId = async(req, res) => {
    const customerUniqueId = req.params.uniqueid;
    try {
        const result = await customerModel.find({ customerUniqueId });
        if (result && result.length > 0) {
            console.log(chalk.green.inverse("Customer Details find successfully by customerUniqueId "))
            res.json({
                Status: true,
                NoOfCustomer: await result.length,
                Message: " Customer Details find successfully by customerUniqueId",
                details: result
            })
        } else {
            console.log(chalk.yellow.inverse("no Customer details find by customerUniqueId"))
            res.json({
                Status: true,
                NoOfCustomer: await result.length,
                Message: " no Customer Details find by customerUniqueId",
                details: result
            })
        }
    } catch (err) {
        console.log(chalk.red.inverse("Customer Details not find successfully by customerUniqueId"))
        res.json({
            Status: false,
            Message: " Customer Details not find successfully by customerUniqueId",
            details: err
        })
    }

}

export { saveCustomerDetails, getCustomerDetails, getCustomerDetailsByCustomerUniqoeId }
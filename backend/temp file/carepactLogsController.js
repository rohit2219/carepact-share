import CarePactLogsModel, { carepactLogsLengthInAwsModel, carepactLogsLengthInLocalModel } from '../models/carePactLogs.js'
import chalk from "chalk";
import fs from 'fs';

import fetch from 'node-fetch';
import isOnline from 'is-online'


const saveLogInLocalCarepact = async(req, res) => {
    var logLength

    const logLengthData = new carepactLogsLengthInLocalModel({
        logLength
    });
    await logLengthData.save()
}

const logLengthInLocalCarepactUpdateById = async(req, res) => {
        const result = await carepactLogsLengthInLocalModel.find({});
        let _id = result[0]._id
        let logLength = result[0].datalength + 1
        const logLengthData = await carepactLogsLengthInLocalModel.findOneAndUpdate({ _id }, { datalength: logLength }, { useFindAndModify: false });
        var d = logLengthData.datalength + 1
    }
    // console.log(localcapactLength, "sss")

const saveLogInAWSCarepact = async(req, res) => {
    var logLength

    const logLengthData = new carepactLogsLengthInAwsModel({
        logLength
    });
    await logLengthData.save()
}

const logLengthInAWSCarepactUpdateById = async(req, res) => {
    const result = await carepactLogsLengthInAwsModel.find({});
    let logLength = result[0].datalength + 1
    console.log(logLength)
    const logLengthData = await carepactLogsLengthInAwsModel.findOneAndUpdate({ _id: '615bfda712688c4e782ba412' }, { datalength: logLength }, { useFindAndModify: false });
}




const saveCarePactLogs = async(Data, SocketImgPath) => {

    const saveInCarePact = async() => {
        let name = 'thomson'
        let address = 'thrissureranjikad'
        let phone = 9745360897
        let location = ' kottayam'

        const response = await fetch(`http://localhost:6000/api/client/awsclientcreate/${name}/${address}/${phone}/${location}`);
        const customerUniqueIdIsPresent = await response.json();
        let logLengthData;
        const result = await carepactLogsLengthInLocalModel.find({});
        if (result.length === 0) {
            saveLogInLocalCarepact()
        } else {
            const logLength = result[0].datalength + 1
            let _id = result[0]._id
            logLengthData = await carepactLogsLengthInLocalModel.findOneAndUpdate({ _id }, { datalength: logLength }, { useFindAndModify: false });

        }

        var PurchaseId;
        var Products;
        var Flag;
        var DistributorId;
        var Purchase_Invoice_Number;
        var Duplicate_Products;
        var Customer_Name;
        // var customerUniqueId = '61556098bf6b5d128ca20b4a';
        var Distributor_Name;
        var OcrInput;
        var Grade;
        var Identified_Item;
        var TimeStamp;
        var Images;
        var CustomerReportMessage;
        const uniqid = customerUniqueIdIsPresent.data
        var base64ImageString;
        var savedLogLength = logLengthData.datalength + 1


        Data.map((data, ind) => {
            // console.log(data.products)
            PurchaseId = data.purchaseid
            Flag = data.flag || 0
            Products = data.products
            Purchase_Invoice_Number = data.purchase_invoice_number
            Duplicate_Products = data.duplicate_products
            Customer_Name = data.customer_name
            Distributor_Name = data.distributor_name
            OcrInput = data.ocrText
            Grade = data.grade
            Identified_Item = data.identified_Item
            TimeStamp = data.time_stamp
            Images = data.image
            CustomerReportMessage = data.customer_report_message
            base64ImageString = data.image

        })
        let base64Image = Images.split(';base64,').pop();
        // console.log(base64Image)
        let SocketImgName = `ProductImg${TimeStamp}.png`
        fs.writeFile(`${SocketImgPath}/${SocketImgName}`, base64Image, { encoding: 'base64' }, function(err) {
            console.log('File created in carepact');
        });
        // console.log(SocketImg);
        try {

            // console.log(Products)
            const carePactLogsData = new CarePactLogsModel({
                purchaseId: PurchaseId,
                flag: Flag,
                distributorId: DistributorId,
                purchase_invoice_number: Purchase_Invoice_Number,
                products: Products,
                duplicate_products: Duplicate_Products,
                customer_name: Customer_Name,
                distributor_name: Distributor_Name,
                ocrInput: OcrInput,
                grade: Grade,
                identified_Item: Identified_Item,
                timeStamp: TimeStamp,
                // images: `${SocketImgPath}/${SocketImgName}`,
                images: `${SocketImgName}`,
                customerReportMessage: CustomerReportMessage,
                base64ImageString,
                uniqid,
                savedLogLength
                // uniqueId: customerUniqueIdIsPresent
                // customerUniqueId
            })
            const result = await carePactLogsData.save();
            if (result) {
                console.log(chalk.green.inverse("data saved successfully on CarePactLogs from the socket"))
            } else {
                console.error(chalk.red.inverse("Data not save on CarePactLogs from socket"))
            }
        } catch (err) {
            console.error(err);
        }

    }
    const result = await carepactLogsLengthInLocalModel.find({});
    if (result.length === 0) {
        const result = await saveLogInLocalCarepact()
    } else {
        saveInCarePact()
    }

    const oneTimefun = async() => {
            const data = await CarePactLogsModel.find()
            if (data.length === 0)
                saveInCarePact()
        }
        // oneTimefun()
        // setInterval(oneTimefun, 3000)


}


const tempCare = (data, SocketImgPath) => {
    var Data = [data]
    saveCarePactLogs(Data, SocketImgPath)
}

const getCarePactLogs = async(req, res) => {
    // console.log("Get Data from Carepactlogs");
    try {
        // const data = await CarePactLogsModel.find().populate("customerUniqueId")
        // const data = await CarePactLogsModel.find().populate("customerUniqueId", "customerUniqueId name")
        // const data = await CarePactLogsModel.find()
        const result = await carepactLogsLengthInAwsModel.find({});
        let _id = result[0]._id
        let logLength = result[0].datalength

        console.log(logLength)
        const data = await CarePactLogsModel.find({ savedLogLength: { $gt: logLength } })

        console.log(logLength + data.length)
        if (data) await carepactLogsLengthInAwsModel.findOneAndUpdate({ _id }, { datalength: logLength + data.length }, { useFindAndModify: false });

        if (data) {
            res.json({
                Success: "Carepact logs Data",
                length: data.length,
                data
            })
        }

    } catch (err) {
        console.error(err)
        res.status(404).json({ Error: 'carepactlogs not found' })
    }
}


const getDetailsByInvoiceNo = async(req, res) => {
    const invoice = req.params.invoice;
    try {
        const result = await CarePactLogsModel.find({ purchase_invoice_number: invoice })
        if (result) {
            res.json({
                status: "success",
                length: result.length,
                details: result
            })
        }

    } catch (err) {
        res.json({
            Success: false,
            Error: err
        })
    }
}



const saveCarePactLogsInAWSServer = async(req, res) => {

    let options = { localFile: true, string: true };


    const saveInAws = async() => {
        var internetStatus = async() => {
            return await isOnline()
        }
        let InternetStatus = await internetStatus();

        const result = await carepactLogsLengthInAwsModel.find({});
        let _id = result[0]._id
        let logLength = result[0].datalength

        console.log(logLength)
        const getDatafromCarepactlogs = await CarePactLogsModel.find({ savedLogLength: { $gt: logLength } }, async(err, data) => {
            if (data) {
                console.log(logLength + data.length, "daaaaaaaaaa")
                await carepactLogsLengthInAwsModel.findOneAndUpdate({ _id }, { datalength: logLength + data.length }, { useFindAndModify: false });


            }
        })
        if (InternetStatus) {
            try {
                const saveDatainAWS = await fetch('http://localhost:6000/api/logs/create', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },

                    body: JSON.stringify(getDatafromCarepactlogs)
                });
                const dd = await saveDatainAWS.json();
                console.log(dd)
            } catch (err) {
                console.error(err)
            }
        } else {
            console.log("No internet connection")
        }
    }

    const result = await carepactLogsLengthInAwsModel.find({});
    if (result.length === 0) {
        const result = await saveLogInAWSCarepact()
    } else {
        saveInAws()
    }

    const oneTimefun = async() => {
        const data = await carepactLogsLengthInAwsModel.find({})
        if (data.length === 0) {
            saveInAws()
        }
    }

    setInterval(oneTimefun, 3000)

}




export {
    saveCarePactLogs,
    tempCare,
    getCarePactLogs,
    getDetailsByInvoiceNo,
    saveCarePactLogsInAWSServer,
    logLengthInLocalCarepactUpdateById,
    logLengthInAWSCarepactUpdateById
}



/*

const saveCarePactLogsInAWSServer = async(req, res) => {

    let options = { localFile: true, string: true };

    var internetStatus = async() => {
        return await isOnline()
    }
    let InternetStatus = await internetStatus();

    const getDatafromCarepactlogs = await fetch('http://localhost:5000/api/carepactlogs/carelogs');
    const DatafromCarepactlogs = await getDatafromCarepactlogs.json();
    if (InternetStatus) {
        try {
            const saveDatainAWS = await fetch('http://localhost:6000/api/logs/create', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(DatafromCarepactlogs.data)
            });
            const dd = await saveDatainAWS.json();
            console.log(dd)
        } catch (err) {
            console.error(err)
        }
    } else {
        console.log("No internet connection")
    }

}
*/
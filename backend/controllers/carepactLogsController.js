import CarePactLogsModel from '../models/CarePactLogs.js'
import chalk from "chalk";
import fs from 'fs';
import { encode } from 'node-base64-image';
import fetch from 'node-fetch';
import isOnline from 'is-online'


const saveCarePactLogs = async(Data, SocketImgPath) => {




    let name = 'thomson'
    let address = 'thrissureranjikad'
    let phone = 9745360897
    let location = 'kottayam'
        // const response = await fetch(`http://localhost:6000/api/client/awsclientcreate/${name}/${address}/${phone}/${location}`);
    const response = await fetch(`http://3.7.50.74:5000/api/client/awsclientcreate/${name}/${address}/${phone}/${location}`);
    const customerUniqueIdIsPresent = await response.json();


    var PurchaseId;
    var Products;
    var Flag;
    var DistributorId;
    var Purchase_Invoice_Number;
    var Duplicate_Products;
    var Customer_Name;
    var Distributor_Name;
    var OcrInput;
    var Grade;
    var Identified_Item;
    var TimeStamp;
    var Images;
    var CustomerReportMessage;
    const uniqid = customerUniqueIdIsPresent.data;
    var base64ImageString;

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
        uniqid
        base64ImageString = data.image
    })



    const purchaseInvoiceNumber = await CarePactLogsModel.find({ purchase_invoice_number: Purchase_Invoice_Number })
    if (purchaseInvoiceNumber.length !== 0) {
        console.log("data is already there in CarepactLogs", purchaseInvoiceNumber.length)
    } else {

        let base64Image = Images.split(';base64,').pop();
        let SocketImgName = `ProductImg${PurchaseId}.png`
        fs.writeFile(`${SocketImgPath}/${SocketImgName}`, base64Image, { encoding: 'base64' }, function(err) {
            console.log('File created in carepact');
        });
        // console.log(SocketImg);
        try {
            const carePactLogsData = new CarePactLogsModel({
                // products: Products,

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
                images: `${SocketImgPath}/${SocketImgName}`,
                customerReportMessage: CustomerReportMessage,
                uniqid,
                base64ImageString
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



}


const tempCare = (data, SocketImgPath) => {
    var Data = [data]
    saveCarePactLogs(Data, SocketImgPath)
}


const getCarePactLogs = (req, res) => {
    // console.log("Get Data from Carepactlogs");
    try {
        CarePactLogsModel.find({}, (err, data) => {

            if (data) {
                res.json({
                    Success: "Carepaclt logs Data",
                    data
                })
            } else if (err) {

            }


        })
    } catch (err) {
        console.error(err)
        res.status(404).json({ Error: 'carepactlogs not found' })
    }
}

const getCarePactLogtosend = (req, res) => {
    // console.log("Get Data from Carepactlogs");
    try {
        CarePactLogsModel.find({ awsflag: false }, (err, data) => {

            if (data) {
                res.json({
                    Success: "Carepaclt logs Data",
                    data
                })
            } else if (err) {

            }


        })
    } catch (err) {
        console.error(err)
        res.status(404).json({ Error: 'carepactlogs not found' })
    }
}

const awssave = (req, res) => {
    // console.log("Get Data from Carepactlogs");
    console.log(req.body)
    try {
        CarePactLogsModel.updateMany({ _id: { $in: req.body } }, { $set: { "awsflag": true } }, { multi: true }, (err, data) => {

            if (data) {
                res.json({
                    Success: "updated carpatlog awsflag to true",
                })
            } else if (err) {

            }
        })
    } catch (err) {
        console.error(err)
        res.status(404).json({ Error: 'carepactlogs not found' })
    }
}

const saveCarePactLogsInAWSServer = async(req, res) => {

    let options = { localFile: true, string: true };

    var internetStatus = async() => {
        return await isOnline()
    }
    let InternetStatus = await internetStatus();

    const getDatafromCarepactlogs = await fetch('http://localhost:5000/api/carepactlogs/awssend');
    const DatafromCarepactlogs = await getDatafromCarepactlogs.json();




    if (InternetStatus && DatafromCarepactlogs.data[0] !== undefined) {

        try {



            // const saveDatainAWS = await fetch('http://localhost:6000/api/logs/create', {
            const saveDatainAWS = await fetch('http://3.7.50.74:5000/api/logs/create', {
                method: 'post',
                body: JSON.stringify(DatafromCarepactlogs.data),
                headers: { 'Content-Type': 'application/json' }
            });
            const resultaws = await saveDatainAWS.json();
            console.log(resultaws)
            if (resultaws.Success === "Data saved successfully to aws") {
                const idarray = await DatafromCarepactlogs.data.map(i => { return i._id })
                const updateflag = await fetch('http://localhost:5000/api/carepactlogs/awssaveflag', {
                    method: 'post',
                    body: JSON.stringify(idarray),
                    headers: { 'Content-Type': 'application/json' }
                });
                const updateflagres = await updateflag.json();
                console.log(updateflagres)
            }


        } catch (err) {
            console.error(err)
        }


    } else {
        console.log("No internet connection or all logs are sended already")
    }

}


export { saveCarePactLogs, tempCare, getCarePactLogs, saveCarePactLogsInAWSServer, awssave, getCarePactLogtosend }
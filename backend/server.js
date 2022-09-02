import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import purchaseRoutes from './routes/purchaseRoutes.js'
import authRoutes from './routes/authRoutes.js'

import carePactLogsRoutes from './routes/carePactLogsRoutes.js'
import customerLogsRoutes from './routes/customerLogsRoutes.js'
import purchaseReturnRoutes from './routes/purchaseReturnRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import ipaddressRoutes from './routes/ipaddressRoutes.js'
import bodyParser from "body-parser";
import { exec, spawn } from 'child_process'
// const { spawnSync } = require('child_process');
import { spawnSync } from 'child_process'

import fs from 'fs'

import { saveCarePactLogsInAWSServer, tempCare } from './controllers/carepactLogsController.js'
import { tempCust } from './controllers/customerLogsController.js'

import connectDB from './config/db.js'
import cors from 'cors'
//JM250621
import http from 'http';
//JM250621
/*JM250621
JM250621*/
//import  setPurchaseActiveStatus     from './controllers/purchaseController.js'
//import  ocrTextProcessing     from 'controllers/purchaseController.js'
import PurchaseloadMaster from "./models/purchaseloadModel.js"
import Inventory_stock from './models/inventory_Model.js'
import ProductMaster_duplicate from './models/ProductMaster_duplicate.js'

import schedule  from 'node-schedule'

import moment from 'moment';
import {deleteimage} from './utils/deleteimages.js'



dotenv.config()

connectDB()

const app = express()
//JM250621

const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server);
//JM250621


app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __dirname = path.resolve();

app.use(cors())

// To delete images in socket after one month


const job = schedule.scheduleJob('0 13 * * *', function(){
  deleteimage()
});

// app.use('/api/account', accountRoutes)

app.use('/api/purchase', purchaseRoutes)


// app.use('/api/user', userRoutes)

app.use('/api/auth', authRoutes)

// app.use('/api/ledgers', ledgersRoutes)

app.use('/api/purchaseReturn', purchaseReturnRoutes)

app.use('/api/upload', uploadRoutes)

app.use('/api/inventory', inventoryRoutes)

app.use('/api/ipadd', ipaddressRoutes)

app.use('/api/carepactlogs', carePactLogsRoutes)
app.use('/api/custumerlogs', customerLogsRoutes)


app.use('/uploads', express.static(path.join(__dirname, '/uploads')))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/socketind.html')
  console.log('one socket connected')

})

/// new socket 

app.get('/newsocket', (req, res) => {
  res.sendFile(__dirname + '/newSocket.html')
  console.log('one socket connected')

})

/// new socket end

const SocketImgPath = __dirname + "/uploads/SocketImg"

//JM250621
// io.on('connection' , (socket) => {

//         socket.on('chat message', (msg) => {
//         socket.broadcast.emit('chat message', msg)
//         console.log('message: ' + msg);
//     });
// });
//JM250621

//JM250621
io.on('connection', (socket) => {
  socket.on('distributorconnect', (msg) => {
    //socket.broadcast.emit('distributorconnect', msg);
    io.emit('distributorconnect', msg)
    console.log('message: ' + msg);
  });
});

io.on('connection', (socket) => {
  socket.on('itemIdentified', (msg) => {
    //socket.broadcast.emit('distributorconnect', msg);
    io.emit('itemIdentified', msg)
    console.log('message: ' + msg);
  });
});
//JM250621
//JM120721
function addZero(x, n) {
  while (x.toString().length < n) {
    x = "0" + x;
  }
  return x;
}

function myFunction() {
  var d = new Date();
  var x;
  var h = addZero(d.getHours(), 2);
  var m = addZero(d.getMinutes(), 2);
  var s = addZero(d.getSeconds(), 2);
  var ms = addZero(d.getMilliseconds(), 3);
  x = h + ":" + m + ":" + s + ":" + ms;
  //console.log(x)
  return (x)
}


var pythonOutput = "fgdfgfd";
//Socket
io.on('connection', (socket) => {
  socket.on('ocrtextinput', async (msg) => {
    // console.log(msg)
    if (typeof (msg) === "string") msg = JSON.parse(msg)

    //  const obj = JSON.parse(msg); 
    // console.log(`object ${obj}`)

    const pId = msg.purchaseId
    const ocrtext = msg.ocrText


    // const ocrtextarray = ocrtext.split(' ');
    //console.log(ocrtextarray);

    var time1 = myFunction()
    console.log("Message received @ocrtextinput ", time1)

    ocrTextProcessing(msg)

    var returnObject = [];

    function ocrTextProcessing(ocrTextPurchaase) {
      console.log(ocrTextPurchaase, "OCR Text processing")

      PurchaseloadMaster.findOne({ _id: pId }, async (error, itemdata) => {

        // TOdo        // if(itemdata==[])      if productid not in the db 

        var productdata = itemdata.products

        var rProducts = [];


        for (var j = 0; j < productdata.length; j++) {
          var returnElement = {}

          //bathcno matching
          var combarray = [['S', '5'], ['2', 'Z'], ['I', '1'], ['0', 'O'], ['8', 'B']]

          var cresults = combinations(productdata[j].batchno, combarray)
          // console.log(cresults)
          var upperCaseocr = ocrtext.toUpperCase();
          var upperCaseocr_space = upperCaseocr.replace(/ +/g, "");
          //console.log(upperCaseocr)

          for (var k = 0; k < cresults.length; k++) {
            if (upperCaseocr_space.includes(cresults[k]) == true) {
              returnElement.index = j;
              returnElement.grade = 60;
              rProducts.push(returnElement)
            }
          }

          // //itemname matching
          // var returnElement = {}
          // var upperProductname = productdata[j].itemname
          // console.log(upperProductname)

          // if(upperCaseocr.includes(upperProductname) == true)
          // {   
          //   returnElement.index = j;
          //   returnElement.grade = 20;
          //   rProducts.push(returnElement)
          // }

          //Mrp matching
          const regex = /(\d+\.\d{1,2}|\d+)/g;
          let m;
          var returnElement = {}

          while ((m = regex.exec(ocrtext)) !== null) {
            if (productdata[j].mrp == m[0]) {
              returnElement.index = j;
              returnElement.grade = 10;
              rProducts.push(returnElement)
            }
          }

          //Date matching
          var datearray = [];
          var returnElement = {}
          var newDate = productdata[j].exp_date.split('-')

          var dateobj = new Date();
          var cmonth = dateobj.getMonth() + 4;
          var cyear = dateobj.getFullYear();
          // console.log(cmonth);
          if ((newDate[2] > cyear) || (newDate[2] = cyear && newDate[1] > cmonth)) {

            //case 1
            var eDate1 = newDate[1] + "-" + newDate[2];
            datearray.push(eDate1)

            //case2
            var eDate2 = newDate[1] + "-" + newDate[2].substr(-2);
            datearray.push(eDate2)

            //case3
            var eDate3 = newDate[1] + "/" + newDate[2];
            datearray.push(eDate3)

            //case4
            var eDate4 = newDate[1] + "/" + newDate[2].substr(-2);
            datearray.push(eDate4)

            //case5
            var eDate5 = newDate[1] + "." + newDate[2];
            datearray.push(eDate5)

            //case6
            var eDate6 = newDate[1] + "." + newDate[2].substr(-2);
            datearray.push(eDate6)

            //case7
            var eDate7 = newDate[1] + " " + newDate[2];
            datearray.push(eDate7)

            //case8
            var eDate8 = newDate[1] + " " + newDate[2].substr(-2);
            datearray.push(eDate8)

            //case9
            var check = moment(productdata[j].exp_date, 'YYYY/MM/DD');
            var month = check.format('MMMM').toUpperCase();
            var shortmonth = check.format('MMM').toUpperCase();

            var eDate9 = month + "-" + newDate[2];
            datearray.push(eDate9)

            //case10  
            if (shortmonth != "MAY") {
              var eDate10 = shortmonth + "-" + newDate[2];
              datearray.push(eDate10)
            }
            //case11
            if (shortmonth != "MAY") {
              var eDate11 = shortmonth + "-" + newDate[2].substr(-2);
              datearray.push(eDate11)
            }
            //case12
            var eDate12 = month + "-" + newDate[2].substr(-2);
            datearray.push(eDate12)

            //case13
            var eDate13 = month + "/" + newDate[2];
            datearray.push(eDate13)

            //case14
            if (shortmonth != "MAY") {
              var eDate14 = shortmonth + "/" + newDate[2];
              datearray.push(eDate14)
            }
            //case15
            if (shortmonth != "MAY") {
              var eDate15 = shortmonth + "/" + newDate[2].substr(-2);
              datearray.push(eDate15)
            }
            //case16
            var eDate16 = month + "/" + newDate[2].substr(-2);
            datearray.push(eDate16)

            //case17
            var eDate17 = month + " " + newDate[2];
            datearray.push(eDate17)

            //case18
            if (shortmonth != "MAY") {
              var eDate18 = shortmonth + " " + newDate[2];
              datearray.push(eDate18)
            }
            //case19
            if (shortmonth != "MAY") {
              var eDate19 = shortmonth + " " + newDate[2].substr(-2);
              datearray.push(eDate19)
            }
            //case20
            var eDate20 = month + " " + newDate[2].substr(-2);
            datearray.push(eDate20)

            //case21
            var eDate21 = month + "." + newDate[2];
            datearray.push(eDate21)

            //case22
            if (shortmonth != "MAY") {
              var eDate22 = shortmonth + "." + newDate[2];
              datearray.push(eDate22)
            }
            //case23
            if (shortmonth != "MAY") {
              var eDate23 = shortmonth + "." + newDate[2].substr(-2);
              datearray.push(eDate23)
            }
            //case24
            var eDate24 = month + "." + newDate[2].substr(-2);
            datearray.push(eDate24)
            //case25
            if (shortmonth != "MAY") {
              var eDate25 = shortmonth + newDate[2].substr(-2);
              datearray.push(eDate25)
            }
            //case26
            var eDate26 = month + newDate[2].substr(-2);
            datearray.push(eDate26)
          }

          //  console.log(datearray);                    
          for (let i = 0; i < datearray.length; i++) {
            if (ocrtext.includes(datearray[i])) {
              returnElement.index = j;
              returnElement.grade = 30;
              rProducts.push(returnElement)
            }
          }
          // console.log(rProducts);
          //itemname matching - test code

          // console.log(upperProductname)
          var returnElement = {}
          var upperProductname = productdata[j].itemname
          if (upperCaseocr.includes(upperProductname) == true) {
            if (rProducts.length != 0) {

              // console.log(rProducts[j]['grade']);
              if ((rProducts[j]['grade'] == 60 || rProducts[j]['grade'] == 30)) {

                returnElement.grade = 20;

              }
              else {

                returnElement.grade = 0;

              }
            }
            returnElement.index = j;

            rProducts.push(returnElement)
          }
          //test code ended......
        }

        // console.log(rProducts)
        let grouppedProducts = groupBy(rProducts, 'index');
        //console.log(grouppedProducts)
        var returnProducts = [];

        for (var key in grouppedProducts) {

          var temparr = grouppedProducts[key];
          var gradesum = 0;
          var pelemnts = {}

          temparr.forEach(function (arrayItem) {
            gradesum = gradesum + arrayItem.grade
          });

          if (gradesum >= 70) {
            pelemnts["product_name"] = productdata[key].itemname
            pelemnts["mrp"] = productdata[key].mrp
            pelemnts["expiry_date"] = productdata[key].exp_date
            pelemnts["batchno"] = productdata[key].batchno
            pelemnts["grade"] = gradesum
            returnProducts.push(pelemnts)
          }
          else if (gradesum >= 10 && gradesum < 70) {
            pelemnts["product_name"] = productdata[key].itemname
            pelemnts["mrp"] = productdata[key].mrp
            pelemnts["expiry_date"] = productdata[key].exp_date
            pelemnts["batchno"] = productdata[key].batchno
            pelemnts["grade"] = gradesum
            returnProducts.push(pelemnts)
          }
        }

        // flag zero  grade onnum ilenkil

        if (returnProducts.length == 0) {
          returnObject.purchaseid = pId
          returnObject.flag = 0
          returnObject.products = returnProducts
          var time2 = myFunction()
          console.log(returnObject)
          const jsonString = JSON.stringify(Object.assign({}, returnObject))

          console.log("Process complete for @ocrtextinput ", time2)
          io.emit('ocrtextinput', jsonString)
        }
        else {
          // May not need to sort if it alrady. I am not sure so sorting again.
          // If already sorted you can replace prodSortedByGradeDesc with returnProducts itself.
          let prodSortedByGradeDesc = returnProducts.sort((a, b) => b.grade - a.grade);
          
          let maxGrade = prodSortedByGradeDesc[0].grade;
          let prodWithHighestGrade = prodSortedByGradeDesc.filter(prod => prod.grade === maxGrade);
          // console.log(prodWithHighestGrade);

          let batchArray = prodWithHighestGrade.map(prod => prod.batchno);
          var flag
          if (batchArray.length == 0) {
             flag=0;
          }
          else if(batchArray.length == 1){
           flag=1;
          }
          else{
             flag=2;
          }
          // console.log(prodNames);
          let duplicateProds = await ProductMaster_duplicate.aggregate([
            { 
              $match: {
                batch: {$in: batchArray}
              } 
            }, 
            {
              $group:  {
                _id: "$batch",
                maxDuplicateGrade: {$max: "$duplicate_grade"}
              }
            }
          ]);
          let response = {
            purchaseid: pId,
            flag: flag,
            products: prodWithHighestGrade.map(prod => {
              let dupProd = duplicateProds.find(dupProd => dupProd._id === prod.batchno);
              if (dupProd) {
                return {
                  ...prod,
                  duplicateGrade: dupProd.maxDuplicateGrade || 0
                }
              }
              return {
                ...prod,
                duplicateGrade: 0
              };
            })
          }
          console.log(response);
          io.emit('ocrtextinput', JSON.stringify(response))
        }
      });


    }

    function combinations(string, comarr) {
      var result = [];
      var upperCasestring = string.toUpperCase()
      for (var i = 0; i < upperCasestring.length; i++) {
        if (comarr[0].includes(upperCasestring[i])) {
          result = getcombinations(result, comarr[0])
        }
        else if (comarr[1].includes(upperCasestring[i])) {
          result = getcombinations(result, comarr[1])
        }
        else if (comarr[2].includes(upperCasestring[i])) {
          result = getcombinations(result, comarr[2])
        }
        else if (comarr[3].includes(upperCasestring[i])) {
          result = getcombinations(result, comarr[3])
        }
        else {
          if (result.length == 0) {
            result.push(upperCasestring[i])
          }
          else {
            for (var j = 0; j < result.length; j++) {
              result[j] = result[j] + upperCasestring[i]
            }
          }
        }
      }
      return result;
    }

    function getcombinations(res, carr) {
      if (res.length == 0) {
        res.push(carr[0])
        res.push(carr[1])
      }
      else {
        var copyres = [];
        var copyres = [].concat(res).reverse();
        res = res.concat(copyres)

        for (var j = 0; j < res.length; j++) {
          if (j % 2 == 0) {
            res[j] = res[j] + carr[0];
          }
          else {
            res[j] = res[j] + carr[1];
          }

        }
      }
      return res;

    }

    function groupBy(objectArray, property) {
      return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
      }, {});
    }

  });
});

io.on('connection', (socket) => {
  socket.on('imagecapture', (msg) => {
    //socket.broadcast.emit('distributorconnect', msg);
    io.emit('imagecapture', msg)
    console.log('p message: ' + msg);
  });
});



////////////******************************************//////////////////// */
// this is for newSocket.html
io.on('connection', (socket) => {

  socket.on('chat message', msg => {
    //io.emit('chat message', msg);
    //console.log(outputData)

    if (typeof (msg) === 'object') {
      //console.log(typeof(msg), "hello im object")
      tempCare(msg, SocketImgPath)
      tempCust(msg, SocketImgPath)
    }
    else {
      const obj = JSON.parse(msg);
      var outputData = obj
      //console.log("hello this is string ")
      tempCare(outputData, SocketImgPath)
      tempCust(outputData, SocketImgPath)
    }


  });
});



const currentDate = moment().format('h:mm:ss a');
// const currentDate = moment().format('DD/MM');
console.log(currentDate)

const saveInAWS = () => {
    if (currentDate > '4:00:00 pm' && currentDate < '8:00:00 pm') {
        try {
            saveCarePactLogsInAWSServer()
        } catch (err) {
            console.log("some Error")
        }
    }
}

// for one second
//setInterval(saveInAWS, 1000)

// for 1 min
 //setInterval(saveInAWS, 1000*60)
// for 30 min
 setInterval(saveInAWS, 1000*60*30)



////////////****************************************///////////////////// */



//app.listen(5000,console.log('server running'))
server.listen(5000, console.log('server running'))

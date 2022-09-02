
import MongoClient from 'mongodb';
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("carepact");
  var myobj = {  doc_id: "93471",doc_name: "peter" };
  dbo.collection("doctors_Model").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});


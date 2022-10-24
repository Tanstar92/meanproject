const { MongoDBNamespace } = require('mongodb');

var mongo = require('mongodb').MongoClient;
var url = 'mongodb+srv://mongoroot:1955@cluster0.rae7squ.mongodb.net/?retryWrites=true&w=majority'
mongo.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("cluster0")
    var myobj = { name: "Test User", address: "Canada", age:22, car:"BMW"};
    dbo.collection("charitydata").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted"); 
        db.close();
    });
});
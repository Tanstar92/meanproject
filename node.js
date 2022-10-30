const express = require('express');
const bodyParser= require('body-parser')
const _ = require('lodash/core');

const captchapng = require('captchapng');

var sessions = require( 'client-sessions' );
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use( bodyParser.json() );

// Set session information
app.use( sessions({
    cookieName: 'session',
    secret: 's4Ran7dQ2orpy1omS0Xs3ecret!',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
}) );

// Enable CORS
app.use( function( req, res, next ) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var schemas = require('./js/mongodb.js');
var User = schemas.User,
MeanUser=schemas.MeanUser;

app.listen(3000, function() {
  console.log('listening on 3000')
})


app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html')
 })

async function createUserAccount(req, res) {
	console.log(req.body)
	let userObj = {
		// userName: req.body.userName,
		email: req.body.email,
		password: req.body.password
	}
	let user = new MeanUser(userObj);
	try {
		await user.save(req.body);
		console.log('saved to database');
    res.send({success: true,"result": "Account has been created successfully"});
	} catch (error) {
		res.send({"error":error,success: false});
	}
}

app.post('/createAccount', async(req, res) => {
	try {
		let results = await MeanUser.find({
			email: req.body.email
    });
		if (results === undefined || results.length == 0) {
			createUserAccount(req, res);
		} else {
			res.send({success: false,result: "This user already exist"});
		}
	} catch (error) {
		res.send({success: false,error: error});
	}
});


app.post('/changePassword',(req,res)=>{
  MeanUser.findOneAndUpdate(
    { userName: req.body.userName, password: req.body.oldPassword},
     { password: req.body.newPassword } ,
    { upsert:true, returnNewDocument : true }
,(err,result)=>{
  if(!result){
    var result={success:false,result:"Invalid password"};
    res.send(result);
  }
  else
  {
    var result={success:true,result:"Password has been updated successfully"}
    res.send(result);
  }
}
)
});

app.post('/authenticateUser',(req,res)=>{
  console.log(req.body)
  MeanUser.findOne({$and:[ {$and:[{email:req.body.email}]},{password:req.body.password} ]}).exec(function(err, user){
    if(user){
      var result={success:true,result:user};
      res.send(result);
    }
    else
    {
      var result={success:false,result:"Invalid credentials"};
      res.send(result);
    }
 });
});


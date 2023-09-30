const express = require('express')
const app = express()
var port = process.env.PORT || 8080;
app.use(express.urlencoded({extended: false}))
const cors =require('cors');
app.use(cors())
app.listen(port)
console.log('Webchat with Authentication running in port '+ port)

app.get("/", (req, res)=> {
    res.send("Webchat with Authentication by Kumar Nikitha Kokila");
})

const MongoClient = require ('mongodb').MongoClient;
const mongourl = 'mongodb+srv://kokilak2:Nikhitha12@cca-kokilak2.mz19oij.mongodb.net/cca-chatusers?retryWrites=true&w=majority'
const dbClient = new MongoClient (mongourl, {useNewUrlParser: true, useUnifiedTopology: true});
dbClient.connect (err => {
	if (err) throw err ;
	console.log("Connected to the MongoDB cluster");
});

//Login function.
app.get('/login/:username/:password',(req,res)=>{
 var username = req.params.username;
 var password = req.params.password;

const db=dbClient.db();
 db.collection("users").findOne({username:username,password:password},(err, user)=>{
    let response={success: true, message: "Login Sucessfull: Accessing Chatbox..."};
    if (err || !user){
        console.log(`${username} not found in the DB`);
        return res.send({success: false, message: "The User not found: Try Again!"});
    }
    if(user&& user.username==username){
        console.log(`${username} found in the DB`);
        return res.send(response); 
    }
});
});


app.get('/createuser/:fullname/:username/:email/:password',(req,res)=>{
    var fullname = req.params.fullname; 
    var username = req.params.username;
    var email= req.params.email;
    var password = req.params.password;
      
     const db=dbClient.db();
    db.collection("users").findOne({username:username},(err, user)=>{
    let response={message: "The User has been created Successfully", success: true};
       
 if(user){
        response.message="The User Already Exists: Try New Username...";
        return res.send(response);
          }
        
 let newUser = {
       fullname: password,
       username : username,
       email: email,
       password: password};

    db.collection("users").insertOne(newUser,(err,result)=>{
         if(err){
            response.success=false;
         response.message="User not Registered: Try again";
            return res.send(response);
         }
         return res.send(response);
       });
    });

});


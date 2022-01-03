const _ = require('underscore');/// underscore.js
const express=require('express');
const courses=require('./routes/courses');
const app=express();
const morgan=require('morgan');
const config=require('config');
const startupDebugger=require('debug')('app:startup');
const dbDebugger=require('debug')('app:db');

app.set('view engine', 'pug')
app.set('views', './views'); ///default


///Db work
dbDebugger('connection to database')


//Configuration
console.log('Application Name: '+config.get('name'));
console.log('Mail Server: '+config.get('mail.host'));
console.log('Mail Password: '+config.get('mail.password'));



// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
startupDebugger(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);


app.use(express.json())///req.body if request is json
app.use(express.urlencoded({ extended: true }))///key=value&key=value//so populate req.body
app.use(express.static('public'));
////another course module use
app.use('/api/courses',courses)
app.use(function(req, res, next){
    console.log('Logging....');
    next();
})
app.use(function(req,res,next){
    console.log('Authentication....');
    next();
})

if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    console.log('morgan enabe...');
}


// app.get('/',(req,res)=>{
//     res.send('hello world!!!');
// })

app.get('/',(req,res)=>{
    res.render('index', { title: 'My Express App', message: 'Hello, User'});
})


app.get('/api/posts/:year/:month',(req,res)=>{
    res.send(req.query);
    // res.status(404).send('Sorry');
})


//PORT
const port=process.env.PORT||3000;

app.listen(port,()=>{
    console.log(`Listening on port ${port}...`);
})


// app.put()
// app.post()
// app.delete()

///core module
////file or folder
////node_module

var result= _.contains([1,2,3],4);
console.log(result)
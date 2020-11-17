const dotenv = require('dotenv')
const app = require('./app')
const mongoose = require('mongoose');
const { compile } = require('morgan');
const port = process.env.PORT || 3000


process.on('uncaughtException',err=>{
    console.log('UNHANDLED Exception !! Shutting down ...')
    console.log(err.name,err.message)
    server.close(()=>{
        process.exit(1)
    })
})

dotenv.config({ path: './config.env' });
 const DB = process.env.DATABASE.replace(
     '<PASSWORD>',process.env.DATABASE_PASSWORD
     )
     
 mongoose
 .connect(DB,{
     useNewUrlParser:true,
     useCreateIndex :true,
     useFindAndModify: false,
     useUnifiedTopology: true,
 })
 .then(() => console.log('DB connection successful !'))




const server = app.listen(port,()=>{
    console.log(`App running on port ${port}...`)
})


process.on('unhandledRejection', err => {
    console.log(err.name,err.message)
    console.log('UNHANDLED REJECTION !! Shutting down ...')
    server.close(()=>{
        process.exit(1)
    })  
})

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const userRoutes=require('./routes/user.routes.js')
const bookRoutes=require('./routes/book.routes.js')
const cartRoutes=require('./routes/cart.routes.js')
const issueRecordRoutes=require('./routes/issueRecord.routes.js');
const fineRouter=require('./routes/fine.routes.js');
const adminRouter=require('./routes/admin.routes.js')
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

app.get(
  ('/',(req,res)=>{
    res.send('API is running..');
  })
);

const PORT=process.env.PORT||5000;



app.use('/api/users', userRoutes);
app.use('/api/books',bookRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/issue',issueRecordRoutes);
app.use('/api/fine',fineRouter);
app.use('/api/admin',adminRouter);

const dbConnect=()=>{
    try {
        mongoose.connect(process.env.URI)
        console.log("connected to DB")
    } catch (error) {
        throw error;
        
    }

}

app.listen(5000,()=>{
    console.log("server started")
    dbConnect()
})



// mongoose.connect(process.env.MONGO_URI,{
//   // useNewUrlParser:true,// This tells Mongoose to use the new URL parser for MONGO_URI
//   // useUnifiedTopology:true,//This tells Mongoose to use the new connection management system.
// }).then(()=>{
//    console.log('MongoDB connected');
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }).catch((err) => console.error(err));
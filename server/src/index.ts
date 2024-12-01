import express from "express"
import mongoose from 'mongoose';
import cors from "cors"
import { config } from "dotenv"
import router from "./routes"
config()

const corsOptions={
  // origin:["http://localhost:3000","https://tracking-energy-usage.web.app"],
  origin:"*",
  methods: ["GET", "POST", "DELETE", "UPDATE", "PATCH", "PUT"]
}

const app=express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'));

// API Routes
app.use('/api', router);

const MONGODB_URI = `${process.env.MONGODB_URI}`;
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI,{
  // useUnifiedTopology:true,
  // useNewUrlParser:true
}).then(()=>{
  //listening to server
  const PORT = process.env.PORT||8000;
  app.listen(PORT,()=>{
    console.log(`Server running on Port ${PORT}`)
  })
})
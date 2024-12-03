import express from "express"
import mongoose from 'mongoose';
import hbs from "express-handlebars"
import { config } from "dotenv"
import session from "express-session";
import router from "./routes/index.mjs"
import views from "./routes/views.mjs"
import path from 'path';
import {fileURLToPath} from 'url';
config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.use(session({ 
  secret: `${process.env.SESSION_SECRET}`, 
  resave: false, 
  saveUninitialized: 
  true, cookie: { secure: false } 
}));

app.engine('hbs', hbs.engine({ 
  extname: '.hbs',
  defaultLayout: 'main', 
  partialsDir: __dirname + '/views/partials/',
  runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true, }
})); 
app.set('view engine', 'hbs'); 
app.set('views', __dirname + '/views')

// API Routes
app.use(views)
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
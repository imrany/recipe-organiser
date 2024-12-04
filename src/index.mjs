import express from "express"
import mongoose from 'mongoose';
import hbs from "express-handlebars"
import { config } from "dotenv"
import axios from "axios";
import session from "express-session";
import router from "./routes/index.mjs"
import views from "./routes/views.mjs"
import path from 'path';
import {fileURLToPath} from 'url';
import userModel from "./models/user.mjs";
import bcrypt from 'bcryptjs';
const { genSalt, hash } = bcrypt;
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

app.get('/auth/github', (req, res) => {
  const { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } = process.env; 
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}`; 
  res.redirect(url); 
}); 

app.get('/auth/github/callback', async (req, res) => { 
  try{
    const { code } = req.query; 
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env; 
    const response = await axios.post('https://github.com/login/oauth/access_token', { 
      client_id: GITHUB_CLIENT_ID, 
      client_secret: GITHUB_CLIENT_SECRET, 
      code: code, 
    },{
      headers: { accept: 'application/json' }
    }); 
    const accessToken = response.data.access_token; 
    if(accessToken){
      const { data } = await axios.get('https://api.github.com/user', { 
          headers: { Authorization: `Bearer ${accessToken}` }, 
      }); 
      const { login,email,avatar_url }=data
      const findUser=await userModel.findOne({email})
      if(findUser){
        req.session.user = findUser;
        res.redirect('/recipes');
      }else{
          const salt = await genSalt(10);
          const hashedPassword = await hash("github", salt);
          const user = await userModel.create({username:login, email, password:hashedPassword,photo:avatar_url});
          // Set user in session 
          console.log(user);
          req.session.user = user
          return res.redirect("/recipes");
      }
    }else{
      return res.status(401).render('register',{ title:"Create an account", error: `Access token not available, try again` });
    }
  }catch(error){
    console.log('Error during GitHub authentication:', error.response ? error.response.data : error.message); 
    return res.status(401).render('register',{ title:"Create an account", error: `Bad credentials` });
  }
});

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
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import users from './route/user.js';
const app=express();
const port=3000;

const myLogger=function(req,res,next){
    console.log('Logged middleware.');
    next()
}

// Server listen
app.listen(port,() =>{
    console.log(`${port} is now being listened by the server.`)
})

app.use(
    cors({
        origin: process.env.FE_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    }),
);

// Parse json body
app.use(express.json());

app.use(myLogger);
app.use('/user',users);

app.get('/',(req,res) => {
    res.send("Helloooooooo!");
})

// Test ALL API
app.all('/test',(req,res) => {
    res.send("ALL API: Helloooooooo!")
})

// Test Post API
app.post('/',(req,res) => {
    res.send("POST API: Helloooooooo!")
})
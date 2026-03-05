
const express = require('express')     
const mongoose = require('mongoose')   
const cors = require('cors')           
const dotenv = require('dotenv') 
dotenv.config()

const app = express()

app.use(cors({
    origin : 'http://localhost:5173',
    credentials:true

})) // used for connecting frontend tp backend

app.use(express.json())
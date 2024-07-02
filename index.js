// postman documentation - https://documenter.getpostman.com/view/31850794/2sA35D6io2


const express = require('express');
const HTTP_SERVER = express();
const { connectToDatabase } = require('./database/dbconfig');

const cors = require('cors');
const router = require('./routes/route');

// configuring dotenv 
require('dotenv').config();

// enabling cors
HTTP_SERVER.use(cors());

// HTTP_SERVER.use(bodyparser.json());
HTTP_SERVER.use(express.urlencoded({ extended: true }));
HTTP_SERVER.use(express.json({ extended: true }));

//connecting with database
connectToDatabase();

// HTTP_SERVER.use('/auth', route);
HTTP_SERVER.use('/auth', router)

const PORT = process.env.NODE_HOST_NAME;

HTTP_SERVER.listen(PORT, () => {
  console.log(`Server started Successfully ${PORT}`);
})
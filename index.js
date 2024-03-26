// postman documentation - https://documenter.getpostman.com/view/31850794/2sA35D6io2


const express = require('express');
const { connectToDatabase } = require('./database/dbconfig');
// const { route } = require('../server/routes/route');
const HTTP_SERVER = express();
// const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const router = require('./routes/route');

// configuring dotenv 
require('dotenv').config();

//connecting with database
connectToDatabase();

// enabling cors
var whitelist = ['http://localhost:3000', 'http://localhost:5000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

HTTP_SERVER.use(cors());

HTTP_SERVER.use(cookieParser());

// HTTP_SERVER.use(bodyparser.json());
HTTP_SERVER.use(express.urlencoded({ extended: true }));
HTTP_SERVER.use(express.json({ extended: true }));


// HTTP_SERVER.use('/auth', route);
HTTP_SERVER.use('/auth', router)


const PORT = process.env.NODE_HOST_NAME;

HTTP_SERVER.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started Successfully ${PORT}`);
})
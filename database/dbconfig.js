const mongoose = require('mongoose');

function connectToDatabase() {
    const dbUrl = process.env.NODE_ENV === "development"
    ? `${process.env.DEV_DB_URI}`
    : `${process.env.PROD_DB_URI}`;
    mongoose.connect(dbUrl)
        .then((response) => console.log("Database connected successfully"))
        .catch((err) => console.log(err));

}

module.exports = {
    connectToDatabase
}
const mongoose = require('mongoose');

const connectdb = async (url) => {
    await mongoose.connect(url).then((result) => {
        console.log('Database connected');
    }).catch((err) => {
        console.log("Error in Database connection", err);
        process.exit(1);
    });
};
module.exports = connectdb;
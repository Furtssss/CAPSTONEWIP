const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const route = require('./route/routes');

app.use(cors());

app.listen(8001,function check(err)
{
    if (err) {
        console.error("Error starting the server:", err);
    } else {
        console.log("Server started on port 8001");
    }
});


mongoose.connect('mongodb://127.0.0.1:27017/Login')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });



app.use(express.json());
app.use(route);

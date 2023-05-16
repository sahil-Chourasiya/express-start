const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT;

const app = express();
mongoose.connect(MONGO_URI)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = require('./server/api/register/user.router');

// const index = async (req, res) => {
//     res.status(200)
//     res.setHeader("Content-Type", "application/json")
//     res.send({
//         "status": "running"
//     })
// };


app.use('/api', users);

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}/`)
});
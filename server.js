const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs');

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/url'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
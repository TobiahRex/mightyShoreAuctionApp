require('dotenv').load();
const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGODB_URI || 'mongodb://localhost/AuctionApp';
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use((req, res, next) => {
  res.handle = (err, dbData) => {
    res.status(err ? 400 : 200).send(err || dbData);
  };
  next();
});

app.use('/api', require('./server/routes/api'));
app.use('/', require('./server/routes/index'));

mongoose.connect(MONGOURL, err => {
  console.log(err || `MONGOdb @ ${MONGOURL}`);
});
app.listen(PORT, err =>{
  console.log(err || `Server on ${PORT}`);
});


module.exports = app;

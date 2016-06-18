'use strict';

const PORT       = process.env.PORT || 3000;
const MONGOURL    = process.env.MONGODB_URI || 'mongodb://localhost/AuctionApp';

let morgan        = require('morgan');
let bodyParser    = require('body-parser');
let path          = require('path');
let express       = require('express');
let app           = express();
let router        = express.Router();
let mongoose      = require('mongoose');
let cookieParser  = require('cookie-parser');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'app')));
app.use(cookieParser());
app.use((req, res, next) => {
  res.handle = (err, dbData) => {
    console.log(err);
    console.log(`ERROR: ${err}` || `DATA: ${dbData}`);
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

'use strict';

const PORT = process.env.PORT || 3000;
const MONGOURL = 'mongodb://localhost/AuctionApp';

let express     = require('express');
let app         = express();
let router      = express.Router();
let bodyParser  = require('body-parser');
let server      = require('http').Server(app);
let path        = require('path');
let morgan      = require('morgan');
let mongoose    = require('mongoose');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'app')));
app.use((req, res, next) => {
  res.handle = (err, dbData) => {
    console.log(`ERROR: ${err}` || `DATA: ${dbData}`);
    res.status(err ? 400 : 200).send(err || dbData);
  };
});

app.use('/api', require('./server/routes/api'));
app.use('/', require('./server/routes/index'));


app.listen(PORT, err =>{
  console.log(err || `Server on ${PORT}`);
})

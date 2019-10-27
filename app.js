const express = require('express');
// const morgan = require('morgan');
// const cors = require('cors');
const app = express();

//settings
app.set('port', process.env.PORT || 4000);
app.set('json spaces', 2);


//middlewares
// app.use(cors());
// app.use(morgan('dev'));
app.use(express.json());

//routes
//app.use(require('./routes/initial_routes'));
app.use(require('./routes/analisis_routes'));
app.use(require('./routes/firebase_routes'));

module.exports = app;
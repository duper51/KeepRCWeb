const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');



const indexRouter = require('./routes/index');
const rcRouter = require('./routes/rc');
const gadgetRouter = require('./routes/gadget');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/rc', rcRouter);
app.use('/gadget', gadgetRouter);

module.exports = app;

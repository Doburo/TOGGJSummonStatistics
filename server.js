require('dotenv').config()
const express = require("express")
//const mongoose = require("mongoose")
const { logger } = require("./middlewares/logger");
const app = express()
const appRouter = require('./routes/router')

/* 
Not required at the moment
mongoose.connect('mongodb://127.0.0.1:27017/TOGGJSummonStatistics')
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error))
*/

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}));

app.use(express.static("public"));
app.use(logger)

app.use(appRouter)

app.listen(process.env.PORT, () => {
  console.log(`Started server on port ${process.env.PORT}`)
})


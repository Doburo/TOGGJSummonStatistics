const express = require("express")
const {parseData}  = require("../controllers/statistic-controller")
// const {testparseData}  = require("../controllers/test/summonstatistic-controller")

const router = express.Router()

router.get("/", (request, response) => {
    response.render('index')
})

router.get("/about", (request, response) => {
	response.render('about')
})

// get their URL 
router.get("/statistic/:id", parseData)
// router.get("/summonstatistics/test/:id", testparseData)

router.get("/giveurl", (request, response) => {
	
	response.render("giveUrl")
})

 module.exports = router
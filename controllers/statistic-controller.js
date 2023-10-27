const parser  = require('../parseData');

const parseData = (req, res) => {
    //enter summonStats here
    const id = req.params['id']
	parser.parseData(id)
		.then(summonStatisticsObject => 
			res.render('statistic', 
				{ "summonStatisticsObject" : summonStatisticsObject}
			))
		.catch((error) => console.log(error))
}

module.exports = {
	parseData,
}
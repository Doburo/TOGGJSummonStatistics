const parser  = require('../parseData');

const parseData = (req, res) => {
    //enter summonStats here
    const id = req.params['id']
	var parseSummons = parser.parseData(id)
	parseSummons.then(summonStatisticsObject => 
		res.render('statistic', 
			{ "summonStatisticsObject" : summonStatisticsObject}
		))
	.catch((error) => console.log(error))
}

module.exports = {
	parseData,
}
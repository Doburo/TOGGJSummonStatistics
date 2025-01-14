const { scrapeSummons } = require('./scrapeSummons');

async function parseData(url) {

	const totalSummonData = await scrapeSummons(url);

	[ancientData, redData, blueData, destinyData] = splitSummonTypes(totalSummonData)

	var total = new SummonList(summonData = redData.concat(blueData, destinyData), summonType = "Total");
	var ancient = new SummonList(summonData = ancientData, summonType = "Ancient")
	var red = new SummonList(summonData = redData, summonType = "Red");
	var blue = new SummonList(summonData = blueData, summonType = "Blue");
	var destiny = new SummonList(summonData = destinyData, summonType = "Destiny");

	var splitRedData = splitRedBanners(red.allLegendariesData)
	var [fiftiesWon, fiftiesLost, fiftiesWonPercent] = countFifties(splitRedData)

	var summonArray = [total, ancient, red, blue, destiny]
	var summonStatistics = {}

	for (let index = 0; index < summonArray.length; index++) { 
		summonType = summonArray[index].summonType
		
		//create dictionary for each type of summons
		summonStatistics[summonType] = {}

		summonTypeObject = summonStatistics[summonType]
		summonTypeObject["totalSummons"] = summonArray[index].summonTotal
		
		//Adding specific ancient banner data
		if (summonType === "Ancient") {
			summonTypeObject["totalAncients"] = summonArray[index].numberAncient
			c=summonTypeObject["averageAncientPity"] = summonArray[index].averageAncientPity
		}

		summonTypeObject["totalLegendaries"] = summonArray[index].numberLegendary
		summonTypeObject["averageLegendaryPity"] = summonArray[index].averageLegendaryPity
		
		//Adding specific red banner data
		if (summonType === "Red") {
			summonTypeObject["fiftiesWon"] = fiftiesWon
			summonTypeObject["fiftiesLost"] = fiftiesLost
			summonTypeObject["fiftiesWonPercent"] = fiftiesWonPercent
		}

		summonTypeObject["totalEpics"] = summonArray[index].numberEpic
		summonTypeObject["averageEpicPity"] = summonArray[index].averageEpicPity
	}

	return (summonStatistics)

	/*
	TESTING 
	for (let i=0; i < summonArray.length; i++) {

		console.log("____________________________________________________")
		console.log("number of", summonArray[i].summonType, "summons:", summonArray[i].summonTotal)
		if (i === 1) {
			console.log("total Ancients from", summonArray[i].summonType, "summons:", summonArray[i].numberAncient)
			console.log(summonArray[i].summonType, "average Ancient pity:", summonArray[i].averageAncientPity)
		}
		console.log("total Legendaries from", summonArray[i].summonType, "summons:", summonArray[i].numberLegendary)
		console.log(summonArray[i].summonType, "average Legendary pity:", summonArray[i].averageLegendaryPity)
		if (i === 2) {
			console.log("Total 50/50s taken:", (fiftiesWon + fiftiesLost))
			console.log("50/50s Won:", fiftiesWon)
			console.log("50/50s Lost:", fiftiesLost)
			console.log("50/50 Winrate:", fiftiesWonPercent)
		}
		console.log("total Epics from", summonArray[i].summonType, "summons:", summonArray[i].numberEpic)
		console.log(summonArray[i].summonType, "average Epic pity:", summonArray[i].averageEpicPity)

	}
	console.log("____________________________________________________")
*/
};

function splitSummonTypes(totalSummonData) {
	
	var ancientData = [];
	var redData = [];
	var blueData = [];
	var destinyData = [];

	totalSummons = totalSummonData.length
	ancientBanners = ["The Aloof Wave of the Tower", "Poe Bidau Gustang's Exclusive Ignition Weapon."]

	for (let index=0; index < totalSummons; index++) {
		summonType = totalSummonData[index][2]
		if ( ancientBanners.includes(summonType) === true) {

			ancientData.push(totalSummonData[index])

		}
		else if (summonType === "The One Who Opens The Tower's Door" ) { //|| summonType === "Selective Summon"
			
			blueData.push(totalSummonData[index])

		} else if (summonType.startsWith("Destiny Summon") === true){
			
			destinyData.push(totalSummonData[index])
		
		} else if (summonType.startsWith("Selective Summon") === true) {
			continue
		} 
		else {
			
			redData.push(totalSummonData[index])
		}
	}
	return ([ancientData, redData, blueData, destinyData])
}

function splitRedBanners(redSummonData) {
	var splitRedData = {}
	var existingBannersPulled = []

	for (let i=0; i < redSummonData.length; i++) {
		summonType = redSummonData[i][1]

		if (existingBannersPulled.includes(summonType) === true ) {
			splitRedData[summonType].push(redSummonData[i][0])
		}
		else {
			splitRedData[summonType] = []
			splitRedData[summonType].push(redSummonData[i][0])
			existingBannersPulled.push(summonType);
		}
	}
	return (splitRedData)
}

function countFifties(splitRedData) {

	var redBannerDictionary = {

		"Gorgeous Yeon's Flame": "Yihwa Yeon",
		"The Best Scammer, Khun": "White Heavenly Mirror Khun",
		"The Tower's Idol": "Bong Bong Endorsi",
		"Jinsung Ha, The Great Families Slaughterer": "Jinsung Ha",
		"The Blue Idol Star": "Yura Ha",
		"Ravaged Silver Throne": "White",
		"The Silver Revengeful Soul's Hope, Albelda": "Albelda",
		"Slayer of FUG, Karaka": "Karaka",
		"Sweet Magic Like A Candy": "White Candy Khun",
		"Dogmatic Princess": "Kranos Yuri Ha",
		"The One Who Disobeys His Destiny": "Donghae Hatz",
		"Red-Blooded Judge": "Enryu",
		"Special Operations Commander of the Blazing Sun": "Waterbomb Commander Xiaxia",
		"A Cool Shot in the Middle of the Summer!": "Summer Splash Endorsi",
		"Flame Under The Blazing Sun": "Emerald Ocean Yihwa Yeon",

		"Yihwa Yeon's Exclusive Ignition Weapon Pick-up": "Hairpin of Noble Power",
		"White Heavenly Mirror Khun's Exclusive Ignition Weapon Pick-up": "White Heavenly Mirror",
		"Bong Bong Endorsi's Exclusive Ignition Weapon Pick-up": "Bong Bong",
		"Jinsung Ha's Exclusive Ignition Weapon Pick-up": "Fist of the Dragon and Tiger",
		"Yura Ha's Exclusive Ignition Weapon Pick-up": "Top Star's MIC",
		"White's Exclusive Ignition Weapon Pick-up": "Cullinan, Shinsu Sword",
		"Albelda's Exclusive Ignition Weapon Pick-up": "Sword of Revengeful Souls",
		"Karaka's Exclusive Ignition Weapon Pick-up": "Iron Armor's Red Heart",
		"White Candy Khun's Exclusive Ignition Weapon Pick-up": "Magical Candy Cane",
		"Kranos Yuri Ha's Exclusive Ignition Weapon Pick-up": "Kranos",
		"Donghae Hatz's Exclusive Ignition Weapon Pick-up": "Unleashed Donghae",
		"Enryu's Exclusive Ignition Weapon Pick-up": "Red Rain",
		"Waterbomb Commander Xiaxia's Exclusive Ignition Weapon Pick-up": "Black Rabbit Water Gun" ,
		"Summer Splash Endorsi's Exclusive Ignition Weapon Pick-up ": "Aqua Bong Bong",
		"Emerald Ocean Yihwa Yeon's Exclusive Ignition Weapon Pick-up": "Sparkling Beach Floppy Hat"

	}

	var fiftiesWon = 0
	var fiftiesLost = 0

	for (const [key, value] of Object.entries(splitRedData)) {
		var banner = key
		var bannerPulls = value

		//start from bottom of each array, to be in chronological order
		for (let index = bannerPulls.length -1; index >= 0; index--) {

			if (bannerPulls[index] === redBannerDictionary[banner]) {
				//means won 50/50
				fiftiesWon++
			} else {
				//means 50/50 lost, decrement to skip guaranteed
				fiftiesLost++
				index--
				if (index < 0) { continue }
			}
		}		
	}
	var floatFiftiesWonPercent = (fiftiesWon/ (fiftiesWon+ fiftiesLost))*100
	var fiftiesWonPercent = Math.round((floatFiftiesWonPercent + Number.EPSILON) * 100) / 100
	return ([fiftiesWon, fiftiesLost, `${fiftiesWonPercent}%`])
}

class SummonList {
	constructor(summonData, summonType) {
		this.summonData = summonData
		this.summonTotal = summonData.length
		this.summonType = summonType
		
		var [allAncientsData,
			allLegendariesData,
			allEpicsData] = this.sortRarities(summonData)
		
		this.allLegendariesData = allLegendariesData
		
		this.numberAncient = allAncientsData.length
		this.numberLegendary = allLegendariesData.length
		this.numberEpic = allEpicsData.length
		
		this.averageAncientPity = this.averagePity(this.summonTotal, this.numberAncient)
		this.averageLegendaryPity = this.averagePity(this.summonTotal, this.numberLegendary)
		this.averageEpicPity = this.averagePity(this.summonTotal, this.numberEpic)
	}
	sortRarities(summonData) {
	/*Have 4* and 5* characters and weapon names listed here */
		var characterDictionary =
		{
			"ancient":
				["Poe Bidau Gustang"],
			"legendary":
				[
					"Emerald Ocean Yihwa Yeon",
					"Summer Splash Endorsi",
					"Bam",
					"Viole",
					"First Thorn Bam",
					"Blue Thryssa Bam",
					"Green April Anaak",
					"Khun Ran",
					"Yihwa Yeon",
					"White Heavenly Mirror Khun",
					"Sachi Faker",
					"Verdi",
					"Enryu",
					"Yuri Ha",
					"Hunter Rak",
					"White",
					"Hansung Yu",
					"Hwaryun",
					"Daniel Hatchid",
					"Xiaxia",
					"Urek Mazino",
					"Reflejo",
					"Beta",
					"Cassano",
					"Evan",
					"Yura Ha",
					"Waterbomb Commander Xiaxia",
					"Albelda",
					"White Candy Khun",
					"Bong Bong Endorsi",
					"Karaka",
					"Jinsung Ha",
					"Kranos Yuri Ha",
					"Donghae Hatz"
				],
			"epic":
				[
					"Endorsi",
					"Hatz",
					"Horyang",
					"Miseng",
					"Khun A. A.",
					"Lo Po Bia Ren",
					"Hoaqin",
					"Rachel",
					"Wangnan Ja",
					"Laure",
					"Love",
					"Novick",
					"Quaint Blitz",
					"Shibisu",
					"Varagav",
					"Mini Rak",
					"Boro"
				]
		};
		var weaponDictionary =
		{
			"ancient":
				["Ancient Book of Origin"],
			"legendary":
				[
					"Sparkling Beach Floppy Hat",
					"Aqua Bong Bong",
					"Blue Rune Angelic Spear",
					"Guardian Bow",
					"Jahad Laevateinn",
					"FUG Wand",
					"Shinsu's Orb",
					"Unleased Donghae",
					"Cosmic Pure Octopus",
					"Black Rabbit Water Gun",
					"Top Star's MIC",
					"Cassano's Left Arm",
					"Fist of the Dragon and Tiger",
					"Living Ignition Weapon_Proto Type",
					"Bong Bong",
					"Blue Lightning Nucleus",
					"Red Rain",
					"Magical Candy Cane",
					"Crimson Rose",
					"Necromance",
					"Kranos",
					"Cullinan, Shinsu Sword",
					"Unleashed Thorn",
					"Sword of Revengeful Souls",
					"Iron Armor's Red Heart",
					"Dark Shinsu's Reaper",
					"Frog Fisher",
					"Mazino Wing Tree",
					"Black Rabbit Bomb",
					"Red Twin Blades",
					"Hairprin of Shinsu Control",
					"Thorn",
					"Mad Shocker",
					"Exploding Knuckle Blade",
					"White Heavenly Mirror",
					"Hairpin of Noble Power",
					"Black March",
					"Green April (Transformed)"
				],
			"epic":
				[
					"Crown Bow",
					"Dark Chaser Book",
					"Angelic Blade",
					"Attract Blade",
					"Pink Kukri",
					"Rassen Kunai",
					"Super Lethal King Of Majesty Observer",
					"Quick Gloves",
					"Twin Circle Boomerang",
					"Antimatter Bomb",
					"Blue Gloves",
					"Rabbit Doll",
					"Ignition Gauntlet",
					"Cozy Blanket",
					"Yellow Lighthouse",
					"Ren's Flail",
					"Suspicious Messenger Bag",
					"Shinsu Gauntlet",
					"Donghae",
					"Redeye Needle"
				]
		};

		var allAncients = [];
		var allLegendaries = [];
		var allEpics = []; 

		for (let index = 0; index < summonData.length; index++) {
			var summonName = summonData[index][1]
			var summonBanner = summonData[index][2]

			// Character and weapon Sorting
			if ( characterDictionary.ancient.includes(summonName) === true ||
			weaponDictionary.ancient.includes(summonName) === true) {

				//ancient rarity
				allAncients.push([summonName, summonBanner])

			}
			else if ( characterDictionary.legendary.includes(summonName) === true ||
			weaponDictionary.legendary.includes(summonName) === true) {

				//legendary rarity
				allLegendaries.push([summonName, summonBanner])

			} else if ((characterDictionary.epic).includes(summonName) === true ||
			weaponDictionary.epic.includes(summonName) === true) {
				//4 stars
				allEpics.push([summonName, summonBanner])

			}
			
		}
		return ([
			allAncients,
			allLegendaries,
			allEpics
		])
	}
	averagePity(numSummons, numPulled) {
		var floatAveragePity = (numSummons/numPulled)
		var averagePityNumber = Math.round((floatAveragePity + Number.EPSILON) * 100) / 100
		
		return (averagePityNumber)
	}
}

module.exports = {
	parseData
}

/*
//TESTING
const test2Url = "https://global-tog-info.ngelgames.com/history/MTAzMzMzOTQ="
const testUrl = "https://global-tog-info.ngelgames.com/history/MTEyMDMzOTA="
const url = 'https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk='

let test = parseData(url)
test.then(function(result) {
	console.log(result) 
 })
 */

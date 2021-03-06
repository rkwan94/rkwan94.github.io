//Event listeners
document.getElementById('addInputsBtn').addEventListener('click', function(){
	addNumFields();
});

document.getElementById('calcSingleBtn').addEventListener('click', function(){
	calculateSingles();
});

document.getElementById('resetBtn').addEventListener('click', function(){
	resetFields();
});

function resetFields() {
	document.getElementById('betsSection').innerHTML = "";
	document.getElementById('resultSpace').innerHTML = "";
	document.getElementById('calcSingleBtn').setAttribute("disabled", "true");
	document.getElementById('addInputsBtn').removeAttribute("disabled");
}

function addNumFields() {
	var numFields = parseInt(document.getElementById('numSingleBets').value);
	var fieldId;
	var inputFields = "";
	for(var i = 1; i <= numFields; i++){
		oddsId = "odd" + i;
		stakeId = "stake" + i;
		inputFields = inputFields + "<p> <b>Bet " + i + ")</b> Odds: <input type=\"text\" id=\"" + oddsId + "\"/> Stake: <input type=\"text\" id=\"" + stakeId + "\"/> </p>\n";
	}

	document.getElementById('betsSection').innerHTML = inputFields;
	document.getElementById('addInputsBtn').setAttribute("disabled", "true");
	document.getElementById('calcSingleBtn').removeAttribute("disabled");
}


//Acts as a main function
function calculateSingles() {
	var numFields = parseInt(document.getElementById('numSingleBets').value);
	var stakeInput, oddsInput;
	var oddsId, StakeId;
	var oddsArray = [];
	var stakeArray = [];
	var results = "<h2>Results</h2> \n";

	//populating the paired arrays
	for(var i = 1; i <= numFields; i++){
		oddsId = "odd" + i;
		stakeId = "stake" + i;
		stakeInput = parseFloat(document.getElementById(stakeId).value);
		oddsInput = parseFloat(document.getElementById(oddsId).value);
		oddsArray.push(oddsInput);
		stakeArray.push(stakeInput);
	}

	var totalOutlay = arrayTotal(stakeArray);
	
	//Array where each value is the return from one win
	var combinedResults = multiplyArrays(oddsArray, stakeArray);
	
	var betCombinations = [1];
	for(i = 2; i <= numFields; i++){
		betCombinations.push(i);
	}
	//create 2d array to store every profitable combination of wins,
	//but start with all possible combinations
	var allCombinations = powerSet(betCombinations);
	var losingCombos = [];
	var numCombinations = allCombinations.length + 1;

	//start moving combinations that don't create a profit into the losing 2d array
	var moneyWon;
	for(i = 0; i < allCombinations.length; i++){
		moneyWon = 0;
		for(var j = 0; j < allCombinations[i].length; j++){
			moneyWon += combinedResults[allCombinations[i][j] - 1];
		}
		
		//reset array pointer
		if(moneyWon < totalOutlay){
			losingCombos.push(allCombinations[i]);
			allCombinations = popAtIndex(allCombinations, i);
			i = -1;
		}
	}

	allCombinations = sortByLength(allCombinations);
	losingCombos = sortByLength(losingCombos);

	var listAllProfitCombos = "<p><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseProfit\" aria-expanded=\"false\" aria-controls=\"collapseProfit\">Click to view winning combinations</a></p> \n";
	listAllProfitCombos = listAllProfitCombos + "<div class=\"collapse\" id=\"collapseProfit\">\n" + printToHTML(allCombinations, combinedResults, true, totalOutlay) + "\n </div>";

	results = results + listAllProfitCombos;

	var listAllLosingCombos =  "<p><a class=\"btn btn-primary\" data-toggle=\"collapse\" href=\"#collapseLosses\" aria-expanded=\"false\" aria-controls=\"collapseLosses\">Click to view losing combinations</a></p> \n";
	listAllLosingCombos = listAllLosingCombos + "<div class=\"collapse\" id=\"collapseLosses\">\n" + printToHTML(losingCombos, combinedResults, false, totalOutlay) + "\n </div>";

	results = results + listAllLosingCombos;

	var profitPercentage = (allCombinations.length*100)/numCombinations + "%";
	profitPercentage = "<p> This means you need at least " + shortestArrayLength(allCombinations) + " bets to win in order to make a profit. You have a " + profitPercentage + " chance of making a profit.</p>";
	document.getElementById('resultSpace').innerHTML = results + profitPercentage;
}

//multiplies two array one index at a time and output it into another array
function multiplyArrays(array1, array2){
	var returnArray = [];
	
	//Assume the arrays are the same length
	for(var i = 0; i < array1.length; i++){
		returnArray[i] = array1[i]*array2[i];
	}
	return returnArray;
}

//add all items in an array and return the result
function arrayTotal(array){
	var result = 0;
	for(var i = 0; i < array.length; i++){
		result += array[i];
	}
	return result;
}

//factorial
function fact(n){
	if(n === 0){
		return 1;
	}else{
		return n*fact(n-1);
	}
}

//combination
function comb(n,r){
	var factN = fact(n);
	var factR = fact(r);
	var c = (factN)/(factR*fact(n-r));
	return c;	
}

//Takes a set and creates a 2d array of every possible subset
function powerSet(set){
	var allSets = [[]];
	for(var i = 0; i < set.length; i++){
		for(var j = 0, len = allSets.length; j < len; j++){
			allSets.push(allSets[j].concat(set[i]));
		}
	}

	//Delete empty set at the beginning of the 2d array
	allSets = popAtIndex(allSets, 0);
	return allSets;
}

//returns the union of two sets
function union(setA, setB){
	var union = setA;
	Array.prototype.push.applay(union, setB);
	return union;
}

//swap two indices in an array
function swapPlaces(array, a, b){
	var temp = array[a];
	var tempIndex = a;
	array[a] = array[b];
	array[b] = temp;
	return array;
}

//pop at any index of an array and return
function popAtIndex(array, index){
	var newArray = array;
	//bubbles desired index to the end of the array
	for(var i = index; i < newArray.length - 1; i++){
		newArray = swapPlaces(newArray, i, i + 1);
	}
	newArray.pop();
	return newArray;
}

//prints 2d array combos to HTML code
function printToHTML(array, oddsAndStakes, isProfitArray, totalOutlay){
	var HTMLString = "<p>\n<ul>\n";
	var profitOrLoss = isProfitArray === true ? "profit" : "loss";

	for(var i = 0; i < array.length; i++){
		HTMLString = HTMLString + "<li>Bets ";
		for(var j = 0; j < array[i].length - 1; j++){
			HTMLString = HTMLString + array[i][j] + ", ";
		}

		if(array[i].length != 1){
			HTMLString = HTMLString + "and " + array[i][j]
		}else{
			HTMLString = HTMLString + array[i][j];
		}

		HTMLString = HTMLString + " will give you a " + profitOrLoss + " of " + returnWinnings(array[i], oddsAndStakes, totalOutlay) + "</li>\n";
	}

	if(!isProfitArray){
		HTMLString = HTMLString + "<li>If none of these bets win, then yo will lose <span style=\"color:red\">$" + totalOutlay + "</li>\n";
	}	

	return HTMLString + "<ul>\n</p>\n";
}

function returnWinnings(array, odds, totalOutlay){
	var winnings = -1*totalOutlay;
	for(var i = 0; i < array.length; i++){
		winnings += odds[array[i]-1];
	}

	winnings = Math.round(winnings*100)/100;
	if(winnings < 0){
		winnings = Math.abs(winnings);
		winnings = "<span style=\"color:red\">$" + winnings + "</span>";
	}else{
		winnings = "$" + winnings;
	}

	return winnings;
}

//takes a 2d array and finds the length of the smallest array
function shortestArrayLength(array){
	var shortest = array[0].length;
	for(var i = 0; i < array.length; i++){
		if(array[i].length < shortest){
			shortest = array[i].length;
		}
	}
	return shortest;
}

//takes 2d array and count the number of n-sized arrays within
function numTuple(array, n){
	var count;
	for(var i = 0; i < array.length; i++){
		if(array[i].length == n){
			count++;
		}
	}
	return count;
}

//sorts 2d array smallest to largest using bubble sort algorithm
function sortByLength(array){
	var newArray = array;
	var done = false;

	while(!done){
		done = true;
		for(var i = 1; i < newArray.length; i++){
			if(newArray[i-1].length > newArray[i].length){
				done = false;
				var temp = newArray[i-1];
				newArray[i-1] = newArray[i];
				newArray[i] = temp;
			}
		}
	}

	return newArray;
}

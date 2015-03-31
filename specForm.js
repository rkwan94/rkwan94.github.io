//Event Listeners
document.getElementById('resetBtn').addEventListener('click', function(){
	clearForm();
});

document.getElementById('calcMutliBtn').addEventListener('click', function(){
	main();
});

document.getElementById('betType').addEventListener('mouseup', function(){
	enableNumFields();
});

document.getElementById('betType').addEventListener('keyup', function(){
	enableNumFields();
});

//Reset Form
function clearForm() {
	document.getElementById("special").reset();
}

//Enable appropriate number of fields depending on bet type
function enableNumFields() {
	var numFields = parseInt(document.getElementById('betType').value);
	var bet1 = document.getElementById('bet1');
	var bet2 = document.getElementById('bet2');
	var bet3 = document.getElementById('bet3');
	var bet4 = document.getElementById('bet4');
	var bet5 = document.getElementById('bet5');
	var bet6 = document.getElementById('bet6');
	var bet7 = document.getElementById('bet7');
	var bet8 = document.getElementById('bet8');
	
	//Enable all fields initially
	bet1.disabled = false;
	bet2.disabled = false;
	bet3.disabled = false;
	bet4.disabled = false;
	bet5.disabled = false;
	bet6.disabled = false;
	bet7.disabled = false;
	bet8.disabled = false;
		
	if(numFields == -1){
		bet1.setAttribute("disabled", "");
		bet2.setAttribute("disabled", "");
		bet3.setAttribute("disabled", "");
		bet4.setAttribute("disabled", "");
		bet5.setAttribute("disabled", "");
		bet6.setAttribute("disabled", "");
		bet7.setAttribute("disabled", "");
		bet8.setAttribute("disabled", "");
	}else if(numFields !== 8){
		bet8.setAttribute("disabled", "");
		if(numFields < 7){
			bet7.setAttribute("disabled", "");
			if(numFields < 6){
				bet6.setAttribute("disabled", "");
				if(numFields < 5){
					bet5.setAttribute("disabled", "");
					if(numFields < 4){
						bet4.setAttribute("disabled", "");
					}
				}
			}
		}
	}
}

//Processes inputs and outputs the results
function main() {
	var numBets = parseInt(document.getElementById('betType').value);
	var stake = parseFloat(document.getElementById('stake').value);
	var betArray = [];
	
	betArray.push(parseFloat(document.getElementById('bet1').value));
	betArray.push(parseFloat(document.getElementById('bet2').value));
	betArray.push(parseFloat(document.getElementById('bet3').value));
	
	//Only add these if bet type is not a Trixie
	//Pushes more odds depending on bet type
	if(numBets > 3){
		betArray.push(parseFloat(document.getElementById('bet4').value));
		if(numBets > 4){
			betArray.push(parseFloat(document.getElementById('bet5').value));
			if(numBets > 5){
				betArray.push(parseFloat(document.getElementById('bet6').value));
				if(numBets > 6){
					betArray.push(parseFloat(document.getElementById('bet7').value));
					if(numBets > 7){
						betArray.push(parseFloat(document.getElementById('bet8').value));
					}
				}
			}
		}
	}
	
	//Check for blank inputs first
	var noErrors = formIsErrorFree(betArray, numBets, stake);
	if(noErrors === true){
		var betSlip = new slip(stake, numBets, betArray);
		var profitableBets = [];
		var calculations = "<h3>Results</h3><br>\n<p>Total Outlay: $" + betSlip.totalOutlay() + "<br><br>\n";
		calculations = calculations + "If any of these combination of odds win, then you will gain profit:<br><br>\n<ul>\n";
		for(var i = 0; i < betSlip.betCombs.length; i++){
			if(betSlip.isProfitable(betSlip.betCombs[i])){
				profitableBets.push(betSlip.betCombs[i]);
				arrayAsString = arrayToString(betSlip.betCombs[i]);
				calculations = calculations + "<li>" + arrayAsString + " with a profit of $" + (betSlip.getProfit(betSlip.betCombs[i])) + "</li>\n";
			}
		}
		
		calculations = calculations + "</ul>\n </p>";

		var numWins = profitableBets.length;
		var probabilityOfProfit = Math.round((numWins*10000)/betSlip.numBetCombos+1)/100;

		//Let this be the set of all combinations that don't produce profit
		var losingCombinations = subtractSet(betSlip.betCombs, profitableBets);

		calculations = calculations + "<br><p>These combinations however will incur a loss:\n<ul>\n";

		for(i = 0; i < losingCombinations.length; i++){
			arrayAsString = arrayToString(losingCombinations[i]);
			calculations = calculations + "<li>" + arrayAsString + " with a loss of <span style=\"color:red\">$" + -1*(betSlip.getProfit(losingCombinations[i])) + "</span></li>\n";
		}

		calculations = calculations + "<li>If only one of these results win, or if none of the bets win, then you will lose <span style=\"color:red\">$" + betSlip.totalOutlay() + "</span></li></ul></p>\n";

		calculations = calculations +  "<br><p>This means you need at least " + shortestLength(profitableBets) + " odds to win if you want to make a profit. Therefore, there is a " + probabilityOfProfit + "% chance that you will make a profit.</p>";

		document.getElementById('calcOutput').innerHTML = calculations;
	}else{
		document.getElementById('calcOutput').innerHTML = "<h3>Error</h3><p><span style=\"color: red;\">You have not filled the form properly. Make sure all inputs do not contain non-numerical characters beside decimals<br></span></p>";
	}	
}

//Constructor for slip object
function slip(stk, type, bet) {
	
	this.stake = stk;
	this.betType = type;
	var numCombs = 0;
	
	for(var x = 2; x <= type; x++){
		numCombs += combination(type, x);
	}
	
	this.numBetCombos = numCombs;
	
	
	
	//Populate 2d array with powerset possible bet combinations
	var allSets = [[]];

	for(var i = 0; i < bet.length; i++){
		for(var j = 0, len = allSets.length; j < len; j++){
			allSets.push(allSets[j].concat(bet[i]));
		}
	}

	//Delete any arrays with length <= 1;
	this.betCombs = clearByLength(allSets, 1);
	
	this.showOneReturn = function (bets) {
		var totalOdds = 1;
		for(var i = 0; i < bets.length; i++){
			totalOdds *= bets[i];
		}
		return this.stake*totalOdds;
	};
	
	this.showReturnRec = function (winningBets) {
		var winnings = 0;
		for(var i = 0; i < this.numBetCombos; i++){
			if(isSubset(this.betCombs[i], winningBets)){
				winnings += this.showOneReturn(this.betCombs[i]);
			}
		}
		return winnings;
	};
	
	this.totalOutlay = function () {
		return this.stake*this.numBetCombos;
	};
	
	this.isProfitable = function (bets) {
		var breakEven = true;
		if(this.showReturnRec(bets) < this.totalOutlay()){
			breakEven = false;
		}
		
		return breakEven;
	};
	
	this.getProfit = function (bets){
		var cost = this.totalOutlay();
		var gains = this.showReturnRec(bets);
		var profit = gains-cost;
		return profit.toFixed(2);
	};
}

function formIsErrorFree(array, betType, stake) {

	if(betType == -1 || isNaN(stake)){
		return false;
	}

	for(var i = 0; i < array.length === true; i++){
		if(array[i] == 0 || typeof array[i] == 'undefined' || isNaN(array[i])){
			return false;
		}
	}
	
	return true;
}

function fact(n) {
	if(n === 0){
		return 1;
	}else{
		return n*fact(n-1);
	}
}

function combination(n, r){
	var nFact = fact(n);
	var rFact = fact(r);
	return nFact/(rFact*fact(n-r));
}

function countItems(item, array){
	var count = 0;
	for(var i = 0; i < array.length; i++){
		if(array[i] == item) count++;
	}
	return count;
}

function subtractSet(bigArray, littleArray){
	var newArray = [];
	for(var i = 0; i < bigArray.length; i++){
		if(isInSet(bigArray[i], littleArray) === false){
			newArray.push(bigArray[i]);
		}
	}
	return newArray;
}

function isInSet(key, array){
	var found = false;
	for(var i = 0; i < array.length; i++){
		if(key === array[i]){
			found = true;
		}
	}
	return found;
}

function isSubset(littleArray, bigArray){
	var possibleSubset = true;
	for(var i = 0; i < littleArray.length; i++){
		if(countItems(littleArray[i], bigArray) < countItems(littleArray[i], littleArray)){
			possibleSubset = false;
			break;
		}
	}
	return possibleSubset;
}

function getShortestArray(array){
	var shortest = new Array();
	shortest = array[0];
	for(var i = 0; i < array.length; i++){
		if(shortest.length > array[i].length) shortest = array[i];
	}
	return shortest;
}

function arrayToString(array){
	var newString = "";
	for(var i = 0; i < array.length - 1; i++){
		newString = newString + array[i] + ", ";
	}
	newString = newString + "and " + array[i];
	return newString;
}

//Remove indices from a 2d array based on length
function clearByLength(array, len){
	for(var i = 0; i < array.length; i++){
		if(array[i].length <= len){
			array = popAtIndex(array, i);
			i = -1;
		}
	}
	return array
}

//Find shortest length array in a 2d array
function shortestLength(array){
	var minLength = array[0].length;
	for(var i = 1; i < array.length; i++){
		if(array[i].length < minLength){
			minLength = array[i].length;
		}
	}
	return minLength
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

//swap two indices in an array
function swapPlaces(array, a, b){
	var temp = array[a];
	var tempIndex = a;
	array[a] = array[b];
	array[b] = temp;
	return array;
}

app.controller('EventCtrl', ['$scope', function($scope){
	$scope.generateYears = function(start, finish){
		var k = 0;
		var array = [];
		for(var i = start; i > finish-1; i--){
			array[k] = i;
			k++;
		}

		return array;
	};

	$scope.getSourceType = function(){
		var activeElements = document.getElementsByClassName("active");
		console.log(activeElements);
		return activeElements[0].id;
	};
}])
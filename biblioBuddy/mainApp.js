

angular.module('mainApp', ['eventModule'])
.config([function() {
	console.log("Config hook");
}])
.run([function() {
	console.log("Run hook");
}])
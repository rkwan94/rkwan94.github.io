app.controller('sourceController', function($scope, $http){
	monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	function createCORSRequest(method, url) {
	  var xhr = new XMLHttpRequest();
	  if ("withCredentials" in xhr) {

	    // Check if the XMLHttpRequest object has a "withCredentials" property.
	    // "withCredentials" only exists on XMLHTTPRequest2 objects.
	    xhr.open(method, url, true);

	  } else if (typeof XDomainRequest != "undefined") {

	    // Otherwise, check if XDomainRequest.
	    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	    xhr = new XDomainRequest();
	    xhr.open(method, url);

	  } else {

	    // Otherwise, CORS is not supported by the browser.
	    xhr = null;

	  }
	  return xhr;
	};

	function replaceSource(newSource){
		$scope.source = newSource;	
		generateReferences('journalArticle');

		console.log($scope.source);
	};

	$scope.source = {
		authors: [
			{
				count: 1,
				firstName: "",
				lastName: ""
			}
		],
	};

	$scope.numAuthors = function(){
		return $scope.source.authors.length;
	}

	$scope.addAuthor = function(){
		var numAuth = $scope.numAuthors();
		var newAuthor= {
			count: numAuth+1,
			firstName: "",
			lastName: ""
		}

		$scope.source.authors[numAuth] = newAuthor;
	};

	$scope.removeAuthor = function(){
		if($scope.source.authors.length > 1){
			var dummy = $scope.source.authors.pop();
		}
	};

	$scope.generateReferences = function(type){
		var citations;
		$scope.source.sourceType = type;

		console.log($scope.source);
		var refStyle = $scope.source.refStyle;
		$scope.source.reference = "";
		$scope.source.inText = "";
		
		if(refStyle == "harvard"){
			citations = harvard($scope.source);
		}else if(refStyle == "uts"){
			citations = harvardUTS($scope.source);
		}else if(refStyle == "apa"){
			citations = apa($scope.source);
		}else{
			citations = chicago($scope.source);
		}
		console.log(citations);
		$scope.source.reference = citations.reference;
		$scope.source.inText = citations.inText;
	};

	

	$scope.articleSearch = function(type){
		var searchUrl = "";

		searchUrl = searchUrl.concat("http://api.crossref.org/works?query=", 
			encodeURIComponent($scope.source.searchQuery));

		console.log($scope.source);

		$http({method: 'GET', url: searchUrl}).
			success(function(data, status) {
				console.log(data);
				console.log($scope.source);
				console.log(data.message.items[0]);

				var record = data.message.items[0];
				$scope.source.title = record.title[0];
				var authors = [];

				for(var i = 0; i < record.author.length; i++){
					var a = {};
					a.count = i + 1;
					a.lastName = record.author[i].family;
					a.firstName = record.author[i].given;

					authors.push(a);
				}

				$scope.source.authors = authors;
				$scope.source.sourceType = "journalArticle";
				$scope.source.year = record['published-print']['date-parts'][0][0];
				$scope.source.journal = record['container-title'][0];
				$scope.source.journalNum = record.volume;
				$scope.source.pagesUsed = record.page;
				$scope.generateReferences("journalArticle");
			}).
			error(function(data, status) {
				console.log(data || "Request failed");
			}
		); 

	};

	$scope.bookSearch = function(query){
		var key = "vqI5LRdlC8eFJARJqH2yjB27CmDPcMkgp3bc9mnRkfQbUS9micwMTpPjhSF5N4KyIp2Bo8QKSHolMgrA"
		var searchUrl = "";

		searchUrl = searchUrl.concat("http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=", 
			encodeURIComponent(query), 
			"&wskey=", 
			key);

		// build the yql query. Could be just a string - I think join makes easier reading
		var yqlURL = [
			"http://query.yahooapis.com/v1/public/yql",
			"?q=" + encodeURIComponent("select * from xml where url='" + searchUrl + "'"),
			"&format=xml&callback=?"
		].join("");

		// Now do the AJAX heavy lifting        
		$.getJSON(yqlURL, function(data){
			xmlContent = $(data.results[0]);
			console.log(xmlContent);
			//var Abstract = $(xmlContent).find("title").text();
			for(var i = 0; i < xmlContent[0].childNodes.length; i++){
				var node = xmlContent[0].childNodes[i];
				if(node.nodeName == "ENTRY"){
					console.log(node);
				}
				
				//console.log(node.nodeName + "-> " + node.nodeValue);
			}

			
		});
	};

	$scope.resetAuthors = function(){
		$scope.source.authors = [
			{
				count: 1,
				firstName: "",
				lastName: ""
			}
		]
	};
});

app.filter('trustedhtml', ['$sce', function($sce) { 
      return $sce.trustAsHtml; 
}]);
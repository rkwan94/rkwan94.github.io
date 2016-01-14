app.controller('sourceController', function(){
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
		this.source = newSource;	
		generateReferences('journalArticle');

		console.log(this.source);
	};

	this.source = {
		authors: [
			{
				count: 1,
				firstName: "",
				lastName: ""
			}
		],
	};

	function numAuthors(){
		return this.source.authors.length;
	}

	this.addAuthor = function(){
		var numAuth = numAuthors();
		var newAuthor= {
			count: numAuth+1,
			firstName: "",
			lastName: ""
		}

		this.source.authors[numAuth] = newAuthor;
	};

	function removeAuthor(){
		if(this.source.authors.length > 1){
			var dummy = this.source.authors.pop();
		}
	};

	function initialisedName(author){
		var nameString = "";
		var firstNames = author.firstName.split(" ");
		for(var i = 0; i < firstNames.length; i++){
			initials = this.source.refStyle === "uts" || this.source.refStyle === "apa" ? nameString + firstNames[i].charAt(0) + "." : nameString + firstNames[i].charAt(0);
		}
		nameString =  author.lastName + ", " + initials;
		return nameString;
	};

	function inTextAuthorCitation(){
		var numAuth = numAuthors();
		var inTextAuthor = this.source.authors[0].lastName;

		for (var i = 1; i < numAuth-1; i++) {
			inTextAuthor = 	inTextAuthor + ", " + this.source.authors[i].lastName;
		}

		inTextAuthor = numAuth === 1 ? this.source.authors[0].lastName : inTextAuthor + " & " + this.source.authors[numAuth-1].lastName;

		return inTextAuthor;
	}

	function referenceAuthorCitation(){
		var numAuth = numAuthors();
		var referenceAuthor = initialisedName(this.source.authors[0]);

		for (var i = 1; i < numAuth-1; i++) {
			referenceAuthor = 	referenceAuthor + ", " + initialisedName(this.source.authors[i]);
		}

		if(this.source.refStyle == "apa"){
			if (numAuth > 1){
				referenceAuthor = referenceAuthor + ", & " + initialisedName(this.source.authors[numAuth-1]);
			}
		}else{
			if (numAuth > 1){
				referenceAuthor = referenceAuthor + " & " + initialisedName(this.source.authors[numAuth-1]);
			}
		}
		
		return referenceAuthor;
	}

	function apa(){
		var inTextAuthor = "";
		var numAuth = this.source.authors.length;

		if(numAuth > 3){
			inTextAuthor = this.source.authors[0].lastName + " et. al";
		}else{
			inTextAuthor = inTextAuthorCitation();
		}
		this.source.inText = "(" + inTextAuthor + " " + this.source.year + ")";

		if(this.source.sourceType == 'website'){
			this.source.reference = this.source.hasOwnProperty('author') ? referenceAuthorCitation() : this.source.reference.concat(this.source.siteName, ", ");
			this.source.reference = this.source.hasOwnProperty('year') ? this.source.reference.concat(" (", this.source.year, "). ") : this.source.reference.concat(" n.d. ");
		}else if(this.source.sourceType == 'newsOrMag'){
			this.source.reference = referenceAuthorCitation();
			this.source.reference = this.source.reference.concat(" (", this.source.year, ", ");
		}else{
			this.source.reference = referenceAuthorCitation();
			this.source.reference = this.source.reference.concat(" (", this.source.year, "). ");
		}

		if(this.source.sourceType == 'book'){	
			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>, ");

			if(this.source.hasOwnProperty('edition')){
				this.source.reference = this.source.reference.concat("(", this.source.edition, "ed.). ");			
			}

			this.source.reference = this.source.reference.concat(this.source.cityPublished, ": ");
			this.source.reference = this.source.reference.concat(this.source.publisher, ".");			
		}else if(this.source.sourceType == 'journalArticle'){
			this.source.reference = this.source.reference.concat(this.source.title, ". ");
			this.source.reference = this.source.reference.concat("<i>", this.source.journal, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.journalNum);
			this.source.reference = this.source.reference.concat("(", this.source.issueNum, "), ");
			this.source.reference = this.source.reference.concat(this.source.pagesUsed, ".");
		}else if(this.source.sourceType == 'website'){
			this.source.reference = this.source.reference.concat(this.source.pageTitle);

			if(this.source.hasOwnProperty('author')){
				this.source.reference = this.source.reference.concat("<i>", this.source.siteName, "</i>. ");
			}
			
			this.source.reference = this.source.reference.concat("Retrieved ", this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], " ", this.source.date.getFullYear(), ", ");
			this.source.reference = this.source.reference.concat("from ", this.source.url);			
		}else if(this.source.sourceType == 'newsOrMag'){
			this.source.reference = this.source.reference.concat(monthNames[this.source.date.getMonth()], " ", this.source.date.getDate(), "). ");
			this.source.reference = this.source.reference.concat(this.source.articleTitle, ". ");
			this.source.reference = this.source.reference.concat("<i>", this.source.paperName, "</i>");
			
			this.source.reference = this.source.hasOwnProperty('pagesUsed') ? this.source.reference.concat(", p. ", this.source.pagesUsed, ".") : this.source.reference.concat(".");
		}
	}

	function chicago(){
		var inTextAuthor = this.source.authors[0].firstName + " " + this.source.authors[0].lastName;
		var refAuthor = this.source.authors[0].lastName + ", " + this.source.authors[0].firstName;
		var numAuth = this.source.authors.length;

		if(this.source.sourceType != 'website'){
			if(numAuth < 4){
				for(var i = 1; i < numAuth-1; i++){
					inTextAuthor = inTextAuthor.concat(", ", this.source.authors[i].firstName, " ", this.source.authors[i].lastName);
					refAuthor = refAuthor.concat(", ", this.source.authors[i].firstName, " ", this.source.authors[i].lastName);
				}
	
				inTextAuthor = inTextAuthor.concat(" and ", this.source.authors[numAuth-1].firstName, " ", this.source.authors[numAuth-1].lastName, ", ");
			}else{
				for(var i = 1; i < numAuth-1; i++){
					refAuthor = refAuthor.concat(", ", this.source.authors[i].firstName, " ", this.source.authors[i].lastName);
				}
				inTextAuthor = inTextAuthor.concat(" et al., ");
			}
		}
		this.source.inText = this.source.inText.concat(inTextAuthor);
		this.source.reference = this.source.reference.concat(refAuthor);


		if(this.source.sourceType == 'book'){
			this.source.inText = this.source.inText.concat("<i>", this.source.title, "</i> ");
			this.source.inText = this.source.inText.concat("(", this.source.cityPublished, ": ");
			this.source.inText = this.source.inText.concat(this.source.publisher, ", ");
			this.source.inText = this.source.inText.concat(this.source.year, "), ");
			this.source.inText = this.source.inText.concat(this.source.pagesUsed, ".");

			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>. ");
			this.source.reference = this.source.reference.concat(this.source.cityPublished, ": ");
			this.source.reference = this.source.reference.concat(this.source.publisher, ", ");
			this.source.reference = this.source.reference.concat(this.source.year, ".");
		}else if(this.source.sourceType == 'journalArticle'){
			this.source.inText = this.source.inText.concat(', "', this.source.title, '," ');
			this.source.inText = this.source.inText.concat("<i>", this.source.journal, "</i> ");
			this.source.inText = this.source.inText.concat(this.source.journalNum, ", ");
			this.source.inText = this.source.inText.concat("no. ", this.source.issueNum, " (");
			this.source.inText = this.source.inText.concat(this.source.year, "): ");
			this.source.inText = this.source.inText.concat(this.source.pagesUsed, ".");

			this.source.reference = this.source.reference.concat(', "', this.source.title, '," ');
			this.source.reference = this.source.reference.concat("<i>", this.source.journal, "</i> ");
			this.source.reference = this.source.reference.concat(this.source.journalNum, ", ");
			this.source.reference = this.source.reference.concat("no. ", this.source.issueNum, " (");
			this.source.reference = this.source.reference.concat(this.source.year, "): ");
			this.source.reference = this.source.reference.concat(this.source.pagesUsed, ".");
		}else if(this.source.sourceType == 'website'){
			this.source.inText = this.source.inText.concat('"', this.source.pageTitle, '," ');
			this.source.inText = this.source.inText.concat(this.source.siteName, ", ");
			this.source.inText = this.source.inText.concat("Date accessed ", this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], ", ", this.source.date.getFullYear(), ".");

			this.source.reference = this.source.inText;
			this.source.reference = this.source.reference.concat(" ", this.source.url, ".");
		}else if(this.source.sourceType == 'newsOrMag'){
			this.source.inText = this.source.inText.concat(', "', this.source.articleTitle, '," ');
			this.source.inText = this.source.inText.concat("<i>", this.source.paperName, "</i> (");
			this.source.inText = this.source.inText.concat(this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], "): ");
			this.source.inText = this.source.hasOwnProperty('pagesUsed') ? this.source.reference.concat(", ", this.source.pagesUsed, ".") : this.source.reference.concat(".");

			this.source.reference = this.source.reference.concat(', "', this.source.articleTitle, '," ');
			this.source.reference = this.source.reference.concat("<i>", this.source.paperName, "</i> (");
			this.source.reference = this.source.reference.concat(this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], "): ");
			this.source.reference = this.source.hasOwnProperty('pagesUsed') ? this.source.reference.concat(", ", this.source.pagesUsed, ".") : this.source.reference.concat(".");
		}
	}

	function harvard(){
		var inTextAuthor = "";
		var numAuth = this.source.authors.length;

		if(numAuth > 3){
			inTextAuthor = this.source.authors[0].lastName + " et. al";
		}else{
			inTextAuthor = inTextAuthorCitation();
		}
		this.source.inText = "(" + inTextAuthor + " " + this.source.year + ")";

		if(this.source.sourceType == 'website'){
			this.source.reference = this.source.hasOwnProperty('author') ? referenceAuthorCitation() : '';
			this.source.reference = this.source.hasOwnProperty('year') ? this.source.reference.concat(" ", this.source.year, ", ") : this.source.reference.concat(" n.d. ");
		}else{
			this.source.reference = referenceAuthorCitation();
			this.source.reference = this.source.reference.concat(" ", this.source.year, ", ");
		}

		if(this.source.sourceType == 'book'){	
			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>, ");

			if(this.source.hasOwnProperty('edition')){
				this.source.reference = this.source.reference.concat(this.source.edition, "edn, ");		
			}

			this.source.reference = this.source.reference.concat(this.source.publisher, ", ");
			this.source.reference = this.source.reference.concat(this.source.cityPublished, ".");
		}else if(this.source.sourceType == 'journalArticle'){
			this.source.reference = this.source.reference.concat("'", this.source.title, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.journal, "</i>, ");
			this.source.reference = this.source.reference.concat("vol. ", this.source.journalNum, ", ");
			
			if(this.source.hasOwnProperty('issueNum')){
				this.source.reference = this.source.reference.concat("no. ", this.source.issueNum, ", ");
			}

			this.source.reference = this.source.reference.concat("pp. ", this.source.pagesUsed, ".");
		}else if(this.source.sourceType == 'website'){
			this.source.reference = this.source.reference.concat("<i>", this.source.pageTitle, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.siteName, ", ");
			this.source.reference = this.source.reference.concat("viewed ", this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], " ", this.source.date.getFullYear(), ", ");
			this.source.reference = this.source.reference.concat(this.source.url);
		}else if(this.source.sourceType == 'newsOrMag'){
			this.source.reference = this.source.reference.concat("'", this.source.articleTitle, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.paperName, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()]);
			this.source.reference = this.source.hasOwnProperty('pagesUsed') ? this.source.reference.concat(", ", this.source.pagesUsed, ".") : this.source.reference.concat(".");
		}
	}

	function harvardUTS(){
		var inTextAuthor = "";
		var numAuth = this.source.authors.length;

		if(numAuth > 3){
			inTextAuthor = this.source.authors[0].lastName + " et. al";
		}else{
			inTextAuthor = inTextAuthorCitation();
		}
		this.source.inText = "(" + inTextAuthor + " " + this.source.year + ")";

		if(this.source.sourceType == 'website'){
			this.source.reference = this.source.hasOwnProperty('author') ? referenceAuthorCitation() : '';
			this.source.reference = this.source.hasOwnProperty('year') ? this.source.reference.concat(" ", this.source.year, ", ") : this.source.reference.concat(" n.d. ");
		}else{
			this.source.reference = referenceAuthorCitation();
			this.source.reference = this.source.reference.concat(" ", this.source.year, ", ");
		}

		if(this.source.sourceType == 'book'){	
			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>, ");

			if(this.source.hasOwnProperty('edition')){
				this.source.reference = this.source.reference.concat(this.source.edition, "edn, ");		
			}

			this.source.reference = this.source.reference.concat(this.source.publisher, ", ");
			this.source.reference = this.source.reference.concat(this.source.cityPublished, ".");
		}else if(this.source.sourceType == 'journalArticle'){
			this.source.reference = this.source.reference.concat("'", this.source.title, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.journal, "</i>, ");
			this.source.reference = this.source.reference.concat("vol. ", this.source.journalNum, ", ");
			
			if(this.source.hasOwnProperty('issueNum')){
				this.source.reference = this.source.reference.concat("no. ", this.source.issueNum, ", ");
			}
			
			this.source.reference = this.source.reference.concat("pp. ", this.source.pagesUsed, ".");
		}else if(this.source.sourceType == 'website'){
			this.source.reference = this.source.reference.concat("<i>", this.source.pageTitle, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.siteName, ", ");
			this.source.reference = this.source.reference.concat("viewed ", this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], " ", this.source.date.getFullYear(), ", ");
			this.source.reference = this.source.reference.concat("<", this.source.url, ">");		
		}else if(this.source.sourceType == 'newsOrMag'){
			this.source.reference = this.source.reference.concat("'", this.source.articleTitle, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.paperName, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()]);
			this.source.reference = this.source.hasOwnProperty('pagesUsed') ? this.source.reference.concat(", ", this.source.pagesUsed, ".") : this.source.reference.concat(".");
		}
	}

	function generateReferences(type){
		this.source.sourceType = type;

		console.log(this.source);
		var refStyle = this.source.refStyle;
		this.source.reference = "";
		this.source.inText = "";
		
		if(refStyle == "harvard"){
			harvard();
		}else if(refStyle == "uts"){
			harvardUTS();
		}else if(refStyle == "apa"){
			apa();
		}else{
			chicago();
		}
	};

	

	this.articleSearch = function(type){
		var searchUrl = "";

		searchUrl = searchUrl.concat("http://api.crossref.org/works?query=", 
			encodeURIComponent(this.source.searchQuery));


		var newSource = this.source;

		$.getJSON(searchUrl, function(data){
			console.log(newSource);
			
			console.log(data.message.items[0]);

			var record = data.message.items[0];

			newSource.title = record.title[0];
			var authors = [];

			for(var i = 0; i < record.author.length; i++){
				var a = {};
				a.count = i + 1;
				a.lastName = record.author[i].family;
				a.firstName = record.author[i].given;

				authors.push(a);
			}

			newSource.authors = authors;

			newSource.sourceType = "journalArticle";

			newSource.year = record['published-print']['date-parts'][0][0];

			newSource.journal = record['container-title'][0];

			newSource.journalNum = record.volume;

			newSource.pagesUsed = record.page;
			
			replaceSource(newSource);
		});

	};

	this.bookSearch = function(query){
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

	this.resetAuthors = function(){
		this.source.authors = [
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
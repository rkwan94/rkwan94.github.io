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

	this.source = {
		authors: [
			{
				count: 1,
				firstName: "",
				lastName: ""
			}
		],
	};

	this.numAuthors = function(){
		return this.source.authors.length;
	}

	this.addAuthor = function(){
		var numAuthors = this.numAuthors();
		var newAuthor= {
			count: numAuthors+1,
			firstName: "",
			lastName: ""
		}

		this.source.authors[numAuthors] = newAuthor;
	};

	this.removeAuthor = function(){
		if(this.source.authors.length > 1){
			var dummy = this.source.authors.pop();
		}
	};

	this.initialisedName = function(author){
		var nameString = "";
		var firstNames = author.firstName.split(" ");
		for(var i = 0; i < firstNames.length; i++){
			initials = this.source.refStyle === "uts" || this.source.refStyle === "apa" ? nameString + firstNames[i].charAt(0) + "." : nameString + firstNames[i].charAt(0);
		}
		nameString =  author.lastName + ", " + initials;
		return nameString;
	};

	this.inTextAuthorCitation = function(){
		var numAuthors = this.numAuthors();
		var inTextAuthor = this.source.authors[0].lastName;

		for (var i = 1; i < numAuthors-1; i++) {
			inTextAuthor = 	inTextAuthor + ", " + this.source.authors[i].lastName;
		}

		inTextAuthor = numAuthors === 1 ? this.source.authors[0].lastName : inTextAuthor + " & " + this.source.authors[numAuthors-1].lastName;

		return inTextAuthor;
	}

	this.referenceAuthorCitation = function(){
		var numAuthors = this.numAuthors();
		var referenceAuthor = this.initialisedName(this.source.authors[0]);

		for (var i = 1; i < numAuthors-1; i++) {
			referenceAuthor = 	referenceAuthor + ", " + this.initialisedName(this.source.authors[i]);
		}

		if(this.source.refStyle == "apa"){
			if (numAuthors > 1){
				referenceAuthor = referenceAuthor + ", & " + this.initialisedName(this.source.authors[numAuthors-1]);
			}
		}else{
			if (numAuthors > 1){
				referenceAuthor = referenceAuthor + " & " + this.initialisedName(this.source.authors[numAuthors-1]);
			}
		}
		
		return referenceAuthor;
	}

	this.apa = function(){
		var inTextAuthor = "";
		var numAuthors = this.source.authors.length;

		if(numAuthors > 3){
			inTextAuthor = this.source.authors[0].lastName + " et. al";
		}else{
			inTextAuthor = this.inTextAuthorCitation();
		}
		this.source.inText = "(" + inTextAuthor + " " + this.source.year + ")";

		if(type == 'website'){
			this.source.reference = this.source.hasOwnProperty('author') ? this.referenceAuthorCitation() : this.source.reference.concat(this.source.siteName, ", ");
			this.source.reference = this.source.hasOwnProperty('year') ? this.source.reference.concat(" (", this.source.year, "). ") : this.source.reference.concat(" n.d. ");
		}else if(type == 'newsOrMag'){
			this.source.reference = this.referenceAuthorCitation();
			this.source.reference = this.source.reference.concat(" (", this.source.year, ", ");
		}else{
			this.source.reference = this.referenceAuthorCitation();
			this.source.reference = this.source.reference.concat(" (", this.source.year, "). ");
		}

		if(type == 'book'){	
			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>, ");

			if(this.source.hasOwnProperty('edition')){
				this.source.reference = this.source.reference.concat("(", this.source.edition, "ed.). ");			
			}

			this.source.reference = this.source.reference.concat(this.source.cityPublished, ": ");
			this.source.reference = this.source.reference.concat(this.source.publisher, ".");			
		}else if(type == 'journalArticle'){
			this.source.reference = this.source.reference.concat(this.source.title, ". ");
			this.source.reference = this.source.reference.concat("<i>", this.source.journal, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.journalNum);
			this.source.reference = this.source.reference.concat("(", this.source.issueNum, "), ");
			this.source.reference = this.source.reference.concat(this.source.pagesUsed, ".");
		}else if(type == 'website'){
			this.source.reference = this.source.reference.concat(this.source.pageTitle);

			if(this.source.hasOwnProperty('author')){
				this.source.reference = this.source.reference.concat("<i>", this.source.siteName, "</i>. ");
			}
			
			this.source.reference = this.source.reference.concat("Retrieved ", this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], " ", this.source.date.getFullYear(), ", ");
			this.source.reference = this.source.reference.concat("from ", this.source.url);			
		}else if(type == 'newsOrMag'){
			this.source.reference = this.source.reference.concat(monthNames[this.source.date.getMonth()], " ", this.source.date.getDate(), "). ");
			this.source.reference = this.source.reference.concat(this.source.articleTitle, ". ");
			this.source.reference = this.source.reference.concat("<i>", this.source.paperName, "</i>");
			
			this.source.reference = this.source.hasOwnProperty('pagesUsed') ? this.source.reference.concat(", p. ", this.source.pagesUsed, ".") : this.source.reference.concat(".");
		}
	}

	this.chicago = function(){
		var inTextAuthor = this.source.authors[0].firstName + " " + this.source.authors[0].lastName;
		var refAuthor = this.source.authors[0].lastName + ", " + this.source.authors[0].firstName;
		var numAuthors = this.source.authors.length;

		if(type != 'website'){
			if(numAuthors < 4){
				for(var i = 1; i < numAuthors-1; i++){
					inTextAuthor = inTextAuthor.concat(", ", this.source.authors[i].firstName, " ", this.source.authors[i].lastName);
					refAuthor = refAuthor.concat(", ", this.source.authors[i].firstName, " ", this.source.authors[i].lastName);
				}
	
				inTextAuthor = inTextAuthor.concat(" and ", this.source.authors[numAuthors-1].firstName, " ", this.source.authors[numAuthors-1].lastName, ", ");
			}else{
				for(var i = 1; i < numAuthors-1; i++){
					refAuthor = refAuthor.concat(", ", this.source.authors[i].firstName, " ", this.source.authors[i].lastName);
				}
				inTextAuthor = inTextAuthor.concat(" et al., ");
			}
		}
		this.source.inText = this.source.inText.concat(inTextAuthor);
		this.source.reference = this.source.reference.concat(refAuthor);


		if(type == 'book'){
			this.source.inText = this.source.inText.concat("<i>", this.source.title, "</i> ");
			this.source.inText = this.source.inText.concat("(", this.source.cityPublished, ": ");
			this.source.inText = this.source.inText.concat(this.source.publisher, ", ");
			this.source.inText = this.source.inText.concat(this.source.year, "), ");
			this.source.inText = this.source.inText.concat(this.source.pagesUsed, ".");

			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>. ");
			this.source.reference = this.source.reference.concat(this.source.cityPublished, ": ");
			this.source.reference = this.source.reference.concat(this.source.publisher, ", ");
			this.source.reference = this.source.reference.concat(this.source.year, ".");
		}else if(type == 'journalArticle'){
			this.source.inText = this.source.inText.concat(', "', this.source.articleTitle, '," ');
			this.source.inText = this.source.inText.concat("<i>", this.source.journalArticle, "</i> ");
			this.source.inText = this.source.inText.concat(this.source.journalNum, ", ");
			this.source.inText = this.source.inText.concat("no. ", this.source.issueNum, " (");
			this.source.inText = this.source.inText.concat(this.source.year, "): ");
			this.source.inText = this.source.inText.concat(this.source.pagesUsed, ".");

			this.source.reference = this.source.reference.concat(', "', this.source.articleTitle, '," ');
			this.source.reference = this.source.reference.concat("<i>", this.source.journalArticle, "</i> ");
			this.source.reference = this.source.reference.concat(this.source.journalNum, ", ");
			this.source.reference = this.source.reference.concat("no. ", this.source.issueNum, " (");
			this.source.reference = this.source.reference.concat(this.source.year, "): ");
			this.source.reference = this.source.reference.concat(this.source.pagesUsed, ".");
		}else if(type == 'website'){
			this.source.inText = this.source.inText.concat('"', this.source.pageTitle, '," ');
			this.source.inText = this.source.inText.concat(this.source.siteName, ", ");
			this.source.inText = this.source.inText.concat("Date accessed ", this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], ", ", this.source.date.getFullYear(), ".");

			this.source.reference = this.source.inText;
			this.source.reference = this.source.reference.concat(" ", this.source.url, ".");
		}else if(type == 'newsOrMag'){
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

	this.harvard = function(){
		var inTextAuthor = "";
		var numAuthors = this.source.authors.length;

		if(numAuthors > 3){
			inTextAuthor = this.source.authors[0].lastName + " et. al";
		}else{
			inTextAuthor = this.inTextAuthorCitation();
		}
		this.source.inText = "(" + inTextAuthor + " " + this.source.year + ")";

		if(type == 'website'){
			this.source.reference = this.source.hasOwnProperty('author') ? this.referenceAuthorCitation() : '';
			this.source.reference = this.source.hasOwnProperty('year') ? this.source.reference.concat(" ", this.source.year, ", ") : this.source.reference.concat(" n.d. ");
		}else{
			this.source.reference = this.referenceAuthorCitation();
			this.source.reference = this.source.reference.concat(" ", this.source.year, ", ");
		}

		if(type == 'book'){	
			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>, ");

			if(this.source.hasOwnProperty('edition')){
				this.source.reference = this.source.reference.concat(this.source.edition, "edn, ");		
			}

			this.source.reference = this.source.reference.concat(this.source.publisher, ", ");
			this.source.reference = this.source.reference.concat(this.source.cityPublished, ".");
		}else if(type == 'journalArticle'){
			this.source.reference = this.source.reference.concat("'", this.source.title, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.journal, "</i>, ");
			this.source.reference = this.source.reference.concat("vol. ", this.source.journalNum, ", ");
			this.source.reference = this.source.reference.concat("no. ", this.source.issueNum, ", ");
			this.source.reference = this.source.reference.concat("pp. ", this.source.pagesUsed, ".");
		}else if(type == 'website'){
			this.source.reference = this.source.reference.concat("<i>", this.source.pageTitle, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.siteName, ", ");
			this.source.reference = this.source.reference.concat("viewed ", this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], " ", this.source.date.getFullYear(), ", ");
			this.source.reference = this.source.reference.concat(this.source.url);
		}else if(type == 'newsOrMag'){
			this.source.reference = this.source.reference.concat("'", this.source.articleTitle, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.paperName, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()]);
			this.source.reference = this.source.hasOwnProperty('pagesUsed') ? this.source.reference.concat(", ", this.source.pagesUsed, ".") : this.source.reference.concat(".");
		}
	}

	this.harvardUTS = function(){
		var inTextAuthor = "";
		var numAuthors = this.source.authors.length;

		if(numAuthors > 3){
			inTextAuthor = this.source.authors[0].lastName + " et. al";
		}else{
			inTextAuthor = this.inTextAuthorCitation();
		}
		this.source.inText = "(" + inTextAuthor + " " + this.source.year + ")";

		if(type == 'website'){
			this.source.reference = this.source.hasOwnProperty('author') ? this.referenceAuthorCitation() : '';
			this.source.reference = this.source.hasOwnProperty('year') ? this.source.reference.concat(" ", this.source.year, ", ") : this.source.reference.concat(" n.d. ");
		}else{
			this.source.reference = this.referenceAuthorCitation();
			this.source.reference = this.source.reference.concat(" ", this.source.year, ", ");
		}

		if(type == 'book'){	
			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>, ");

			if(this.source.hasOwnProperty('edition')){
				this.source.reference = this.source.reference.concat(this.source.edition, "edn, ");		
			}

			this.source.reference = this.source.reference.concat(this.source.publisher, ", ");
			this.source.reference = this.source.reference.concat(this.source.cityPublished, ".");
		}else if(type == 'journalArticle'){
			this.source.reference = this.source.reference.concat("'", this.source.title, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.journal, "</i>, ");
			this.source.reference = this.source.reference.concat("vol. ", this.source.journalNum, ", ");
			this.source.reference = this.source.reference.concat("no. ", this.source.issueNum, ", ");
			this.source.reference = this.source.reference.concat("pp. ", this.source.pagesUsed, ".");
		}else if(type == 'website'){
			this.source.reference = this.source.reference.concat("<i>", this.source.pageTitle, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.siteName, ", ");
			this.source.reference = this.source.reference.concat("viewed ", this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()], " ", this.source.date.getFullYear(), ", ");
			this.source.reference = this.source.reference.concat("<", this.source.url, ">");		
		}else if(type == 'newsOrMag'){
			this.source.reference = this.source.reference.concat("'", this.source.articleTitle, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.paperName, "</i>, ");
			this.source.reference = this.source.reference.concat(this.source.date.getDate(), " ", monthNames[this.source.date.getMonth()]);
			this.source.reference = this.source.hasOwnProperty('pagesUsed') ? this.source.reference.concat(", ", this.source.pagesUsed, ".") : this.source.reference.concat(".");
		}
	}

	this.generateReferences = function(type){
		this.source.sourceType = type;

		console.log(this.source);
		var refStyle = this.source.refStyle;
		
		if(refStyle == "harvard"){
			this.harvard();
		}else if(refStyle == "uts"){
			this.harvardUTS();
		}else if(refStyle == "apa"){
			this.apa();
		}else{
			this.chicago();
		}
	};

	this.search = function(query){
		var xmlhttp = new XMLHttpRequest();
		var key = "vqI5LRdlC8eFJARJqH2yjB27CmDPcMkgp3bc9mnRkfQbUS9micwMTpPjhSF5N4KyIp2Bo8QKSHolMgrA"
		var searchUrl = "";
		searchUrl = searchUrl.concat("http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=", query, "&wskey=", key);
		//var citeUrl = String.concat("http://www.worldcat.org/webservices/catalog/content/citations/", queryOCLCNum, "?wskey=", key, "", );

		xmlhttp.open("GET", searchUrl, true);
		xmlhttp.send();

		xmlDocument = xmlhttp.responseXML;
		console.log(xmlDocument.childNodes['0'].textContent);
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
app.controller('sourceController', function(){
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

	this.initialisedName = function(author){
		var nameString = "";
		var firstNames = author.firstName.split(" ");
		for(var i = 0; i < firstNames.length; i++){
			initials = this.source.refStyle === "uts" ? nameString + firstNames[i].charAt(0) + "." : nameString + firstNames[i].charAt(0);
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

		referenceAuthor = numAuthors === 1 ? this.initialisedName(this.source.authors[0]) : referenceAuthor + " & " + this.initialisedName(this.source.authors[numAuthors-1]);

		return referenceAuthor;
	}

	this.generateReferences = function(type){
		this.source.sourceType = type;

		console.log(this.source);
		var refStyle = this.source.refStyle;
		var numAuthors = this.source.authors.length;


		//in-text reference first
		var inTextAuthor = "";
		if(numAuthors > 3){
			if(refStyle === "uts" || refStyle === "harvard"){
				inTextAuthor = this.source.authors[0].lastName + " et. al";
			}else{
				inTextAuthor = this.inTextAuthorCitation();
			}
		}else{
			inTextAuthor = this.inTextAuthorCitation();
		}
		this.source.inText = "(" + inTextAuthor + " " + this.source.year + ")";

		//reference list entry
		//authors first
		this.source.reference = this.referenceAuthorCitation();
		this.source.reference = this.source.reference.concat(" ", this.source.year, ", ");

		if(type === 'book'){	
			this.source.reference = this.source.reference.concat("<i>", this.source.title, "</i>, ");

			if(this.source.hasOwnProperty('edition')){
				this.source.reference = this.source.reference.concat(this.source.edition, "edn, ");
			}

			this.source.reference = this.source.reference.concat(this.source.publisher, ", ");
			this.source.reference = this.source.reference.concat(this.source.cityPublished, ".");
		}else if(type === 'journalArticle'){
			this.source.reference = this.source.reference.concat("'", this.source.title, "', ");
			this.source.reference = this.source.reference.concat("<i>", this.source.journal, "</i>, ");
			this.source.reference = this.source.reference.concat("vol. ", this.source.journalNum, ", ");
			this.source.reference = this.source.reference.concat("no. ", this.source.issueNum, ", ");
			this.source.reference = this.source.reference.concat("pp. ", this.source.pagesUsed, ".");
		}else if(type === 'website'){
			this.source.reference = this.source.reference.concat("<i>", this.source.pageTitle, "</i>, ");
			this.source.reference = this.source.reference.concat("vol. ", this.source.journalNum, ", ");
			this.source.reference = this.source.reference.concat("no. ", this.source.issueNum, ", ");
			this.source.reference = this.source.reference.concat("pp. ", this.source.pagesUsed, ".");
		}else if(type === 'newsOrMag'){

		}
	};


});

app.filter('trustedhtml', ['$sce', function($sce) { 
      return $sce.trustAsHtml; 
}]);
function initialisedName(author, source) {
    var nameString = "";
    var firstNames = author.firstName.split(" ");
    for (var i = 0; i < firstNames.length; i++) {
        initials = source.refStyle === "uts" || source.refStyle === "apa" ? nameString + firstNames[i].charAt(0) + "." : nameString + firstNames[i].charAt(0);
    }
    nameString = author.lastName + ", " + initials;
    return nameString;
};

function inTextAuthorCitation(source) {
    var numAuth = source.authors.length;
    var inTextAuthor = source.authors[0].lastName;

    for (var i = 1; i < numAuth - 1; i++) {
        inTextAuthor = inTextAuthor + ", " + source.authors[i].lastName;
    }

    inTextAuthor = numAuth === 1 ? source.authors[0].lastName : inTextAuthor + " & " + source.authors[numAuth - 1].lastName;

    return inTextAuthor;
}

function referenceAuthorCitation(source) {
    var numAuth = source.authors.length;
    var referenceAuthor = initialisedName(source.authors[0], source);

    for (var i = 1; i < numAuth - 1; i++) {
        referenceAuthor = referenceAuthor + ", " + initialisedName(source.authors[i], source);
    }

    if (source.refStyle == "apa") {
        if (numAuth > 1) {
            referenceAuthor = referenceAuthor + ", & " + initialisedName(source.authors[numAuth - 1], source);
        }
    } else {
        if (numAuth > 1) {
            referenceAuthor = referenceAuthor + " & " + initialisedName(source.authors[numAuth - 1], source);
        }
    }

    return referenceAuthor;
}

function firstNamesToInitials(str) {
    var ret = "";
    var strAsArray = str.split(" ");
    for (var i in strAsArray) {
        ret = ret.concat(strAsArray[i].charAt(0));
    }
    return ret;
}

function ama(source) {
    var refObject = {
        inText: "",
        reference: ""
    };

    var numAuth = source.authors.length;
    var numAdded = 0;
    var authorString = "";
    for (var i in source.authors) {
        var a = source.authors[i];
        if (numAuth > 6 && numAdded == 3) {
            authorString = authorString.concat("et al. ");
            break;
        } else if (numAdded == numAuth - 1) {
            authorString = authorString.concat(a.lastName, " ", firstNamesToInitials(a.firstName), ". ");
            break; // not really necessary
        } else {
            authorString = authorString.concat(a.lastName, " ", firstNamesToInitials(a.firstName), ", ");
            numAdded += 1;
        }
    }

    if (source.sourceType != 'website') {
        refObject.reference = authorString;
    }

    if (source.sourceType == 'book') {
        refObject.reference = refObject.reference.concat(source.title, ". ");

        if (source.hasOwnProperty('edition')) {
            refObject.reference = refObject.reference.concat(source.edition, "ed. ");
        }

        refObject.reference = refObject.reference.concat(source.cityPublished, ": ");
        refObject.reference = refObject.reference.concat(source.publisher, ";");
        refObject.reference = refObject.reference.concat(source.year, ".");
    } else if (source.sourceType == 'journalArticle') {
        refObject.reference = refObject.reference.concat(source.title, ". ");
        refObject.reference = refObject.reference.concat(source.journal, ". ");
        refObject.reference = refObject.reference.concat(source.year, ";");
        refObject.reference = refObject.reference.concat(source.journalNum);
        refObject.reference = refObject.reference.concat("(", source.issueNum, "):");
        refObject.reference = refObject.reference.concat(source.pagesUsed, ".");
    } else if (source.sourceType == 'website') {
        if (source.hasOwnProperty('author')) {
            refObject.reference = refObject.reference.concat(source.siteName, ". ");
        }

        refObject.reference = refObject.reference.concat(source.pageTitle);
        refObject.reference = refObject.reference.concat(" ", source.year, ". ");

        refObject.reference = refObject.reference.concat(source.url, ". ");

        refObject.reference = refObject.reference.concat("Accessed ", monthNames[source.date.getMonth()], " ", source.date.getDate(), ", ", source.date.getFullYear(), ". ");

    }

    refObject.inText = refObject.reference;

    return refObject;
}

function apa(source) {
    var refObject = {
        inText: "",
        reference: ""
    };
    var inTextAuthor = "";
    var numAuth = source.authors.length;

    if (numAuth > 3) {
        inTextAuthor = source.authors[0].lastName + " et. al";
    } else {
        inTextAuthor = inTextAuthorCitation(source);
    }
    refObject.inText = "(" + inTextAuthor + " " + source.year + ")";

    if (source.sourceType == 'website') {
        refObject.reference = source.hasOwnProperty('author') ? referenceAuthorCitation(source) : refObject.reference.concat(source.siteName, ", ");
        refObject.reference = source.hasOwnProperty('year') ? refObject.reference.concat(" (", source.year, "). ") : refObject.reference.concat(" n.d. ");
    } else if (source.sourceType == 'newsOrMag') {
        refObject.reference = referenceAuthorCitation(source);
        refObject.reference = refObject.reference.concat(" (", source.year, ", ");
    } else {
        refObject.reference = referenceAuthorCitation(source);
        refObject.reference = refObject.reference.concat(" (", source.year, "). ");
    }

    if (source.sourceType == 'book') {
        refObject.reference = refObject.reference.concat("<i>", source.title, "</i>, ");

        if (source.hasOwnProperty('edition')) {
            refObject.reference = refObject.reference.concat("(", source.edition, "ed.). ");
        }

        refObject.reference = refObject.reference.concat(source.cityPublished, ": ");
        refObject.reference = refObject.reference.concat(source.publisher, ".");
    } else if (source.sourceType == 'journalArticle') {
        refObject.reference = refObject.reference.concat(source.title, ". ");
        refObject.reference = refObject.reference.concat("<i>", source.journal, "</i>, ");
        refObject.reference = refObject.reference.concat(source.journalNum);
        refObject.reference = refObject.reference.concat("(", source.issueNum, "), ");
        refObject.reference = refObject.reference.concat(source.pagesUsed, ".");
    } else if (source.sourceType == 'website') {
        refObject.reference = refObject.reference.concat(source.pageTitle);

        if (source.hasOwnProperty('author')) {
            refObject.reference = refObject.reference.concat("<i>", source.siteName, "</i>. ");
        }

        refObject.reference = refObject.reference.concat("Retrieved ", source.date.getDate(), " ", monthNames[source.date.getMonth()], " ", source.date.getFullYear(), ", ");
        refObject.reference = refObject.reference.concat("from ", source.url);
    } else if (source.sourceType == 'newsOrMag') {
        refObject.reference = refObject.reference.concat(monthNames[source.date.getMonth()], " ", source.date.getDate(), "). ");
        refObject.reference = refObject.reference.concat(source.articleTitle, ". ");
        refObject.reference = refObject.reference.concat("<i>", source.paperName, "</i>");

        refObject.reference = source.hasOwnProperty('pagesUsed') ? refObject.reference.concat(", p. ", source.pagesUsed, ".") : source.reference.concat(".");
    }

    return refObject;
}

function chicago(source) {
    var refObject = {
        inText: "",
        reference: ""
    };
    var inTextAuthor = source.authors[0].firstName + " " + source.authors[0].lastName;
    var refAuthor = source.authors[0].lastName + ", " + source.authors[0].firstName;
    var numAuth = source.authors.length;

    if (refObject.sourceType != 'website') {
        if (numAuth < 4) {
            for (var i = 1; i < numAuth - 1; i++) {
                inTextAuthor = inTextAuthor.concat(", ", source.authors[i].firstName, " ", source.authors[i].lastName);
                refAuthor = refAuthor.concat(", ", source.authors[i].firstName, " ", source.authors[i].lastName);
            }

            inTextAuthor = inTextAuthor.concat(" and ", source.authors[numAuth - 1].firstName, " ", source.authors[numAuth - 1].lastName);
        } else {
            for (var i = 1; i < numAuth - 1; i++) {
                refAuthor = refAuthor.concat(", ", source.authors[i].firstName, " ", source.authors[i].lastName);
            }
            inTextAuthor = inTextAuthor.concat(" et al., ");
        }
    }
    refObject.inText = refObject.inText.concat(inTextAuthor);
    refObject.reference = refObject.reference.concat(refAuthor);


    if (source.sourceType == 'book') {
        refObject.inText = refObject.inText.concat("<i>", source.title, "</i> ");
        refObject.inText = refObject.inText.concat("(", source.cityPublished, ": ");
        refObject.inText = refObject.inText.concat(source.publisher, ", ");
        refObject.inText = refObject.inText.concat(source.year, "), ");
        refObject.inText = refObject.inText.concat(source.pagesUsed, ".");

        refObject.reference = refObject.reference.concat("<i>", source.title, "</i>. ");
        refObject.reference = refObject.reference.concat(source.cityPublished, ": ");
        refObject.reference = refObject.reference.concat(source.publisher, ", ");
        refObject.reference = refObject.reference.concat(source.year, ".");
    } else if (source.sourceType == 'journalArticle') {
        refObject.inText = refObject.inText.concat(', "', source.title, '," ');
        refObject.inText = refObject.inText.concat("<i>", source.journal, "</i> ");
        refObject.inText = refObject.inText.concat(source.journalNum, ", ");
        refObject.inText = refObject.inText.concat("no. ", source.issueNum, " (");
        refObject.inText = refObject.inText.concat(source.year, "): ");
        refObject.inText = refObject.inText.concat(source.pagesUsed, ".");

        refObject.reference = refObject.reference.concat(', "', source.title, '," ');
        refObject.reference = refObject.reference.concat("<i>", source.journal, "</i> ");
        refObject.reference = refObject.reference.concat(source.journalNum, ", ");
        refObject.reference = refObject.reference.concat("no. ", source.issueNum, " (");
        refObject.reference = refObject.reference.concat(source.year, "): ");
        refObject.reference = refObject.reference.concat(source.pagesUsed, ".");
    } else if (source.sourceType == 'website') {
        refObject.inText = refObject.inText.concat('"', source.pageTitle, '," ');
        refObject.inText = refObject.inText.concat(source.siteName, ", ");
        refObject.inText = refObject.inText.concat("Date accessed ", source.date.getDate(), " ", monthNames[source.date.getMonth()], ", ", source.date.getFullYear(), ".");

        refObject.reference = refObject.inText;
        refObject.reference = refObject.reference.concat(" ", source.url, ".");
    } else if (source.sourceType == 'newsOrMag') {
        refObject.inText = refObject.inText.concat(', "', source.articleTitle, '," ');
        refObject.inText = refObject.inText.concat("<i>", source.paperName, "</i> (");
        refObject.inText = refObject.inText.concat(source.date.getDate(), " ", monthNames[source.date.getMonth()], "): ");
        refObject.inText = refObject.hasOwnProperty('pagesUsed') ? source.reference.concat(", ", source.pagesUsed, ".") : source.reference.concat(".");

        refObject.reference = refObject.reference.concat(', "', source.articleTitle, '," ');
        refObject.reference = refObject.reference.concat("<i>", source.paperName, "</i> (");
        refObject.reference = refObject.reference.concat(source.date.getDate(), " ", monthNames[source.date.getMonth()], "): ");
        refObject.reference = refObject.hasOwnProperty('pagesUsed') ? source.reference.concat(", ", source.pagesUsed, ".") : source.reference.concat(".");
    }

    return refObject;
}

function harvard(source) {
    var refObject = {
        inText: "",
        reference: ""
    };
    var inTextAuthor = "";
    var numAuth = source.authors.length;

    if (numAuth > 3) {
        inTextAuthor = source.authors[0].lastName + " et. al";
    } else {
        inTextAuthor = inTextAuthorCitation(source);
    }
    refObject.inText = "(" + inTextAuthor + " " + source.year + ")";

    if (source.sourceType == 'website') {
        refObject.reference = source.hasOwnProperty('author') ? referenceAuthorCitation(source) : '';
        refObject.reference = source.hasOwnProperty('year') ? refObject.reference.concat(" ", source.year, ", ") : refObject.reference.concat(" n.d. ");
    } else {
        refObject.reference = referenceAuthorCitation(source);
        refObject.reference = refObject.reference.concat(" ", source.year, ", ");
    }

    if (source.sourceType == 'book') {
        refObject.reference = refObject.reference.concat("<i>", source.title, "</i>, ");

        if (source.hasOwnProperty('edition')) {
            refObject.reference = refObject.reference.concat(source.edition, " edn, ");
        }



        if (source.hasOwnProperty('cityPublished')) {
            refObject.reference = refObject.reference.concat(source.publisher, ", ");
            refObject.reference = refObject.reference.concat(source.cityPublished, ".");
        } else {
            refObject.reference = refObject.reference.concat(source.publisher, ".");
        }

    } else if (source.sourceType == 'journalArticle') {
        refObject.reference = refObject.reference.concat("'", source.title, "', ");
        refObject.reference = refObject.reference.concat("<i>", source.journal, "</i>, ");
        refObject.reference = refObject.reference.concat("vol. ", source.journalNum, ", ");

        if (source.hasOwnProperty('issueNum')) {
            refObject.reference = refObject.reference.concat("no. ", source.issueNum, ", ");
        }

        refObject.reference = refObject.reference.concat("pp. ", source.pagesUsed, ".");
    } else if (source.sourceType == 'website') {
        refObject.reference = refObject.reference.concat("<i>", source.pageTitle, "</i>, ");
        refObject.reference = refObject.reference.concat(source.siteName, ", ");
        refObject.reference = refObject.reference.concat("viewed ", source.date.getDate(), " ", monthNames[source.date.getMonth()], " ", source.date.getFullYear(), ", ");
        refObject.reference = refObject.reference.concat(source.url);
    } else if (source.sourceType == 'newsOrMag') {
        refObject.reference = refObject.reference.concat("'", source.articleTitle, "', ");
        refObject.reference = refObject.reference.concat("<i>", source.paperName, "</i>, ");
        refObject.reference = refObject.reference.concat(source.date.getDate(), " ", monthNames[source.date.getMonth()]);
        refObject.reference = source.hasOwnProperty('pagesUsed') ? refObject.reference.concat(", ", source.pagesUsed, ".") : refObject.reference.concat(".");
    }

    return refObject;
}

function harvardUTS(source) {
    var refObject = {
        inText: "",
        reference: ""
    };
    var inTextAuthor = "";
    var numAuth = source.authors.length;

    if (numAuth > 3) {
        inTextAuthor = source.authors[0].lastName + " et. al";
    } else {
        inTextAuthor = inTextAuthorCitation(source);
    }
    refObject.inText = "(" + inTextAuthor + " " + source.year + ")";

    if (refObject.sourceType == 'website') {
        refObject.reference = source.hasOwnProperty('author') ? referenceAuthorCitation(source) : '';
        refObject.reference = source.hasOwnProperty('year') ? source.reference.concat(" ", source.year, ", ") : source.reference.concat(" n.d. ");
    } else {
        refObject.reference = referenceAuthorCitation(source);
        refObject.reference = refObject.reference.concat(" ", source.year, ", ");
    }

    if (source.sourceType == 'book') {
        refObject.reference = refObject.reference.concat("<i>", source.title, "</i>, ");

        if (source.hasOwnProperty('edition')) {
            refObject.reference = refObject.reference.concat(source.edition, "edn, ");
        }

        refObject.reference = refObject.reference.concat(source.publisher, ", ");
        refObject.reference = refObject.reference.concat(source.cityPublished, ".");
    } else if (source.sourceType == 'journalArticle') {
        refObject.reference = refObject.reference.concat("'", source.title, "', ");
        refObject.reference = refObject.reference.concat("<i>", source.journal, "</i>, ");
        refObject.reference = refObject.reference.concat("vol. ", source.journalNum, ", ");

        if (source.hasOwnProperty('issueNum')) {
            refObject.reference = refObject.reference.concat("no. ", source.issueNum, ", ");
        }

        refObject.reference = refObject.reference.concat("pp. ", source.pagesUsed, ".");
    } else if (source.sourceType == 'website') {
        refObject.reference = refObject.reference.concat("<i>", source.pageTitle, "</i>, ");
        refObject.reference = refObject.reference.concat(source.siteName, ", ");
        refObject.reference = refObject.reference.concat("viewed ", source.date.getDate(), " ", monthNames[source.date.getMonth()], " ", source.date.getFullYear(), ", ");
        refObject.reference = refObject.reference.concat("<", source.url, ">");
    } else if (source.sourceType == 'newsOrMag') {
        refObject.reference = refObject.reference.concat("'", source.articleTitle, "', ");
        refObject.reference = refObject.reference.concat("<i>", source.paperName, "</i>, ");
        refObject.reference = refObject.reference.concat(source.date.getDate(), " ", monthNames[source.date.getMonth()]);
        refObject.reference = source.hasOwnProperty('pagesUsed') ? refObject.reference.concat(", ", source.pagesUsed, ".") : refObject.reference.concat(".");
    }

    return refObject;
}
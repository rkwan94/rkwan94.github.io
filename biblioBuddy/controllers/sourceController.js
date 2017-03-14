app.controller('sourceController', function($scope, $http) {
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

    $scope.source = {
        authors: [{
            count: 1,
            firstName: "",
            lastName: ""
        }]
    };

    $scope.loading = false;

    $scope.numAuthors = function() {
        return $scope.source.authors.length;
    };

    $scope.addAuthor = function() {
        var numAuth = $scope.numAuthors();
        var newAuthor = {
            count: numAuth + 1,
            firstName: "",
            lastName: ""
        };

        $scope.source.authors[numAuth] = newAuthor;
    };

    $scope.removeAuthor = function() {
        if ($scope.source.authors.length > 1) {
            var dummy = $scope.source.authors.pop();
        }
    };

    $scope.generateReferences = function(type) {
        var citations;
        $scope.source.sourceType = type;

        console.log($scope.source);
        var refStyle = $scope.source.refStyle;
        $scope.source.reference = "";
        $scope.source.inText = "";

        if (refStyle == "harvard") {
            citations = harvard($scope.source);
        } else if (refStyle == "uts") {
            citations = harvardUTS($scope.source);
        } else if (refStyle == "apa") {
            citations = apa($scope.source);
        } else if (refStyle == "ama") {
            citations = ama($scope.source);
        } else if (refStyle == "jama") {
            citations = ama($scope.source);
        } else {
            citations = chicago($scope.source);
        }
        console.log(citations);
        $scope.source.reference = citations.reference;
        $scope.source.inText = citations.inText;
    };

    $scope.articleSearch = function() {
        var searchUrl = "";

        searchUrl = searchUrl.concat("http://api.crossref.org/works?query=",
            encodeURIComponent($scope.source.searchQuery));


        $http({ method: 'GET', url: searchUrl }).
        success(function(data, status) {
            console.log($scope.source);
            console.log(data.message.items[0]);

            var record = data.message.items[0];
            $scope.source.title = record.title[0];
            var authors = [];

            for (var i = 0; i < record.author.length; i++) {
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
            $scope.source.issueNum = record.issue;
            $scope.source.pagesUsed = record.page;
            $scope.generateReferences("journalArticle");
        }).
        error(function(data, status) {
            console.log(data || "Request failed");
        });

    };

    $scope.bookSearch = function() {
        var searchUrl = "".concat("https://openlibrary.org/search.json?q=",
            encodeURIComponent($scope.source.searchQuery));

        $http({ method: 'GET', url: searchUrl }).
        success(function(data, status) {
            var record = data.docs[0];
            $scope.source.title = record.title;
            var authors = [];

            for (var i = 0; i < record.author_name.length; i++) {
                var names = record.author_name[i].split(' ');
                var a = {};
                a.count = i + 1;
                a.lastName = names[names.length - 1];
                a.firstName = names[0];

                authors.push(a);
            }

            if (record.edition_count % 10 == 1) {
                $scope.source.edition = "1st";
            } else if (record.edition_count % 10 == 2) {
                $scope.source.edition = "2nd";
            } else if (record.edition_count % 10 == 3) {
                $scope.source.edition = "3rd";
            } else {
                $scope.source.edition = record.edition_count + "th";
            }

            $scope.source.authors = authors;
            $scope.source.sourceType = "book";
            $scope.source.year = record.publish_year[0];
            $scope.source.publisher = record.publisher[0];

            $scope.generateReferences("book");
        }).
        error(function(data, status) {
            console.log(data || "Request failed");
        });
    };

    $scope.ajaxAction = function(resource) {
        $scope.loading = true;

        if (resource == "journalArticle") {
            $scope.articleSearch();
        } else {
            $scope.bookSearch();
        }
        $scope.loading = false;
    };

    $scope.resetAuthors = function() {
        $scope.source.authors = [{
            count: 1,
            firstName: "",
            lastName: ""
        }];
    };
});

app.filter('trustedhtml', ['$sce', function($sce) {
    return $sce.trustAsHtml;
}]);
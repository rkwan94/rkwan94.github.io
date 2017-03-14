app.controller('sourceController', function() {
    this.source = {};
    this.generateReferences = function() {
        console.log(this.book);
        var refType = this.book.refType;
        var numAuthors = this.book.authors.length;
        if (refType === "harvard") {
            var inTextAuthor = "";
            if (numAuthors > 3) {
                inTextAuthor = this.book.authors[0].lastName + "et. al";
            } else if (numAuthors == 3) {
                inTextAuthor = this.book.authors[0].lastName + ", " + this.book.authors[1].lastName + " & " + this.book.authors[2].lastName;
            } else if (numAuthors == 3) {
                inTextAuthor = this.book.authors[0].lastName + " & " + this.book.authors[1].lastName;
            } else {
                inTextAuthor = this.book.authors[0].lastName;
            }
            this.book.inText = "(" + inTextAuthor + " " + this.book.year + ")";
        }


    }
})
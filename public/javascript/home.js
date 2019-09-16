function scrape() {
    $.getJSON("/scrape", function (req) {
        if (req.code == "success") {
            $.getJSON("/articles", function (data) {
                $("#ccn-0").empty();
                $("#ccn-1").empty();
                // $("#ccn-2").empty();
                $("#total-number").text(data.length);

                for (var i = 0; i < data.length; i++) {

                    var articleDiv = $("<div>");
                    articleDiv.addClass("card grey lighten-2");

                    var contentDiv = $("<div>");
                    contentDiv.addClass("card-content black-text");

                    var titleDiv = $("<div>");
                    titleDiv.addClass("card-title");
                    titleDiv.attr("data-id", data[i]._id);
                    titleDiv.attr("id", "title-" + data[i]._id);
                    titleDiv.text(data[i].title);

                    var p = $("<p>");
                    p.text(data[i].summary);
                    p.attr("id", "summary-" + data[i]._id);
                    contentDiv.append(titleDiv);
                    contentDiv.append(p);

                    var cardActionDiv = $("<div>");
                    cardActionDiv.addClass("card-action");

                    var linkRef = $("<a>");
                    // linkRef.addClass("btn btn-outline-primary active");
                    linkRef.attr("href", data[i].link);
                    linkRef.attr("id", "link-" + data[i]._id);
                    linkRef.html("<i class='fas fa-link'></i>");
                    cardActionDiv.append(linkRef);

                    var saveArticle = $("<button>");
                    saveArticle.addClass("btn btn-outline-primary active save-button");
                    saveArticle.attr("id", data[i]._id);
                    saveArticle.attr("type", "button");
                    saveArticle.attr("data-toggle", "button");
                    saveArticle.attr("aria-pressed", "false");
                    saveArticle.attr("autocomplete", "off");
                    saveArticle.html("<i class='fas fa-save'></i>");
                    // saveArticle.text("Save");
                    cardActionDiv.append(saveArticle);

                    articleDiv.append(contentDiv);
                    articleDiv.append(cardActionDiv);
                    $("#ccn-" + String(i % 2)).append(articleDiv);
                }
            });
        }
   });
}

$(document).ready(function () {
    $('.modal').modal();
});
function scrape() {
    $.getJSON("/scrape", function (req) {
        if (req.code == "success") {
            $.getJSON("/articles", function (data) {
                $("#ccn-0").empty();
                $("#ccn-1").empty();
                $("#ccn-2").empty();
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

                    var a = $("<a>");
                    a.attr("href", data[i].link);
                    a.attr("id", "link-" + data[i]._id);
                    a.html("<i class='fas fa-link'></i>");
                    cardActionDiv.append(a);

                    var saveArticle = $("<button>");
                    saveArticle.addClass("btn btn-primary active save-button");
                    saveArticle.attr("id", data[i]._id);
                    saveArticle.attr("type", "button");
                    saveArticle.attr("data-toggle", "button");
                    saveArticle.attr("aria-pressed", "false");
                    saveArticle.attr("autocomplete", "off");
                    saveArticle.text("Save Article");
                    cardActionDiv.append(saveArticle);

                    articleDiv.append(contentDiv);
                    articleDiv.append(cardActionDiv);
                    $("#ccn-" + String(i % 3)).append(articleDiv);
                }
            });
        }
   });
}

$(document).ready(function () {
    $('.modal').modal();
});
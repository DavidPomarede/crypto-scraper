
function displaySaved() {
    $.getJSON("/saved/all", function (data) {

        $("#ccn-0").empty();
        $("#ccn-1").empty();
        $("#ccn-2").empty();

        $("#total-number").text(data.length);

        for (var i = 0; i < data.length; i++) {

            var articleDiv = $("<div>");
            articleDiv.addClass("card yellow lighten-5");
            articleDiv.attr("id", "main-" + data[i]._id);

            var contentDiv = $("<div>");
            contentDiv.addClass("card-content blue-text");

            var titleDiv = $("<div>");
            titleDiv.addClass("card-title");
            titleDiv.attr("data-id", data[i]._id);
            titleDiv.attr("id", "title-" + data[i]._id);
            titleDiv.text(data[i].title);
            contentDiv.append(titleDiv);

            var summaryDiv = $("<p>");
            summaryDiv.attr("id", "summary-" + data[i]._id);
            summaryDiv.text(data[i].summary);
            contentDiv.append(summaryDiv);

            var cardAction = $("<div>");
            cardAction.addClass("card-action");

            var link = $("<a>");
            link.attr("href", data[i].link);
            link.attr("id", "link-" + data[i]._id);
            link.html("<i class='fas fa-link'></i>");
            cardAction.append(link);

            var notesButton = $("<a>");
            notesButton.addClass(" btn create-note modal-trigger");
            notesButton.attr("data-id", data[i]._id);
            notesButton.attr("data-target", "notes");
            notesButton.text("Notes");

            var deleteArticle = $("<a>");
            deleteArticle.addClass(" btn delete-button");
            deleteArticle.attr("id", data[i]._id);
            deleteArticle.text("Delete");

            cardAction.append(notesButton);
            cardAction.append(deleteArticle);
            articleDiv.append(contentDiv);
            articleDiv.append(cardAction);

            $("#ccn-" + String(i % 3)).append(articleDiv);
        }
    });
}

function deletenote(thisId) {
    var data = {
        "_id": thisId
    };
    console.log(data);
    $.ajax({
        type: "DELETE",
        url: "/deletenote",
        data: data,
        success: function (data, textStatus) {
            $("#" + thisId).remove();
        }
    })
}

$(document).ready(function () {
    // $('.slider').slider();
    // $(".button-collapse").sideNav();
    $('.modal').modal();

    // When click on savearticle button
    $(document).on('click', '.save-button', function () {
        var thisId = $(this).attr("id");
        var summary = $("#summary-" + thisId).text();
        var title = $("#title-" + thisId).text();
        var link = $("#link-" + thisId).attr('href');
        var data = {
            "id": thisId,
            "summary": summary,
            "title": title,
            "link": link,
        };
        $.ajax({
            type: "POST",
            url: "/save",
            data: data,
            dataType: "json",
            success: function (data, textStatus) {
                console.log(data);
            }
        });
    });
    // When click on delete article button
    $(document).on('click', '.delete-button', function () {
        var thisId = $(this).attr("id");
        var data = {
            "_id": thisId
        };
        $.ajax({
            type: "DELETE",
            url: "/delete",
            data: data,
            success: function (data, textStatus) {
                $("#main-" + thisId).remove();
            }
        })
    });

    // create note
    $(document).on("click", ".create-note", function (data) {
        $("#savenote").attr("data-id", $(this).attr("data-id"));
        let aid = $(this).attr("data-id");
        let title = "Notes for the Article: " + aid;
        $("#display-title").empty();
        $("#display-title").text(title);
        $("#textarea1").val("");
        $.getJSON("/notes/" + aid, function (data) {
            if(data.length) {
                console.log(data);
                let notetext = "Notes: " + data[0].body;
                $("#display-note").empty();
                let noteList = $("<ul>");
                noteList.addClass("collection with-header");
                let hli = $("<li>");
                hli.addClass("collection-header")
                hli.text("Notes");
                noteList.append(hli);
            
                for (let i = 0; i < data.length; i++) {
                    let ili = $("<li>");
                    ili.attr("id", data[i]._id);
                    ili.addClass("collection-item");

                    let idiv = $("<div>");
                    idiv.text(data[i].body);

                    let adelete = $("<a>");
                    adelete.addClass("secondary-content");
                    adelete.html("<i class='far fa-trash-alt'></i>");
                    adelete.attr("note-id", data[i]._id);
                    adelete.attr("href", "#");
                    adelete.attr("onclick", 'deletenote("' + data[i]._id + '")');
                    let xdelete = $("<i>");
                    // xdelete.addClass("material-icons");
                    xdelete.attr("note-id", data[i]._id);
                    // xdelete.html("delete");
                    adelete.append(xdelete);
                    idiv.append(adelete);
                    ili.append(idiv);
                    noteList.append(ili);
                }
                $("#display-note").append(noteList);
            } else {
                $("#display-note").empty();
            }
        });
    });


    $(document).on("click", "#savenote", function () {

        var thisId = $(this).attr("data-id");
        var text = $("#textarea1").val();
        console.log(thisId);

        $.ajax({
            type: "POST",
            url: "/notes",
            data: {
                "article_id": thisId,
                "body": text
            },
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $("#textarea1").val("");
            }
        });
    });

    $(document).on("click", "#deletenote", function () {

        $.ajax({
            type: "DELETE",
            url: "/deletenote",
            data: data,
            success: function (data, textStatus) {
                $("#display-note").remove();
            }
        });
    });
});

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
            articleDiv.append(contentDiv);

            var titleDiv = $("<div>");
            titleDiv.addClass("card-title");
            titleDiv.attr("data-id", data[i]._id);
            titleDiv.attr("id", "title-" + data[i]._id);
            titleDiv.text(data[i].title);
            contentDiv.append(titleDiv);


            var summaryDiv = $("<div>");
            summaryDiv.attr("id", "summary-" + data[i]._id);
            summaryDiv.text(data[i].summary);
            contentDiv.append(summaryDiv);

            var cardAction = $("<div>");
            cardAction.addClass("card-action");
            articleDiv.append(cardAction);

            var link = $("<a>");
            link.attr("href", data[i].link);
            link.attr("id", "link-" + data[i]._id);
            link.html("<i class='fas fa-link'></i>");
            cardAction.append(link);

            var notesButton = $("<a>");
            notesButton.addClass(" btn create-note btn-outline-primary modal-trigger ");
            notesButton.attr("data-id", data[i]._id);
            notesButton.attr("data-target", "notes");
            notesButton.text("Notes");
            // notesButton.html("<i class='fa fa-pencil'></i>");
            cardAction.append(notesButton);

            var deleteArticle = $("<a>");
            deleteArticle.addClass(" btn btn-outline-primary delete-button");
            deleteArticle.attr("id", data[i]._id);
            // deleteArticle.text("Delete");
            deleteArticle.html("<i class='fas fa-ban'></i>");
            cardAction.append(deleteArticle);

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

    $('.modal').modal();

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


//     // When you click the savenote button
// $(document).on("click", ".create-note", function() {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");
  
//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//       method: "GET",
//       url: "/notes/" + thisId,
//       data: {
//         // Value taken from title input
//         title: $("#titleinput").val(),
//         // Value taken from note textarea
//         body: $("#bodyinput").val()
//       }
//     })
//       // With that done
//       .then(function(data) {
//         // Log the response
//         console.log(data);
//         // Empty the notes section
//         $("#notes").empty();
//       });
  
//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
//   });

    $(document).on("click", ".create-note", function (data) {
        $("#savenote").attr("data-id", $(this).attr("data-id"));
        var thisId = $(this).attr("data-id");
        var noteTitle = "Notes:";
        $("#display-title").empty();
        $("#display-title").text(noteTitle);
        $("#textarea1").val("");
        $.getJSON("/notes/" + thisId, function (data) {
            if(data.length) {

                $("#display-note").empty();
                var noteList = $("<ul>");
                noteList.addClass("collection with-header");
                var listStructure = $("<li>");
                listStructure.addClass("collection-header");
                listStructure.text("Notes");
                noteList.append(listStructure);
            
                for (var i = 0; i < data.length; i++) {
                    var listId = $("<li>");
                    listId.attr("id", data[i]._id);
                    listId.addClass("collection-item");

                    var noteDiv = $("<div>");
                    noteDiv.text(data[i].body);

                    var delNote = $("<a>");
                    delNote.addClass("secondary-content");
                    delNote.html("<i class='far fa-trash-alt'></i>");
                    delNote.attr("note-id", data[i]._id);
                    delNote.attr("href", "#");
                    delNote.attr("onclick", 'deletenote("' + data[i]._id + '")');
                    var deleteId = $("<i>");
                    deleteId.attr("note-id", data[i]._id);

                    delNote.append(deleteId);
                    noteDiv.append(delNote);
                    listId.append(noteDiv);
                    noteList.append(listId);
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
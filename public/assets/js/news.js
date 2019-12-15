// Whenever someone clicks a news div
  $(document).on("click", ".newsStory", function() {
    // Empty the comments from the note section
    $("#comments").empty();
    // Save the id from the news div
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        // The title of the article
        $("#comments").append("<h3>" + data.headline + "</h3>");
        // An input to enter a new title
        $("#comments").append("<p>Name: </p><input id='titleinput' name='name' >");
        // A textarea to add a new note body
        $("#comments").append("<p>Comment: </p><textarea id='bodyinput' name='comment'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");
        // If there's a comment in the article
        if (data.comment) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.comment.name);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.comment.comment);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#saveComment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/" + thisId,
      data: {
        // Value taken from title input
        name: $("#titleinput").val(),
        // Value taken from note textarea
        comment: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log("Comment title: " + data.name);
        console.log("Comment body: " + data.comment);
        // Empty the comments section
        //$("#comments").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");

  });
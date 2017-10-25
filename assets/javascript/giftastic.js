var topics = ["breaking up", "cooking", "crying", "dancing", "dreaming", "drinking", "eating", "fainting", "falling", "fighting", "finger guns", "flirting", "laughing", "pout", "running", "singing", "slapping", "sleeping"];
var apiKey = "dc6zaTOxFJmzC";
const numberOfGifResults = 10;

// Add the on-click event listeners
// --------------------------------

// Attach an on-click event listener to the topic buttons
// Use $(document).on instead of $(".topicButtons").on to add event listeners to the dynamically generated HTML elements
$(document).on("click", ".topicButtons", showImages);

// Attach an on-click event listener to the images
// Use $(document).on instead of $(".topicImages").on to add event listeners to the dynamically generated HTML elements
$(document).on("click", ".topicImages", toggleImage);

// Attach an on-click event listener to the submit button
$("#submitButton").on("click", function(event) {

  event.preventDefault();

  // Store the input from the textbox
	var textboxInput = $("#topicInput").val().trim();

	// When nothing is entered in the textbox don't add the button
	if (textboxInput != "") {
		addButton(textboxInput);
		showButtons();
	}
})

// Show the initial topic buttons
showButtons();

// Runs when a new topic is entered. Adds the button to the web page.
function addButton(buttonText) {

// Clear the contents in the textbox
$("#topicInput").val("");

// Add the input from the textbox to the topics array
topics.push(buttonText);
}

// Runs when a topic button is clicked
function showImages() {

	// Store which topic button was clicked
	var buttonClicked = $(this).attr("data-button-name");

	// Create the query URL to be used in the AJAX call to the giphy API
	queryURL = "https://api.giphy.com/v1/gifs/search" + "?api_key=" + apiKey + "&q=" + buttonClicked + "&limit=" + numberOfGifResults;

	// Make the AJAX call to the giphy API
	$.ajax({
	  url: queryURL,
	  method: "GET"
	}).done(function(response) {

		// Show the still images returned from the AJAX call
		showGifs(response);
	})
}

// Runs when the page is loaded or a topic button is added
function showButtons() {

  // Delete the existing topic buttons on the web page (contained in the ID "displayButtons") before adding new topic buttons
  // Otherwise, there will be duplicate/repeating buttons on the web page
  $("#displayButtons").empty();

	var addButton;

	// Dynamically create buttons for each topic and display them on the web page
	for (i = 0; i < topics.length; i++) {
	  addButton = $("<button>");											// Create and store a button tag
	  addButton.addClass("topicButtons");							// Add a class to the button for CSS styling
	  addButton.attr("data-button-name", topics[i]);	// Add a data-button-name attribute equal to the topic
	  addButton.text(topics[i]);											// Add the topic text to the button

	  $("#displayButtons").append(addButton);					// Add and display the dynamically created button
	}
}

// Runs after the AJAX call, which is triggered when a topic button is clicked
function showGifs(giphyResults) {

  // Delete the existing topic images on the web page (contained in the ID "displayImages) before adding new topic images
  // Otherwise, there will be duplicate/repeating images on the web page
  $("#displayImages").empty();

var addDiv;
var addImage;
var addRating;

  // Create and show the still images
	for (i = 0; i < numberOfGifResults; i++) {

		// Don't show R rated Images
		if (giphyResults.data[i].rating != "r") {

			// Create and store a div tag
			addDiv = $("<div>");
			addDiv.addClass("topicImages");

			// Create and store an image tag
			addImage = $("<img>"); 
		 	addImage.addClass("topicImages");
			addImage.attr("src", giphyResults.data[i].images.original_still.url); 
			addImage.attr("data-still-image", giphyResults.data[i].images.original_still.url);
		 	addImage.attr("data-animated-image", giphyResults.data[i].images.original.url);
		 	addImage.attr("data-image-state", "still");

			// Creat and store a heading tag to show the image's rating
			addRating = $("<h3>").text("Rated: " + giphyResults.data[i].rating.toUpperCase());
			addRating.addClass("topicRatings");	// Add a class for CSS styling

			// Append the paragraph and image tags to the Div
			addDiv.append(addImage);
			addDiv.append(addRating);

			// Display the dynamically created div
			$("#displayImages").append(addDiv);
		}
	}
}

//
function toggleImage() {

	// Save the state of the image ("still" or "animated") that was clicked
	var state = $(this).attr("data-image-state");

	// When the image's state attribute is still, change to image's source attribute to the animated image URL. Toggle the image's state to animate.
	// When the image's state attribute is animate, change the image's source attribute to the still image URL. Toggle the image's state to still. 
	if (state === "still") {
	  $(this).attr("src", $(this).attr("data-animated-image"));
	  $(this).attr("data-image-state", "animated");
	} else {
	  $(this).attr("src", $(this).attr("data-still-image"));
	  $(this).attr("data-image-state", "still");
	}
}

"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    login = require("./user");

// Using the REST API
function loadSongsToDOM() {
  console.log("Need to load some songs, Buddy");
}
loadSongsToDOM();

// Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {

});

// Load and populate form for editing a song
$(document).on("click", ".edit-btn", function () {

});

//Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {

});

// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {

});


// *******************************************************
// Using the Firebase SDK and its auto update.
// Calling "getSongs" now sets up a listener when loading the DOM.
// Pass it a callback that handles the incoming data and it will re-call that
// function when anything changes in our data

// Use before adding Oauth, then move to Oauth callback
// db.getSongs(templates.makeSongList);

// No need to reload the DOM in the ".then"
// $(document).on("click", ".save_new_btn", function() {

// });

// // Load and populate form for editing a song
// $(document).on("click", ".edit-btn", function () {

// });

// //Save edited song to FB then reload DOM with updated song data
// $(document).on("click", ".save_edit_btn", function() {

// });

// // Remove song then reload the DOM w/out new song
// $(document).on("click", ".delete-btn", function () {

// });

// User login section. Should ideally be in its own module
// $("#auth-btn").click(function() {
//   console.log("clicked auth");

// });

// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    let songObj = {
    title: $("#form--title").val(),
    artist: $("#form--artist").val(),
    album: $("#form--album").val(),
    year: $("#form--year").val()
  };
  return songObj;
}

// Load the new song form
$("#add-song").click(function() {
  console.log("clicked add song");
  var songForm = templates.songForm()
  .then(function(songForm) {
    $(".uiContainer--wrapper").html(songForm);
  });
});

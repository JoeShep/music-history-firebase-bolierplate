"use strict";

let $ = require('jquery'),
  db = require("./db-interaction"),
  templates = require("./dom-builder"),
  login = require("./user"),
  currentUser = require('./currentUser');


// Using the REST API
// function loadSongsToDOM() {
//   $('.uiContainer--wrapper').html('');
//   db.getSongs()
//     .then(function(songData) {
//       templates.makeSongList(songData.songs);
//     });
// }
// loadSongsToDOM();

// // Send newSong data to db then reload DOM with updated song data
// $(document).on("click", ".save_new_btn", function() {
//   let songObj = buildSongObj();
//   db.addSong(songObj)
//     .then(function(songId) {
//       loadSongsToDOM();
//     });
// });

// // Load and populate form for editing a song
// $(document).on("click", ".edit-btn", function() {
//   let songId = $(this).data('edit-id');
//   db.getSong(songId)
//     .then(function(songData) {
//       return templates.songForm(songData, songId);
//     })
//     .then(function(finishedForm) {
//       $('.uiContainer--wrapper').html(finishedForm);
//     });
// });

// //Save edited song to FB then reload DOM with updated song data
// $(document).on("click", ".save_edit_btn", function() {
//   let songId = $(this).attr('id');
//   let songObj = buildSongObj();
//   db.editSong(songObj, songId)
//     .then(function(songData) {
//       loadSongsToDOM();
//     });
// });

// // Remove song then reload the DOM w/out new song
// $(document).on("click", ".delete-btn", function() {
//   let songId = $(this).data('delete-id');
//   db.deleteSong(songId)
//     .then(function() {
//       loadSongsToDOM();
//     });
// });


// *******************************************************
// Using the Firebase SDK and its auto update.
// Calling "getSongs" now sets up a listener when loading the DOM.
// Pass it a callback that handles the incoming data and it will re-call that
// function when anything changes in our data

// Use before adding Oauth, then move to Oauth callback
// db.getSongs(templates.makeSongList);

// No need to reload the DOM in the ".then"
$(document).on("click", ".save_new_btn", function() {
  let songObj = buildSongObj();
  db.addSong(songObj)
    .then(function(songData) {});
});

// // Load and populate form for editing a song
$(document).on("click", ".edit-btn", function() {
  let songId = $(this).data('edit-id');
  db.getSong(songId)
    .then(function(songData) {
      console.log("", songData);
      let newSong = songData.val();
      return templates.songForm(newSong, songId)
        .then(function(finishedForm) {
          $('.uiContainer--wrapper').html(finishedForm);
        });
    });
});

// //Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  let songObj = buildSongObj();
  let songId = $(this).attr('id');
  db.editSong(songObj, songId);
});

// // Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function() {
  let songId = $(this).data('delete-id');
  db.deleteSong(songId);
});

$(document).on("click", ".fav-btn", function() {
  let songId = $(this).data('fav-id');
  db.getSong(songId)
    .then(function(songData) {
      let songObj = songData.val();
      songObj.favorite = true;
      db.editFavorites(songObj, songId);
    });
});

$(document).on("click", ".unfav-btn", function() {
  let songId = $(this).data('unfav-id');
  db.getSong(songId)
    .then(function(songData) {
      let songObj = songData.val();
      songObj.favorite = false;
      db.editFavorites(songObj, songId);
    });
});


// User login section. Should ideally be in its own module
$("#auth-btn").click(function() {
  let user;
  login()
    .then(function(result) {
      user = result.user;
      currentUser.setUser();
      db.getSongs(templates.makeSongList);
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
});

// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
  let user = currentUser.getUser();
  let songObj = {
    title: $("#form--title").val(),
    artist: $("#form--artist").val(),
    album: $("#form--album").val(),
    year: $("#form--year").val(),
    uid: user,
    favorite: false
  };
  return songObj;
}

// Load the new song form
$("#add-song").click(function() {
  var songForm = templates.songForm()
    .then(function(songForm) {
      $(".uiContainer--wrapper").html(songForm);
    });
});

$("#favorites").click(function() {
  db.viewFavorites()
    .then(function(songData) {
      templates.makeSongList(songData.val());
    });
});

$("#profile").click(function() {
  db.profileSongs()
    .then(function(songData) {
      templates.makeSongList(songData.val());
    });
});

$("#view-music").click(function() {
  db.viewMusic()
    .then(function(songData) {
      templates.makeSongList(songData.val());
    });
});
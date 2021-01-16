"use strict";

var require = "./config.js";
var configFile = require.require;

/* Constants */

const RAPIDAPIKEY = config.RAPID_API_KEY;
const YOUTUBEKEY = config.YOUTUBE_KEY;

const STATE = {
  userInput: "",
};

const goHome = () => {
  document.getElementById("landing").scrollIntoView();
}

const goSearch = () => {
  document.getElementById("search").scrollIntoView();
};

/* Error Function */

function failure(e) {
  console.log(e);
  console.log("💩 Something went wrong. Try again later.");
}

/* Fetch Functions */

function getDefinition(input) {
  $(".loading").removeClass("hidden");
  fetch(`https://wordsapiv1.p.rapidapi.com/words/${input}/definitions`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPIKEY,
    },
  })
    .then((responseDefinition) => responseDefinition.json())
    .then((responseJson) => displayDefinition(responseJson))
    .then($("#results").removeClass("hidden"))
    .catch(failure);
}

function getImage(input) {
  fetch(
    `https://bing-image-search1.p.rapidapi.com/images/search?count=100&q=${input}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "bing-image-search1.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPIKEY,
      },
    }
  )
    .then((responseImage) => responseImage.json())
    .then((responseJsonImage) => displayImage(responseJsonImage))
    .catch(failure);
}

function getVideo(input) {
  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${input}&key=` +
      YOUTUBEKEY
  )
    .then((responseVideo) => responseVideo.json())
    .then((responseJsonVideo) => displayVideo(responseJsonVideo))
    .catch(failure);
}

/* Display Functions */

function displayDefinition(responseJson) {
  $(".loading").addClass("hidden");
  $("#definition").removeClass("hidden");
  if (responseJson.success === false || responseJson.definitions.length === 0) {
    $("#definition").html("");
    $("#definition").append(
      `<p>Sorry, we can't find that word...<br>If this is a slang word, you could try <a href='https://www.urbandictionary.com/define.php?term=${STATE.userInput}' target='_blank'>Urban Dictionary</a> or <a href='https://www.google.com/search?q=${STATE.userInput}' target='_blank'>Google</a>.</p>`
    );
  } else {
    $("#definition").html("");
    $("#definition").html(`<h3>${responseJson.word.toUpperCase()}</h3><br>`);
    $("#another-search").removeClass("hidden");
    for (let i = 0; i <= 3; i++) {
      $("#definition").append(
        `<p><span class="bold">${responseJson.word} (${responseJson.definitions[i].partOfSpeech}):</span> ${responseJson.definitions[i].definition}</p><br>`
      );
    }
  }
}

function displayImage(responseJsonImage) {
  document.getElementById("results").scrollIntoView();
  $("#query").val('');
  const imgNumber = responseJsonImage.value.length;
  let randomImage = Math.floor(Math.random() * imgNumber);
  $("#image").removeClass("hidden");
  if (responseJsonImage.value != 0) {
    $("#image").html("");
    $("#image").append(
      `<img src="${responseJsonImage.value[randomImage].contentUrl}" id="picture" alt="${responseJsonImage.queryContext.originalQuery}">`
    );
  }
}

function displayVideo(responseJsonVideo) {
  if (!responseJsonVideo.items) {
    return;
  }
  const videoNumber = responseJsonVideo.items.length;
  let randomVideo = Math.floor(Math.random() * videoNumber);
  $("#video").removeClass("hidden");
  if (responseJsonVideo.error != true) {
    $("#video").html("");
    $("#video").append(
      `<iframe src="https://www.youtube.com/embed/${responseJsonVideo.items[randomVideo].id.videoId}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <br>
      <p>Want more videos? Click <a href='https://www.youtube.com/results?search_query=${STATE.userInput}' target='_blank'>here</a>!</p>
      <br>`
    );
  }
}

/* Listeners */

function watchForm() {
  $(".word").submit((event) => {
    event.preventDefault();
    const word = $("#query").val();
    let userInput = $.trim(word);
    STATE.userInput = userInput;
    getDefinition(userInput);
    getImage(userInput);
    getVideo(userInput);
  });
}

$(function () {
  watchForm();
});

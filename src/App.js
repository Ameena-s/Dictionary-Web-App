import { React, useState } from "react";
import Axios from "axios";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import { FcSpeaker } from "react-icons/fc";

function App() {
  // Setting up the initial states using react hook 'useState'

  const [data, setData] = useState("");
  const [searchWord, setSearchWord] = useState("");

  // Function to fetch information on button
  // click, and set the data accordingly
  function getMeaning() {
    Axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`
    )
      .then((response) => {
        setData(response.data[0]);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          alert(`The word "${searchWord}" could not be found.`);
        } else {
          alert("There was an error fetching the word data.");
        }
        console.error("Error fetching data:", error);
      });
  }

  // Function to play and listen the
  // phonetics of the searched word
  function playAudio() {
    if (
      data &&
      data.phonetics &&
      data.phonetics[0] &&
      data.phonetics[0].audio
    ) {
      let audioUrl = data.phonetics[0].audio;
      console.log("Playing audio from URL:", audioUrl); // Log the audio URL for debugging

      let audio = new Audio(audioUrl);

      audio.onerror = function () {
        console.error("Error loading audio:", audioUrl);
        alert(
          "Failed to load audio. The format may not be supported or the file might be missing."
        );
      };

      audio
        .play()
        .then(() => {
          console.log("Audio played successfully");
        })
        .catch((err) => {
          console.error("Failed to play audio:", err);
          alert("Failed to play audio. Please check if the file is valid.");
        });
    } else {
      console.warn("Audio not available for this word.");
      alert("Audio not available for this word.");
    }
  }
  return (
    <div className="App">
      <h1>English Dictionary</h1>
      <div className="searchBox">
        {/* // Taking user input */}
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
        />
        <button
          onClick={() => {
            getMeaning();
          }}
        >
          <FaSearch size="20px" />
        </button>
      </div>
      {data && (
        <div className="showResults">
          <h2>
            {data.word}{" "}
            <button
              onClick={() => {
                playAudio();
              }}
            >
              <FcSpeaker size="26px" />
            </button>
          </h2>
          <h4>Parts of speech:</h4>

          <p>{data.meanings[0].partOfSpeech}</p>

          <h4>Definition:</h4>

          <p>{data.meanings[0].definitions[0].definition}</p>

          <h4>Example:</h4>

          <p>{data.meanings[0].definitions[0].example}</p>
        </div>
      )}
    </div>
  );
}

export default App;

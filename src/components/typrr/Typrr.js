import "./Typrr.css"
import axios from "axios";
import React, {useEffect, useState} from "react";

export default function TextField() {

  //todo fix update score on mistake

  const [test, setTest] = useState({
    hasStarted: false,
    completed: false,
    seconds: 60000,
    startTime: 0,
    finishTime: 0,
    api: 0,
  })

  const [text, setText] = useState({
    original: "",
    words: [],
    onScreenGhost: [],
    onScreenUser: [],
    classArray: [],
    idx: {
      wordIdx: 0,
      sentenceIdx: 0,
    },
  })

  const [score, setScore] = useState({
    keyStrokes: {
      total: 0,
      mistake: 0,
      corrected: 0,
    },
    xrp: 0,
    wpm: 0,
    acc: 0,
  })

  useEffect(() => {

    if (test.api === 0 && text.original === "") {
      fetchTechyText()

    } else if (test.api === 1 && text.original === "") {
      fetchWhatTheCommitText()

    }
  }, []);

  async function fetchTechyText() {
    try {

      const response = await axios.get("https://techy-api.vercel.app/api/json")
      let sentence = response.data.message

      const regex = /[^a-zA-Z ]/g;
      sentence = sentence.replace(regex, "")
      sentence = sentence + "."

      setText({
        ...text,
        original: sentence,
        words: sentence.split(" "),
        onScreenGhost: sentence.split(""),
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchWhatTheCommitText() {
    try {

      const response = await axios.get("https://whatthecommit.com/index.txt")
      let sentence = response.data

      const regex = /[^a-zA-Z ]/g;
      sentence = sentence.replace(regex, "")

      setText({
        ...text,
        original: sentence,
        words: sentence.split(" "),
        onScreenGhost: sentence.split(""),
      })
    } catch (error) {
      console.error(error)
    }
  }

  function updateScore(bool) {
    if (bool) {

      //update keystroke total
      setScore({
        ...score,
        keyStrokes: {
          total: score.keyStrokes.total += 1,
          corrected: score.keyStrokes.corrected,
          mistake: score.keyStrokes.mistake,
        },
      })
    } else {

      //update keystroke total
      setScore({
        ...score,
        keyStrokes: {
          total: score.keyStrokes.total += 1,
          corrected: score.keyStrokes.corrected,
          mistake: score.keyStrokes.mistake += 1,
        },
      })
    }
  }

  function onCorrect() {

    //remove first letter from ghost on-screen
    let ghost = text.onScreenGhost
    let char = ghost.shift()

    //insert that letter in user on-screen
    let user = text.onScreenUser
    user.push(char)

    //add correct class to char class
    let charClass = text.classArray
    charClass.push("correct")

    setText({
      ...text,
      onScreenGhost: ghost,
      onScreenUser: user,
      classArray: charClass,
    })
  }

  function onIncorrect(char) {

    //insert that letter in user on-screen
    let user = text.onScreenUser
    user.push(char)

    //add incorrect class to char array
    let charClass = text.classArray
    charClass.push("incorrect")

    setText({
      ...text,
      onScreenUser: user,
      classArray: charClass,
    })
  }

  function onBackspace() {
    if (text.classArray[text.classArray.length - 1] === "correct") {

      //remove last char from on-screen user
      let user = text.onScreenUser
      let lastChar = user.pop()

      //add that char to onscreen ghost
      let ghost = text.onScreenGhost
      ghost.unshift(lastChar)

      //remove last index from class array
      let arr = text.classArray
      arr.pop()

      setText({
        ...text,
        classArray: arr,
        onScreenUser: user,
        onScreenGhost: ghost,
      })

    } else {

      //remove last char from on-screen user
      let user = text.onScreenUser
      user.pop()

      //remove last index from class array
      let arr = text.classArray
      arr.pop()

      setText({
        ...text,
        classArray: arr,
        onScreenUser: user,
      })
    }
  }

  function handleUserInput(e) {


    // Handles user input based on the key pressed

    // Disabled keys: F-keys, arrows, pageup pagedown, home end.
    if (e.keyCode === 112 || e.keyCode === 113 || e.keyCode === 114 || e.keyCode === 115
      || e.keyCode === 116 || e.keyCode === 117 || e.keyCode === 118 || e.keyCode === 119
      || e.keyCode === 120 || e.keyCode === 121 || e.keyCode === 122 || e.keyCode === 123
      || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40
      || e.keyCode === 33 || e.keyCode === 34 || e.keyCode === 46 || e.keyCode === 35
      || e.keyCode === 36 || e.altKey || e.keyCode === 18 || e.keyCode === 20 || e.keyCode === 222
      || e.keyCode === 16 || e.keyCode === 9 || e.keyCode === 173 || e.keyCode === 174 || e.keyCode === 175
      || e.keyCode === 27 || e.keyCode === 177 || e.keyCode === 179 || e.keyCode === 176) {

      console.log("Keys are disabled")
      e.preventDefault()

    } else if (e.ctrlKey && e.keyCode === 46) {

      // Control Del
      e.preventDefault()

    } else if (e.keyCode === 8 && e.ctrlKey) { // ============================ WORD <--- WORD

      //ctrl backspace
      console.log("ctrl backspace")

    } else if (e.ctrlKey) {


    } else if (e.keyCode === 32) { // ======================================== WORD ---> WORD

      // Space bar
      if (text.onScreenGhost[0] === e.key) {
        onCorrect(1)
        updateScore(true)

      } else {
        onIncorrect(e.key)
        updateScore(false)
      }

    } else if (e.keyCode === 13) { // ======================================== LINE -<>- LINE

      // Enter
      console.log("Enter")

    } else if (e.keyCode === 8) { // ===================================== CARROT <--- CARROT

      // Backspace
      onBackspace()

    } else { // ========================================================== CARROT ---> CARROT

      // Letter
      if (text.onScreenGhost[0] === e.key) {
        onCorrect()
        updateScore(true)

      } else {
        onIncorrect(e.key)
        updateScore(false)
      }
    }
  }


  return (
    <section className="text-area-container">
      <div className="text-field">
        <span className="text-area-user">
        {text.onScreenUser.map((letter, index) =>
          <span
            key={index}
            className={text.classArray[index]}
          >{letter}</span>
        )}
        </span>
        <span className="text-area-ghost">
        {text.onScreenGhost.map((letter, index) =>
          <span
            key={index}
            className="ghost-character"
          >{letter}</span>
        )}
        </span>
        <textarea
          autoFocus
          spellCheck="false"
          className="text-area-input"
          onKeyDown={(e) => {
            handleUserInput(e)
          }}
        ></textarea>
      </div>


      <div>
        <p>Keystrok: {score.keyStrokes.total}</p>
        <p>Char Cor: {score.keyStrokes.corrected}</p>
        <p>Char Mis: {score.keyStrokes.mistake}</p>

        <p>OG: {text.original}</p>
        <p>Cl: {text.classArray[text.classArray.length - 1]}</p>
        <p>US: {text.onScreenUser.join("")}</p>
        <p>GH: {text.onScreenGhost.join("")}</p>
        <p>WI: {text.idx.wordIdx}</p>
        <p>SI: {text.idx.sentenceIdx}</p>
      </div>

    </section>
  );
}
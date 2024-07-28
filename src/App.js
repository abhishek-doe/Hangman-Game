import { useEffect, useState } from "react";
import "./App.css";
import hangman0 from "./assets/hangman0.svg";
import hangman1 from "./assets/hangman1.svg";
import hangman2 from "./assets/hangman2.svg";
import hangman3 from "./assets/hangman3.svg";
import hangman4 from "./assets/hangman4.svg";
import hangman5 from "./assets/hangman5.svg";
import hangman6 from "./assets/hangman6.svg";
import constant from "./constant.json";
import Confetti from "react-confetti";

const App = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const hangmanImg = [hangman0, hangman1, hangman2, hangman3, hangman4, hangman5, hangman6];
  const [question, setQuestion] = useState({});
  const [missCount, setMisCount] = useState(0);
  const [alphabets, setAlphabets] = useState([]);
  const [active, setActive] = useState(new Array(26).fill(false));
  const [actWords, setActWords] = useState([]);
  const [word, setWord] = useState("restart".split(""));
  const [activeIndices, setActiveIndices] = useState([]);
  const [win, setWin] = useState(false);

  useEffect(() => {
    const array = new Array(26).fill(null);
    setAlphabets(() => {
      return array.map((_, index) => String.fromCharCode(65 + index));
    });
    const randomNumber = Math.floor(Math.random() * 216);
    const randomQuestion = constant[randomNumber];
    setQuestion(() => randomQuestion);

    if (randomQuestion.correct_answer) {
      setWord(randomQuestion.correct_answer.split(""));
    } else {
      setWord(["default"].split("")); // Fallback to a default word if necessary
    }
  }, []);

  const handleBtn = (alpha, index) => {
    setActive((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
    setActWords((prev) => [...prev, alpha]);
  };

  useEffect(() => {
    let indices = [];
    actWords.forEach((actWord, actIdx) => {
      indices = word.reduce((ac, cE, cI) => {
        if (cE.toLowerCase() == actWord.toLowerCase()) {
          ac.push(cI);
        }
        return ac;
      }, []);
      setActiveIndices((prev) => [...prev, ...indices]);
    });

    setActiveIndices((prev) => [...new Set(prev)]);

    let smallcaseword = word.map((item) => item.toLowerCase());
    let uniqueArray = actWords.filter((item) => !smallcaseword.includes(item.toLowerCase()));
    setMisCount(() => uniqueArray.length);

    let checkWin = actWords.filter((item) => smallcaseword.includes(item.toLowerCase()));
    let uniqueWord = new Set(word);
    if (uniqueWord.size == checkWin.length) {
      setWin(() => true);
    }
  }, [active]);

  const Restart = () => {
    setMisCount(0);
    setActive(new Array(26).fill(false));
    setActWords([]);
    setActiveIndices([]);
    setWin(() => false);
    const randomNumber = Math.floor(Math.random() * 216);
    const randomQuestion = constant[randomNumber];
    setQuestion(() => randomQuestion);

    if (randomQuestion.correct_answer) {
      setWord(randomQuestion.correct_answer.split(""));
    } else {
      setWord(["default"].split("")); // Fallback to a default word if necessary
    }
  };

  return (
    <>
      <div className="App">
        <h1 style={{ color: "#dbe3ff" }}>Hangman Game</h1>
        <div className="container">
          <div className="hangman">
            <svg
              className="restart-svg"
              onClick={() => Restart()}
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="60"
              height="60"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="49" r="29" fill="#4b4dff"></circle>
              <path
                fill="#4343bf"
                d="M50,81c-17.645,0-32-14.355-32-32s14.355-32,32-32s32,14.355,32,32S67.645,81,50,81z M50,23 c-14.337,0-26,11.663-26,26s11.663,26,26,26s26-11.663,26-26S64.337,23,50,23z"
              ></path>
              <path
                fill="#ff8405"
                d="M50,85c-19.851,0-36-16.149-36-36h10c0,14.337,11.663,26,26,26s26-11.663,26-26h10 C86,68.851,69.851,85,50,85z"
              ></path>
              <path
                fill="#edf7f5"
                d="M50,32v4c7.168,0,13,5.832,13,13s-5.832,13-13,13s-13-5.832-13-13c0-2.433,0.675-4.762,1.907-6.775 l3.593,3.833V35H32.134l3.973,4.238C34.115,42.066,33,45.444,33,49c0,9.374,7.626,17,17,17s17-7.626,17-17S59.374,32,50,32z"
              ></path>
            </svg>
            <img src={hangmanImg[missCount]} alt="hangman" height="209px" />
          </div>
          <div className="content">
            <ul className="guess-div">
              {word.map((value, index) => {
                return (
                  <li
                    key={index}
                    className={activeIndices.includes(index) ? "guessed" : "unguessed"}
                  >
                    {activeIndices.includes(index) && value}
                  </li>
                );
              })}
            </ul>
            <p style={{ userSelect: "text" }}>
              Hint: <b>{question.question}</b>
            </p>
            <p>
              Incorrect Gusses:&nbsp;&nbsp;
              <b style={{ color: "red", margin: "0" }}>{missCount}&nbsp;</b> <b>/ 6</b>
            </p>
            <div className="alpha-btns">
              {alphabets.map((item, index) => {
                return (
                  <button
                    onClick={() => handleBtn(item, index)}
                    key={index}
                    className={active[index] ? "btn-active" : "btn"}
                    disabled={active[index] || win}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {missCount == 6 && (
        <div className="lose-modal">
          <div className="modal-content">
            <h1 style={{ fontSize: "4rem", margin: "0" }}> 🥲</h1>
            <b> You Lose!</b>
            <p>
              Correct Answer is : <b>{word}</b>
            </p>
            <button onClick={Restart} className="restart-btn">
              Restart
            </button>
          </div>
        </div>
      )}
      {win && <Confetti width={width} height={height} />}
    </>
  );
};

export default App;

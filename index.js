"use strict";

const body = document.querySelector("body");

function pageUpload() {
  const markup = `<div class="wrapper">
       
        <div class="game-field">
        <div class="gallows-wrapper">
         <div class="gallows">
             <div class="vertical"></div>
             <div class="horizontal"></div>
             <div class="diagonal"></div>
             <div class="rope"></div>
             <div class="lasso"></div>
             <div class="hangman-wrapper">
               <div class="hangman">
                   <div class="hangman-part head hidden"></div>
                   <div class="hangman-part corpus hidden"></div>                                     <div class="hangman-part right-hand hidden"></div>
                   <div class="hangman-part left-hand hidden"></div>
                   <div class="hangman-part left-leg hidden"></div>              
                   <div class="hangman-part right-leg hidden"></div>                   
               </div>
         </div>
         </div>
        </div>
       <div class='word-keyboard-wrapper'>
       <div class="word-field-wrapper">
        <div class="word-field"></div>
        <p class="riddle"></p>
        <p class="attempt-counter"></p>
       </div>
        <div class="keyboard">
            <div class="keybord-item" key-A >A</div>
            <div class="keybord-item" key-B >B</div>
            <div class="keybord-item" key-C >C</div>
            <div class="keybord-item" key-D >D</div>
            <div class="keybord-item" key-E >E</div>
            <div class="keybord-item" key-F >F</div>
            <div class="keybord-item" key-G >G</div>
            <div class="keybord-item" key-H >H</div>
            <div class="keybord-item" key-I >I</div>
            <div class="keybord-item" key-J >J</div>
            <div class="keybord-item" key-K >K</div>
            <div class="keybord-item" key-L >L</div>
            <div class="keybord-item" key-M >M</div>
            <div class="keybord-item" key-N >N</div>
            <div class="keybord-item" key-O >O</div>
            <div class="keybord-item" key-P >P</div>
            <div class="keybord-item" key-Q >Q</div>
            <div class="keybord-item" key-R >R</div>
            <div class="keybord-item" key-S >S</div>
            <div class="keybord-item" key-T >T</div>
            <div class="keybord-item" key-U >U</div>
            <div class="keybord-item" key-V >V</div>
            <div class="keybord-item" key-W >W</div>
            <div class="keybord-item" key-X >X</div>
            <div class="keybord-item" key-Y >Y</div>
            <div class="keybord-item" key-Z >Z</div>
        </div>

        </div>
       </div>

       <div class="backdrop is-hidden">
        <div class="modal-wrapper">
         <div class='modal-content-wrapper'></div>
         <div class="do-again-call-wrapper">
          <p class="do-again-call">Would you like to try it again?</p>
          <p class="do-again-call">Press the button</p>
          <button class="reset-button" type="button">Try again</button>
        </div>
       </div>
    </div>
`;
  body.insertAdjacentHTML("afterbegin", markup);
  getRandomRiddle()
    .then((randomRiddle) => {
      const { riddle, answer } = randomRiddle;
      const riddleDescription = document.querySelector(".riddle");
      const answerWord = document.querySelector(".word-field");
      const attemptCounter = document.querySelector(".attempt-counter");
      const letter = `<div class="letter"></div>`;
      const counterHTML = `Incorrect guesses:<span class="spent">0</span>/<span class="left" >6</span>`;

      riddleDescription.insertAdjacentText("beforeend", riddle);
      attemptCounter.insertAdjacentHTML("beforeend", counterHTML);

      for (let i = 0; i <= answer.length; i += 1) {
        if (answer[i]) {
          answerWord.insertAdjacentHTML("beforeend", letter);
        }
      }
      resolveRiddle(answer);
    })
    .catch((error) => {
      console.error("An error was caught:", error);
    });
}
pageUpload();

function resolveRiddle(answer) {
  const answerUppercase = answer.toUpperCase();
  const keybord = document.querySelector(".keyboard");
  const keybordItems = document.querySelectorAll(".keyboard .keybord-item");
  const spentCounter = document.querySelector(".spent");
  const leftCounter = document.querySelector(".left");
  const modalContentWrapper = document.querySelector(".modal-content-wrapper");

  console.log(answerUppercase);

  function openModal(condition) {
    document.removeEventListener("keydown", handlePhysicalKey);
    const modalContentWrapper = document.querySelector(
      ".modal-content-wrapper"
    );
    const modalContentFeild = `<div class="modal-content">
                <h3 class="greeting">Don\`t worry, it\`s just a game.)</h3>
                <h2 class="compliment">You can hit it next time !</h2>
                <p class="answer">The answer is : <span class='ansver-word'>${answer}</span></p>
                `;
    const modalContentWin = ` <div class="modal-content">
                <h3 class="greeting">Congratulations!!!</h3>
                <h2 class="compliment">You are so good!!!!</h2>
                <p class="answer">The answer is : <span class='ansver-word'>${answer}</span></p>
            </div>`;
    const isBackdrop = document.querySelector(".backdrop");
    const resetButton = document.querySelector(".reset-button");

    isBackdrop.classList.remove("is-hidden");
    condition === "lose"
      ? modalContentWrapper.insertAdjacentHTML("afterBegin", modalContentFeild)
      : modalContentWrapper.insertAdjacentHTML("afterBegin", modalContentWin);

    resetButton.addEventListener("click", startAgainGame);
    document.addEventListener("keydown", handleEnterKey);
    function handleEnterKey(event) {
      if (event.key === "Enter") {
        resetButton.click();
      }
    }
    resetButton.addEventListener("click", () => {
      document.removeEventListener("keydown", handleEnterKey);
    });
  }

  function startAgainGame() {
    modalContentWrapper.innerHTML = "";
    const isBackdrop = document.querySelector(".backdrop");
    isBackdrop.classList.add("is-hidden");
    body.innerHTML = "";
    spentCounter.innerText = "0";
    leftCounter.innerText = "6";
    const keybordItems = document.querySelectorAll(".keybord-item");
    keybordItems.forEach((key) => key.classList.remove("disable"));
    document.removeEventListener("keydown", handlePhysicalKey);
    const letterElements = document.querySelectorAll(".letter");
    letterElements.forEach((elem) => (elem.innerText = ""));

    pageUpload();
  }
  // Event-Listener to phisical keyboard
  document.addEventListener("keydown", handlePhysicalKey);

  // Event-Listener to virtual keyboard
  keybordItems.forEach((elem) => {
    elem.removeEventListener("click", clickOnTheLetter);
    elem.addEventListener("click", clickOnTheLetter);
  });

  function clickOnTheLetter(e) {
    const pressedKey = e.target;

    if (pressedKey.classList.contains("disable")) {
      console.log(`Key ${pressedKey.innerText} is already disabled.`);
      return;
    }

    if (!pressedKey.classList.contains("disable")) {
      pressedKey.classList.add("disable");

      console.log(
        `Key ${pressedKey} pressed on virtual keyboard and now disabled.`
      );
    }

    if (!answerUppercase.includes(e.target.innerText)) {
      const counterSpent = document.querySelector(".spent");
      const counterLeft = document.querySelector(".left");
      const hangmanParts = document.querySelectorAll(".hangman .hangman-part");

      counterLeft.innerText = +counterLeft.innerText - 1;
      counterSpent.innerText = +counterSpent.innerText + 1;
      pressedKey.classList.add("wrong");

      for (let i = 1; i <= hangmanParts.length; i += 1) {
        if (+counterSpent.innerText === i) {
          hangmanParts[i - 1].classList.remove("hidden");
          if (hangmanParts[i - 1].classList.contains("right-leg")) {
            keybordItems.forEach((elem) => {
              elem.removeEventListener("click", clickOnTheLetter);
            });

            setTimeout(() => {
              openModal("lose");
            }, "1000");
          }
        }
      }
    }

    for (let i = 0; i <= answerUppercase.length; i += 1) {
      if (answerUppercase[i] === e.target.innerText) {
        const letter = document.querySelectorAll(".letter");
        pressedKey.classList.add("right");

        letter.forEach((elem, index) => {
          if (i === index && elem.innerText === "") {
            elem.insertAdjacentText("beforeend", answerUppercase[i]);
          }
        });
      }
    }

    const letterElements = document.querySelectorAll(".letter");
    const isWordComplete = Array.from(letterElements).every(
      (elem) => elem.innerText !== ""
    );

    if (isWordComplete) {
      keybordItems.forEach((elem) => {
        elem.removeEventListener("click", clickOnTheLetter);
      });

      setTimeout(() => {
        openModal("win");
      }, "1000");
    }
  }

  function handlePhysicalKey(e) {
    const pressedKey = e.key.toUpperCase();
    const virtualKey = Array.from(keybordItems).find(
      (item) => item.innerText === pressedKey
    );

    if (!virtualKey || virtualKey.classList.contains("disable")) {
      return;
    }

    if (virtualKey) {
      if (!virtualKey.classList.contains("disable")) {
        virtualKey.classList.add("disable");
        console.log(
          `Key ${pressedKey} pressed on physical keyboard and now disabled.`
        );
      }
    }

    if (!answerUppercase.includes(pressedKey)) {
      const counterSpent = document.querySelector(".spent");
      const counterLeft = document.querySelector(".left");
      const hangmanParts = document.querySelectorAll(".hangman .hangman-part");

      virtualKey.classList.add("wrong");

      counterLeft.innerText = +counterLeft.innerText - 1;
      counterSpent.innerText = +counterSpent.innerText + 1;

      for (let i = 1; i <= hangmanParts.length; i += 1) {
        if (+counterSpent.innerText === i) {
          hangmanParts[i - 1].classList.remove("hidden");
          if (hangmanParts[i - 1].classList.contains("right-leg")) {
            document.removeEventListener("keydown", handlePhysicalKey);
            setTimeout(() => {
              openModal("lose");
            }, "1000");
            return;
          }
          hangmanParts[i - 1].classList.add("animation");
        }
      }
      return;
    }

    for (let i = 0; i <= answerUppercase.length - 1; i += 1) {
      if (answerUppercase[i] === pressedKey) {
        const letter = document.querySelectorAll(".letter");
        virtualKey.classList.add("right");

        letter.forEach((elem, index) => {
          if (i === index && elem.innerText === "") {
            elem.insertAdjacentText("beforeend", answerUppercase[i]);
          }
        });
      }
    }

    const letterElements = document.querySelectorAll(".letter");
    const isWordComplete = Array.from(letterElements).every(
      (elem) => elem.innerText !== ""
    );

    if (isWordComplete) {
      document.removeEventListener("keydown", handlePhysicalKey);
      setTimeout(() => {
        openModal("win");
      }, "1000");
    }
  }
}

function getRandomRiddle() {
  return fetch("./riddles.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((riddlecollection) => {
      console.log(riddlecollection.map((elem) => elem.answer));
      const throuwCollection = riddlecollection.sort(() => Math.random() - 0.5);
      const randomRiddle = throuwCollection.slice(0, 1);
      const riddle = randomRiddle[0];
      console.log(riddle);
      return riddle;
    });
}

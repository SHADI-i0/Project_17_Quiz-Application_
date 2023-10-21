// select element
let categorySpan = document.querySelector(".category span");
let countSpan = document.querySelector(".count span");
let bulletsElement = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// create function request to fetch data
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.status === 200 && this.readyState === 4) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            createBullets(qCount);
            addQuestionsData(questionsObject[currentIndex], qCount);
            // start countDown
            countdown(10, qCount);
            // click on submit
            submitButton.addEventListener("click", () => {
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(theRightAnswer);
                // remove previous questions
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                addQuestionsData(questionsObject[currentIndex], qCount);
                // Handle bullets class
                handleBullets();
                // show results
                showResults(qCount);
                // reset the count down
                clearInterval(countdownInterval);
                countdown(10, qCount);
            });
        }
    };
    myRequest.open("GET", "Html_Questions.json", true);
    myRequest.send();
}
getQuestions();

// create bullets + set questions count
function createBullets(num) {
    categorySpan.innerHTML = "HTML";
    countSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if (i == 0) {
            theBullet.className = "on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
}

// add questions data
function addQuestionsData(obj, count) {
    if (currentIndex < count) {
        let qTitle = document.createElement("h2");
        let qText = document.createTextNode(obj.title);
        qTitle.appendChild(qText);
        quizArea.appendChild(qTitle);
        for (let i = 1; i <= 4; i++) {
            // create parent div
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            // create input
            let radioInput = document.createElement("input");
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            if (i == 1) {
                radioInput.checked = true;
            }
            // create label
            let theLabel = document.createElement("label");
            theLabel.htmlFor = `answer_${i}`;
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
            theLabel.appendChild(theLabelText);
            // add input + label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer) {
    let answers = document.getElementsByName("question");
    let theChosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer == theChosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bulletsElement.remove();
        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}.`;
        } else if (rightAnswers == count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class="bad">bad</span>, ${rightAnswers} From ${count}.`;
        }
        resultsContainer.innerHTML = theResults;
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElement.innerHTML = `${minutes} : ${seconds}`;
            if (duration == 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
            --duration;
        }, 1000);
    }
}
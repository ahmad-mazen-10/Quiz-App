// Select Elements
let countSpan = document.querySelector('.quiz-info .count span');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let bullets = document.querySelector('.bullets');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitBTN = document.querySelector('.submit-btn');
let resultsContainer = document.querySelector('.results');
let countDownEle = document.querySelector('.count-down');

// Set Options
let currentIndex = 0;
let correctAns = 0;
let countDownInterval;

function getQuestion() {
    let myReq = new XMLHttpRequest();

    myReq.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let quesObj = JSON.parse(this.responseText);
            let quesCount = quesObj.length;

            // Create bullets according to the question number
            createBullets(quesCount);

            // Start countdown
            countdown(5, quesCount);

            // Add question data
            addQuestionData(quesObj[currentIndex], quesCount);

            // Click on submit
            submitBTN.onclick = () => {
                // Get the correct answer
                let correctAnswer = quesObj[currentIndex].correct_Answer;

                // Increase index
                currentIndex++;

                // Check the answer
                checkAnswer(correctAnswer, quesCount);

                // Remove previous question
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                // Add question data
                addQuestionData(quesObj[currentIndex], quesCount);

                // Handle bullets class
                handleBullets();

                // Start countdown
                clearInterval(countDownInterval);
                countdown(5, quesCount);

                // Show results
                showResults(quesCount);
            };
        }
    };

    myReq.open('GET', 'html_ques.json', true);
    myReq.send();
}

getQuestion();

function createBullets(num) {
    countSpan.innerHTML = num;

    // Create spans
    for (let i = 0; i < num; i++) {
        // Create span
        let bullet = document.createElement('span');

        // Check first state
        if (i === 0) {
            bullet.className = 'now';
        }

        // Add bullet to outer
        bulletsSpanContainer.appendChild(bullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // Create h2 question title
        let quesTitle = document.createElement('h2');

        // Create question text
        let quesText = document.createTextNode(obj.question);

        // Set question title
        quesTitle.appendChild(quesText);

        // Append h2 to quiz-area
        quizArea.appendChild(quesTitle);

        // Create answers
        for (let a = 1; a <= 4; a++) {
            // Create answer container
            let ansContainer = document.createElement('div');

            // Add class to the main div
            ansContainer.className = 'answer';

            // Create radio input
            let radioInput = document.createElement('input');

            // Add type + name + id + data attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${a}`;
            radioInput.dataset.answer = obj[`answer_${a}`];

            // Make the first option selected
            if (a === 1) {
                radioInput.checked = true;
            }

            // Create label
            let label = document.createElement('label');

            // Add attribute to for
            label.htmlFor = `answer_${a}`;

            // Create label-text
            let labelTxt = document.createTextNode(obj[`answer_${a}`]);

            // Add the text to label
            label.appendChild(labelTxt);

            // Add input + label to the main div
            ansContainer.appendChild(radioInput);
            ansContainer.appendChild(label);

            // Add all divs to answers area
            answersArea.appendChild(ansContainer);

            // Add event listener on click
            // radioInput.addEventListener("click", checkAnswer);
        }
    }
}

function checkAnswer(corrAns, count) {
    let answers = document.getElementsByName('question');
    let chosenAns;

    for (let c = 0; c < answers.length; c++) {
        if (answers[c].checked) {
            chosenAns = answers[c].dataset.answer;
        }
    }

    if (corrAns === chosenAns) {
        correctAns++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrSpans = Array.from(bulletsSpans);

    arrSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'now';
        }
    });
}

function showResults(count) {
    let results;

    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitBTN.remove();
        bullets.remove();

        if (correctAns > count / 2 && correctAns < count) {
            results = `You got, ${correctAns} out of ${count}. Good! You might want to study a bit more.`;
        } else if (correctAns === count) {
            results = 'Congratulations! You got all the questions right! You\'re really smart.';
        } else {
            results =`You got ${correctAns} out of ${count}. That's not good! Maybe you should try studying a bit harder.`;
        }

        resultsContainer.innerHTML = results;
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0 ${minutes} `: minutes;
            seconds = seconds < 10 ? `0 ${seconds} `: seconds;

            countDownEle.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitBTN.click();
            }
        }, 1000);
    }
}

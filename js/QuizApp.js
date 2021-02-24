// select Element
let count = document.querySelector(".quiz-info .count span"),
    BulletsSpanCount = document.querySelector(".bullets .spans"),
    BulletsSpan = document.querySelector(".bullets "),
    quizarea = document.querySelector(".quiz-area"),
    answersarea = document.querySelector(".answers-area"),
    submitbutton = document.querySelector(".submit-button"),
    resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


// options
let index = 0,
    trueanswer = 0;
let countdownInterval;



// get data from Json file
function get_data() {

    let myrequest = new XMLHttpRequest();

    myrequest.onreadystatechange = function() {

        if (this.readyState === 4 && this.status === 200) {

            let questions = JSON.parse(this.responseText)

            // length of question
            let qCount = questions.length

            // length of answer in every question
            let qanswer = Object.keys(questions[index]).length

            // createBullets 
            createBullets(qCount)

            // add question
            addquestion(questions[index], qCount, qanswer)



            countdown(15, qCount)

            // Click On Submit
            submitbutton.onclick = () => {
                let right_answer = questions[index].right_answer
                index++
                checkedanswer(right_answer, qCount);
                // Remove Previous Question and craete next Question
                quizarea.innerHTML = "";
                answersarea.innerHTML = "";
                // add question
                addquestion(questions[index], qCount, qanswer)
                handleBullets();
                // countdown
                clearInterval(countdownInterval)
                countdown(15, qCount)
                showresult(qCount);

            }
        }

    }
    myrequest.open("GET", "QuizApp.json", true)
    myrequest.send()
}
get_data()

// createBullets
function createBullets(num) {
    count.innerHTML = num
    for (let i = 0; i < num; i++) {
        // craete Bullets
        let BulletsSpan = document.createElement("span")
        if (i === 0) {
            BulletsSpan.classList.add("on")
        }
        // add span in container
        BulletsSpanCount.appendChild(BulletsSpan)
    }


}
// add question
function addquestion(obj, count, qanswer) {
    if (index < count) {
        // craete title
        let titlequestion = document.createElement("h2");
        // add title of question in title
        let texttitle = document.createTextNode(obj["title"])
        titlequestion.appendChild(texttitle);
        quizarea.appendChild(titlequestion);

        for (let i = 1; i <= qanswer - 2; i++) {
            // create question 
            let maindiv = document.createElement("div");
            maindiv.className = "answer";
            // create input
            let inp = document.createElement("input")
            inp.id = `answer_${i}`;
            inp.type = `radio`;
            inp.name = "question"
            inp.dataset.answer = obj[`answer_${i}`];
            // Make first answer checked
            if (i === 1) {
                inp.checked = true;
            }

            // add inp in maindiv
            maindiv.appendChild(inp)
                // craete label
            let label = document.createElement("label");
            label.htmlFor = `answer_${i}`;
            let labeltext = document.createTextNode(obj[`answer_${i}`])
            label.appendChild(labeltext)
                // add label in maindiv
            maindiv.appendChild(label)
                // add main div in answerarea
            answersarea.appendChild(maindiv)
        }
    }


}

// function to checkedanswer
function checkedanswer(right_answer, qCount) {

    let answers = document.getElementsByName("question"),
        choosen_answer = "";

    answers.forEach(function(answer) {

        if (answer.checked) {
            choosen_answer = answer.dataset.answer
        }
    })
    if (choosen_answer === right_answer) {
        trueanswer++
        console.log(trueanswer)
    }

}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, indexBuulets) => {
        if (index === indexBuulets) {
            span.className = "on";
        }
    });
}

// show resulate

function showresult(qCount) {
    let theResults;
    if (index == qCount) {
        quizarea.remove();
        answersarea.remove();
        submitbutton.remove();
        BulletsSpan.remove();
    }
    if (trueanswer > qCount / 2 && trueanswer < qCount) {
        theResults = `<span class="good">Good</span>, ${trueanswer} From ${qCount}`;
    } else if (trueanswer == qCount) {
        theResults = `<span class="perfect">perfect</span>,All Answer Is Good`;
    } else {
        theResults = `<span class="bad">Bad</span>, ${trueanswer} From ${qCount}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
}

function countdown(duration, count) {
    if (index < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitbutton.click();
            }
        }, 1000);
    }
}
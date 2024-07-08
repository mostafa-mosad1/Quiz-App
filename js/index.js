const categoryMenu = document.getElementById("categoryMenu");
const difficultyOptions = document.getElementById("difficultyOptions");
const questionsNumber = document.getElementById("questionsNumber");
const startQuiz = document.getElementById("startQuiz");
const hidenFormOptons = document.querySelector(".start-quiz");
const containerQuestion = document.querySelector(".questions .row");

let allQuestions;

hidenFormOptons.addEventListener("click", async function (e) {
  e.preventDefault();
  let quizQuestion = new Quiz(
    categoryMenu.value,
    difficultyOptions.value,
    questionsNumber.value,
    0,
    0
  );

  if (categoryMenu.value && difficultyOptions.value && questionsNumber.value) {
    allQuestions = await quizQuestion.ApiData();
    console.log(allQuestions);
    hidenFormOptons.classList.replace("d-flex", "d-none");
    quizQuestion.displayData();
  }
});

class Quiz {
  constructor(category, difficulty, questions, Score, index) {
    this.categoryMenu = category;
    this.difficultyOptions = difficulty;
    this.questionsNumber = questions;
    this.Score = Score;
    this.index = index;
    this.checked = false;
  }

  async ApiData() {
    let link = await fetch(
      //   `https://opentdb.com/api.php?amount=6&category=27&difficulty=easy&type=multiple`
      `https://opentdb.com/api.php?amount=${this.questionsNumber}&category=${this.categoryMenu}&difficulty=${this.difficultyOptions}&type=multiple`
    );
    let api = await link.json();
    return api.results;
  }

  displayData() {
    let allAnswers = [
      allQuestions[this.index].correct_answer,
      ...allQuestions[this.index].incorrect_answers,
    ].sort();
    console.log(allQuestions[this.index].correct_answer);
    let html = `
    <div
            class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
          >
            <div class="w-100 d-flex justify-content-between">
              <span class="btn btn-category">${
                allQuestions[this.index].category
              }</span>
              <span class="fs-6 btn btn-questions">${this.index + 1} of ${
      allQuestions.length
    }
     Questions</span>
            </div>
            <h2 class="text-capitalize h4 text-center">${
              allQuestions[this.index].question
            }</h2>  
            <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${allAnswers
              .map((ans, i) => `<li class = "ans">${allAnswers[i]}</li>`)
              .join(" ")}
        
              

            </ul>
            <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${
              this.Score
            }</h2>        
          </div>`;

    containerQuestion.innerHTML = html;
    document.querySelectorAll(".question li").forEach((ele) => {
      ele.addEventListener("click", (e) => {
        this.checkAnswer(ele);
        this.nextQuestion();
      });
    });
  }
  checkAnswer(ele) {
    let answerCorrect = allQuestions[this.index].correct_answer;
    if (!this.checked) {
      if (answerCorrect == ele.innerHTML) {
        this.Score++;
        ele.classList.add("correct", "animate__animated", "animate__heartBeat");
      } else {
        ele.classList.add("wrong", "animate__animated", "animate__swing");
      }
    }
  }

  nextQuestion() {
    if (!this.checked) {
      this.index++;
      setTimeout(() => {
        this.checked = false;
        if (allQuestions.length > this.index) {
          this.displayData();
        } else {
          // let html = this.results();
          // containerQuestion.innerHTML = html;
          containerQuestion.innerHTML = `
        <div
          class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
        >
          <h2 class="mb-0 animate__animated   animate__rollIn">
          ${
            this.Score == allQuestions.length
              ? `Congratulations 🎉`
              : `Your score is ${this.Score} / ${allQuestions.length}`
          }      
          </h2>
          <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
        </div>
      `;
          document
            .querySelector(".again")
            .addEventListener("click", function (e) {
              window.location.reload();
            });
        }
      }, 2000);
    }
    this.checked = true;
  }

  showResult = () => {
    return `
      <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <h2 class="mb-0">
        ${
          this.Score == allQuestions.length
            ? `Congratulations 🎉`
            : `Your score is ${this.Score}`
        }      
        </h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
  };
}

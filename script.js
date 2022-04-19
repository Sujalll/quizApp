/** Global variables */
var questions = [];
var questionNo = 1;
var totalNoOfQuestion = 0;
var presentQNo = 0;
var fullMarks = 0;
var markPerQuestion = 10;
var score = 0;
var answered = false;

/** When clicked happen on start quiz button */
$('#startQuiz').click(function () {
  $(this).parent().removeClass('activeNow');
  $('.progress').addClass('activeNow');
  arrangeRequiremenrtForm();
});

$('#formSubmit').click(function () {
  $('.progress').addClass('activeNow');
  arrangeQuestions();
});

$('#resetQuiz').click(function () {
  window.location.reload();
});

$('#nextQuestion').click(function (e) {
  e.preventDefault();
  // console.log(totalNoOfQuestion, presentQNo + 1);
  if (!answered) {
    alert('Please select one answer before continuing !!');
    return false;
  }

  if (totalNoOfQuestion == presentQNo + 2) {
    $('#nextQuestion').text('Show Result');
  }
  totalNoOfQuestion == presentQNo + 1
    ? showResult()
    : prepareQuestion(presentQNo + 1);

  answered = false;
});

/** When clicked happened on select answer */
$(document).on('click', '.answer', function (e) {
  questions[presentQNo].userAnswer = $(this).attr('value');

  if (questions[presentQNo].correct_answer === $(this).attr('value')) {
    e.target.classList.add('correct');
    score += 10;
  } else {
    e.target.classList.add('wrong');
    $('#answerArea li').each(function (i) {
      if (questions[presentQNo].correct_answer === $(this).attr('value')) {
        $(this).addClass('correct');
      }
    });
  }

  $('li').addClass('disabl');
  answered = true;
});

/** prepare requirement form before generate */
const arrangeRequiremenrtForm = async () => {
  const data = await fetchQuestionsCategory();

  $('#catSelect').append(`
          <option value='' disabled selected>Choose question category</option>`);

  data.trivia_categories.forEach((cat) => {
    $('#catSelect').append(
      $('<option></option>').attr('value', cat.id).text(cat.name)
    );
  });

  $('.progress').removeClass('activeNow');
  $('#requirementBlock').addClass('activeNow');
};

/** Prepare question and answers block */
const arrangeQuestions = async () => {
  if (
    !$('#catSelect').val() ||
    !$('#diffSelect').val() ||
    !$('#questionNo').val()
  ) {
    alert('Please fill all required fields');
    return false;
  }
  const data = await fetchQuestions(
    $('#catSelect').val(),
    $('#diffSelect').val(),
    $('#questionNo').val()
  );
  totalNoOfQuestion = $('#questionNo').val();
  questions = data.results;
  console.log(data);
  prepareQuestion(0);

  $('.progress').removeClass('activeNow');
  $('#requirementBlock').removeClass('activeNow');
};

/** Prepare question template */
const prepareQuestion = (qNo) => {
  $('#questionArea').html(`<b>Q${qNo + 1})</b> ${questions[qNo].question}`);
  let allAnswers = [
    ...questions[qNo].incorrect_answers,
    questions[qNo].correct_answer,
  ];

  presentQNo = qNo;

  $('#answerArea').html('');

  allAnswers
    .sort(() => Math.random() - 0.5)
    .forEach((answer, i) => {
      $('#answerArea').append(
        `<li class='answer list-group-item' value="${answer}">(${
          i + 1
        }) ${answer}</li>`
      );
    });

  $('.questionBlock').addClass('activeNow');
};

/** prepare & show results */
const showResult = () => {
  $('#fullMarks').text(`Full Score : ${markPerQuestion * totalNoOfQuestion}`);
  $('#marks').text(`Your Score : ${score}`);
  $('.resultBlock').show();
  $('.questionBlock').removeClass('activeNow');
  return true;
};

/** fetch questions category from third party api */
const fetchQuestionsCategory = () => {
  return new Promise((resolve) => {
    fetch(`https://opentdb.com/api_category.php`)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

/** fetch all questions from third party api depends on user requirement */
const fetchQuestions = (cat, diff, qNo) => {
  return new Promise((resolve) => {
    fetch(
      `https://opentdb.com/api.php?amount=${qNo}&category=${cat}&difficulty=${diff}&type=multiple`
    )
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};
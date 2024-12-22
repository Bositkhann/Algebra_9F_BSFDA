import { questionsData } from './questions.js';
import { appState } from './app.js'
export function toggleSection(sectionId, show) {
    const section = document.getElementById(sectionId);
    if (show) {
        section.classList.add('active');
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
        section.classList.remove('active');
    }
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export function generateQuestionCards(mode) {
    const section = mode === 'game' ? 'gameSection' : 'trainingSection';
    const table = document.querySelector(`#${section} .questions-table`);
    console.log(table);
    table.innerHTML = '';
    let questions = questionsData[mode];

    if(questions.length > 0){
         const shuffledQuestions = shuffleArray([...questions]);
          shuffledQuestions.forEach((question, index) => {
            const card = createQuestionCard(question, mode);
            table.appendChild(card);
            // Задержка для анимации каждой карточки
            setTimeout(() => {
              card.classList.add('visible');
            }, 50 * index);
          });
        if(mode === 'training')
        {
            startTrainingMode(shuffledQuestions[0], 'training')
        }
    }else {
        table.innerHTML = '<p>Savollar topilmadi</p>'
    }
}
function createQuestionCard(question, mode) {
    const card = document.createElement('div');
    card.classList.add('question-card');
    card.dataset.questionId = question.id;

    if (mode === 'game') {
        card.innerHTML = `
            <h2>${question.title}</h2>
            <p>${question.difficulty} savol (${question.points} ball)</p>
        `;
        card.addEventListener('click', () => selectQuestion(question, 'game'));
    } else {
         card.innerHTML = `<h2>${question.title}</h2>`;
        card.addEventListener('click', () => startTrainingMode(question, 'training'));
    }
    return card;
}
function selectQuestion(question, mode) {
  console.log('Savol tanlandi: ', question);
    const modal = document.getElementById('questionModal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2>${question.title}</h2>
         ${mode === 'game' ? `<p>${question.difficulty} savol (${question.points} ball)</p>` : ''}
        ${mode === 'game' && question.options
        ? question.options.map(option => `<button class="option-button" data-answer="${option}">${option}</button>`).join('')
        : ''}
        ${mode === 'training' ? '<button class="next-button">Keyingi savol</button>' : ''}
    `;
    modal.style.display = 'flex';

     if(mode === 'game' && question.options)
    {
        modalContent.querySelectorAll('.option-button').forEach(button => {
          button.addEventListener('click', (event) => checkAnswer(question, event.target.dataset.answer, mode, modalContent));
        });
    }
    if(mode === 'training'){
         modalContent.innerHTML += `<p class="explanation">${question.explanation}</p>`;
        modalContent.querySelector('.next-button').addEventListener('click', () => handleNextQuestion(question, mode));
    }

     document.getElementById('closeModal').addEventListener('click', closeModal);
}
function handleNextQuestion(question, mode)
{
    const questions = questionsData[mode];
     appState.currentQuestionIndex++;
    if(appState.currentQuestionIndex >= questions.length)
    {
         appState.currentQuestionIndex = 0;
    }
     closeModal();
   startTrainingMode(questions[appState.currentQuestionIndex], mode)

}
function startTrainingMode(question, mode) {
     console.log('Mashg\'ulot rejimi savoli tanlandi: ', question);
     selectQuestion(question, mode);
}
function closeModal() {
  document.getElementById('questionModal').style.display = 'none';
}
function checkAnswer(question, selectedAnswer, mode, modalContent)
{
      let message;
      let correct = false;
      const normalizedSelectedAnswer = selectedAnswer.trim().toLowerCase();
      const normalizedCorrectAnswer = question.correctAnswer.trim().toLowerCase();
      console.log("checkAnswer - Question:", question);
      console.log("checkAnswer - selectedAnswer (normalized):", normalizedSelectedAnswer);
        console.log("checkAnswer - correctAnswer (normalized):", normalizedCorrectAnswer);
      if(normalizedSelectedAnswer === normalizedCorrectAnswer)
    {
       appState.score += question.points;
        message = "Togri javob!"
        correct = true;
    }else{
       message = "Notogri javob!"
    }
    modalContent.innerHTML += `<p class="${correct ? 'correct-answer' : 'wrong-answer'}">${message}</p>`
    displayScore(appState.score);

    const gameQuestions = questionsData['game'];

    if(mode === 'game' && appState.currentQuestionIndex === gameQuestions.length - 1 ) {
        setTimeout(showResultModal, 1000)
     } else if(mode === 'game')
    {
         setTimeout(() => showNextQuestion(question, mode), 1000)
    }
    else{
        setTimeout(closeModal, 1000)
    }


}
function showNextQuestion(currentQuestion, mode) {
  const gameQuestions = questionsData['game'];
    appState.currentQuestionIndex++;
    if (appState.currentQuestionIndex >= gameQuestions.length ) {
          showResultModal()
    }else{
         const nextQuestion = gameQuestions[appState.currentQuestionIndex];
        closeModal()
        selectQuestion(nextQuestion, mode);
    }
}

function displayScore(score)
{
     document.getElementById('scoreDisplay').textContent = score;
}
function showResultModal() {
    const modal = document.getElementById('resultModal');
    const modalContent = document.getElementById('resultModalContent');
    modalContent.innerHTML = `
        <h2>O'yin tugadi!</h2>
        <p>Sizning balingiz: ${appState.score}</p>
        <button id="restartButton" class="next-button">Boshqatdan boshlash</button>
    `;
    modal.style.display = 'flex';
    document.getElementById('restartButton').addEventListener('click', restartGame);
     document.getElementById('closeResultModal').addEventListener('click', closeResultModal);
}
function restartGame() {
    appState.score = 0;
    displayScore(appState.score);
     appState.currentQuestionIndex = 0;
    closeResultModal();
    generateQuestionCards('game');
}
function closeResultModal()
{
    document.getElementById('resultModal').style.display = 'none';
}
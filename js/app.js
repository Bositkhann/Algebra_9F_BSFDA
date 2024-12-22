import { questionsData } from './questions.js';
import { toggleSection, generateQuestionCards } from './ui.js';

export const appState = {
    score : 0,
    currentQuestionIndex : 0
}
const navButtons = document.querySelectorAll('.nav-button');
console.log(questionsData);
navButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const mode = event.target.dataset.mode;
         setActiveSection(mode)
    });
});

function setActiveSection(mode) {
    toggleSection('authorsSection', false);
    const gameSection =  document.getElementById('gameSection');
    const trainingSection =  document.getElementById('trainingSection');
     console.log('generating questions for ' + mode );
    if (mode === 'game') {
          toggleSection('gameSection', true);
          toggleSection('trainingSection', false);
            generateQuestionCards('game');
    } else {
       toggleSection('gameSection', false);
        toggleSection('trainingSection', true);
            generateQuestionCards('training');
    }
}
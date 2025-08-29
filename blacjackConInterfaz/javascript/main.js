import { BlackjackGame } from './game.js';

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const game = new BlackjackGame();
    console.log('Juego de Blackjack inicializado correctamente');
});
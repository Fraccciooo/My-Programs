import { Deck } from './deck.js';
import { Hand } from './hand.js';
import { showMessage, toggleElementVisibility, disableButton } from './Utilidades.js';

// Clase principal del juego Blackjack
export class BlackjackGame {
    constructor() {
        this.deck = new Deck();
        this.playerHand = new Hand();
        this.dealerHand = new Hand();
        this.money = 10000;
        this.currentBet = 0;
        this.gameOver = true;
        
        // Elementos del DOM
        this.playerHandEl = document.getElementById('player-hand');
        this.dealerHandEl = document.getElementById('dealer-hand');
        this.playerScoreEl = document.getElementById('player-score');
        this.dealerScoreEl = document.getElementById('dealer-score');
        this.moneyEl = document.getElementById('money');
        this.betEl = document.getElementById('bet');
        this.messageEl = document.getElementById('game-message');
        
        this.dealButton = document.getElementById('deal-button');
        this.hitButton = document.getElementById('hit-button');
        this.standButton = document.getElementById('stand-button');
        this.doubleButton = document.getElementById('double-button');
        this.resetButton = document.getElementById('reset-button');    
        this.gameControls = document.getElementById('game-controls');
        this.actionButtons = document.getElementById('action-buttons');
        
        this.bet5Button = document.getElementById('bet-5');
        this.bet25Button = document.getElementById('bet-25');
        this.bet50Button = document.getElementById('bet-50');
        this.bet100Button = document.getElementById('bet-100');
        this.bet500Button = document.getElementById('bet-500');
        this.bet666Button = document.getElementById('bet-666');
        this.clearBetButton = document.getElementById('clear-bet');
        
        this.setupEventListeners();
        this.updateUI();
    }
    
    setupEventListeners() {
        this.dealButton.addEventListener('click', () => this.deal());
        this.hitButton.addEventListener('click', () => this.hit());
        this.standButton.addEventListener('click', () => this.stand());
        this.doubleButton.addEventListener('click', () => this.doubleDown());
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        this.bet5Button.addEventListener('click', () => this.placeBet(5));
        this.bet25Button.addEventListener('click', () => this.placeBet(25));
        this.bet50Button.addEventListener('click', () => this.placeBet(50));
        this.bet100Button.addEventListener('click', () => this.placeBet(100));
        this.bet500Button.addEventListener('click', () => this.placeBet(500));
        this.bet666Button.addEventListener('click', () => this.placeBet(666));
        this.clearBetButton.addEventListener('click', () => this.clearBet());
    }
    
    deal() {
        if (this.currentBet <= 0) {
            showMessage(this.messageEl, "Debes hacer una apuesta primero");
            return;
        }
        
        this.startNewRound();
        
        // Repartir dos cartas al jugador y al crupier
        this.playerHand.addCard(this.deck.dealCard());
        this.playerHand.addCard(this.deck.dealCard());
        this.dealerHand.addCard(this.deck.dealCard());
        this.dealerHand.addCard(this.deck.dealCard());
        
        // Comprobar blackjack natural
        if (this.playerHand.hasBlackjack()) {
            this.gameOver = true;
            
            if (this.dealerHand.hasBlackjack()) {
                showMessage(this.messageEl, "Ambos tienen Blackjack! Empate");
                this.money += this.currentBet; // Devolver apuesta
            } else {
                showMessage(this.messageEl, "Blackjack! Ganas 3:2");
                this.money += this.currentBet * 2.5; // Pago 3:2
            }
            this.endGame();
        } else {
            // Mostrar botones de acción
            toggleElementVisibility(this.gameControls, false);
            toggleElementVisibility(this.actionButtons, true);
            this.gameOver = false;
        }
        
        this.updateUI();
    }
    
    hit() {
        if (this.gameOver) return;
        
        this.playerHand.addCard(this.deck.dealCard());
        
        if (this.playerHand.isBusted()) {
            showMessage(this.messageEl, "Te has pasado de 21! Pierdes");
            this.gameOver = true;
            this.endGame();
        }
        
        this.updateUI();
    }
    
    stand() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        
        // El crupier pide cartas hasta alcanzar al menos 17
        while (this.dealerHand.score < 17) {
            this.dealerHand.addCard(this.deck.dealCard());
        }
        
        this.determineWinner();
        this.updateUI();
        this.endGame();
    }
    
    doubleDown() {
        if (this.playerHand.cards.length !== 2 || this.currentBet * 2 > this.money) {
            return; // Solo se puede doblar en la primera jugada y con dinero suficiente
        }
        
        this.money -= this.currentBet;
        this.currentBet *= 2;
        
        // El jugador recibe una sola carta adicional
        this.playerHand.addCard(this.deck.dealCard());
        
        if (this.playerHand.isBusted()) {
            showMessage(this.messageEl, "Te has pasado de 21! Pierdes");
            this.gameOver = true;
            this.endGame();
        } else {
            // Después de doblar, el turno termina automáticamente
            this.stand();
        }
        this.updateUI();
    }
    
    placeBet(amount) {
        if (this.gameOver) {
            if (this.money >= amount) {
                this.currentBet += amount;
                this.money -= amount;
                this.updateUI();
            }
        }
    }
    
    clearBet() {
        if (this.gameOver) {
            this.money += this.currentBet;
            this.currentBet = 0;
            this.updateUI();
        }
    }
    
    determineWinner() {
        if (this.playerHand.isBusted()) {
            showMessage(this.messageEl, "Te has pasado! Gana el crupier");
        } else if (this.dealerHand.isBusted()) {
            showMessage(this.messageEl, "El crupier se pasa! Tú ganas");
            this.money += this.currentBet * 2;
        } else if (this.dealerHand.score > this.playerHand.score) {
            showMessage(this.messageEl, "Gana el crupier");
        } else if (this.playerHand.score > this.dealerHand.score) {
            showMessage(this.messageEl, "Tú ganas!");
            this.money += this.currentBet * 2;
        } else {
            showMessage(this.messageEl, "Empate");
            this.money += this.currentBet;
        }
    }
    
    startNewRound() {
        this.playerHand.clear();
        this.dealerHand.clear();
        showMessage(this.messageEl, "");
        
        if (this.deck.getRemainingCards() < 20) {
            this.deck = new Deck();
            this.deck.shuffle();
        }
        
        toggleElementVisibility(this.actionButtons, false);
        toggleElementVisibility(this.resetButton, false);
        toggleElementVisibility(this.gameControls, true);
    }
    
    endGame() {
        toggleElementVisibility(this.actionButtons, false);
        toggleElementVisibility(this.resetButton, true);
        this.gameOver = true;
    }
    
    resetGame() {
        this.money = 10000;
        this.currentBet = 0;
        this.startNewRound();
        this.updateUI();
    }
    
    renderHand(container, hand, hideSecondCard = false) {
        container.innerHTML = '';
        
        for (let i = 0; i < hand.cards.length; i++) {
            const card = hand.cards[i];
            
            if (hideSecondCard && i === 1 && !this.gameOver) {
                // Mostrar la segunda carta oculta durante el juego
                const cardEl = document.createElement('div');
                cardEl.className = 'card card-back';
                container.appendChild(cardEl);
            } else {
                const cardEl = document.createElement('div');
                cardEl.className = `card ${card.suit}`;
                
                // Usar entidades HTML para los palos
                let suitSymbol;
                switch(card.suit) {
                    case 'hearts': suitSymbol = '&hearts;'; break;
                    case 'diamonds': suitSymbol = '&diams;'; break;
                    case 'clubs': suitSymbol = '&clubs;'; break;
                    case 'spades': suitSymbol = '&spades;'; break;
                }
                
                cardEl.innerHTML = `
                    <div class="card-top">${card.value}${suitSymbol}</div>
                    <div class="card-value">${card.value}</div>
                    <div class="card-bottom">${card.value}${suitSymbol}</div>
                `;
                
                container.appendChild(cardEl);
            }
        }
    }
    
    updateUI() {
        // Actualizar manos
        this.renderHand(this.playerHandEl, this.playerHand);
        this.renderHand(this.dealerHandEl, this.dealerHand, true);
        
        // Actualizar puntuaciones
        this.playerScoreEl.textContent = `Puntos: ${this.playerHand.score}`;
        
        if (this.gameOver) {
            this.dealerScoreEl.textContent = `Puntos: ${this.dealerHand.score}`;
        } else {
            // Solo mostrar el valor de la primera carta del crupier durante el juego
            const dealerFirstCard = this.dealerHand.cards[0];
            let partialScore = 0;
            
            if (dealerFirstCard.value === 'A') {
                partialScore = 11;
            } else if (['K', 'Q', 'J'].includes(dealerFirstCard.value)) {
                partialScore = 10;
            } else {
                partialScore = parseInt(dealerFirstCard.value);
            }
            
            this.dealerScoreEl.textContent = `Puntos: ${partialScore}+`;
        }
        
        // Actualizar dinero y apuesta
        this.moneyEl.textContent = this.money;
        this.betEl.textContent = this.currentBet;
        
        // Habilitar/deshabilitar botones
        disableButton(this.dealButton, this.currentBet <= 0);
        disableButton(this.doubleButton, this.playerHand.cards.length !== 2 || this.currentBet * 2 > this.money);
        
        // Mostrar u ocultar botones según el estado del juego
        if (this.gameOver) {
            disableButton(this.bet5Button, this.money < 5);
            disableButton(this.bet25Button, this.money < 25);
            disableButton(this.bet50Button, this.money < 50);
            disableButton(this.bet100Button, this.money < 100);
            disableButton(this.bet500Button, this.money < 500);
            disableButton(this.bet666Button, this.money < 666);
            disableButton(this.clearBetButton, this.currentBet === 0);
        } else {
            disableButton(this.bet5Button, true);
            disableButton(this.bet25Button, true);
            disableButton(this.bet50Button, true);
            disableButton(this.bet100Button, true);
            disableButton(this.bet500Button, true);
            disableButton(this.bet666Button, true);
            disableButton(this.clearBetButton, true);
        }
    }
}
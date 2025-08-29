import { getRandomInt } from './Utilidades.js';

// Clase para representar una carta
export class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }
}

// Clase para representar el mazo de cartas
export class Deck {
    constructor() {
        this.cards = [];
        this.createDeck();
    }
    
    createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        this.cards = [];
        
        for (let suit of suits) {
            for (let value of values) {
                this.cards.push(new Card(suit, value));
            }
        }
    }
    
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = getRandomInt(0, i);
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    dealCard() {
        if (this.cards.length === 0) {
            this.createDeck();
            this.shuffle();
        }
        return this.cards.pop();
    }
    
    getRemainingCards() {
        return this.cards.length;
    }
}
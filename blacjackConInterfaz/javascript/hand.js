// Clase para representar una mano de cartas
export class Hand {
    constructor() {
        this.cards = [];
        this.score = 0;
        this.aces = 0;
    }
    
    addCard(card) {
        this.cards.push(card);
        
        // Calcular el valor de la carta
        if (card.value === 'A') {
            this.aces++;
            this.score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            this.score += 10;
        } else {
            this.score += parseInt(card.value);
        }
        
        // Ajustar el valor si hay ases y se ha pasado de 21
        this.adjustForAces();
    }
    
    adjustForAces() {
        while (this.score > 21 && this.aces > 0) {
            this.score -= 10;
            this.aces--;
        }
    }
    
    calculateScore() {
        let score = 0;
        let aces = 0;
        
        for (let card of this.cards) {
            if (card.value === 'A') {
                aces++;
                score += 11;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }
        
        // Ajustar valor de los ases si nos pasamos de 21
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        this.score = score;
        this.aces = aces;
        return score;
    }
    
    clear() {
        this.cards = [];
        this.score = 0;
        this.aces = 0;
    }
    
    hasBlackjack() {
        return this.cards.length === 2 && this.score === 21;
    }
    
    isBusted() {
        return this.score > 21;
    }
}
import random
import os
import time

class Carta:
    def __init__(self, palo, valor):
        self.palo = palo
        self.valor = valor
        
    def __str__(self):
        # Representación visual de las cartas
        figuras = {'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A'}
        valor_str = figuras[self.valor] if self.valor in figuras else str(self.valor)
        
        palos_simbolos = {'Corazones': '♥', 'Diamantes': '♦', 'Tréboles': '♣', 'Picas': '♠'}
        return f"[{valor_str}{palos_simbolos[self.palo]}]"

class Mazo:
    def __init__(self):
        self.cartas = []
        self.crear_mazo()
        
    def crear_mazo(self):
        palos = ['Corazones', 'Diamantes', 'Tréboles', 'Picas']
        valores = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']
        
        for palo in palos:
            for valor in valores:
                self.cartas.append(Carta(palo, valor))
                
    def barajar(self):
        random.shuffle(self.cartas)
        
    def repartir(self):
        return self.cartas.pop()

class Mano:
    def __init__(self):
        self.cartas = []
        self.valor = 0
        self.ases = 0
        
    def agregar_carta(self, carta):
        self.cartas.append(carta)
        
        # Calcular el valor de la carta
        if carta.valor in ['J', 'Q', 'K']:
            self.valor += 10
        elif carta.valor == 'A':
            self.ases += 1
            self.valor += 11
        else:
            self.valor += carta.valor
            
        # Ajustar el valor si hay ases y se ha pasado de 21
        while self.valor > 21 and self.ases > 0:
            self.valor -= 10
            self.ases -= 1
            
    def calcular_valor(self):
        # Recalcular el valor (por si las reglas del As cambiaron)
        valor = 0
        ases = 0
        
        for carta in self.cartas:
            if carta.valor in ['J', 'Q', 'K']:
                valor += 10
            elif carta.valor == 'A':
                ases += 1
                valor += 11
            else:
                valor += carta.valor
                
        while valor > 21 and ases > 0:
            valor -= 10
            ases -= 1
            
        self.valor = valor
        self.ases = ases
        return valor
        
    def mostrar(self, ocultar_primera=False):
        if ocultar_primera:
            print("[??]", end=" ")
            for carta in self.cartas[1:]:
                print(carta, end=" ")
            print(f"(Valor: ??)")
        else:
            for carta in self.cartas:
                print(carta, end=" ")
            print(f"(Valor: {self.valor})")

class Blackjack:
    def __init__(self):
        self.mazo = Mazo()
        self.mazo.barajar()
        self.mano_jugador = Mano()
        self.mano_crupier = Mano()
        self.dinero = 1000
        self.apuesta = 0
        self.juego_terminado = False
        
    def hacer_apuesta(self):
        while True:
            try:
                print(f"\nDinero disponible: ${self.dinero}")
                apuesta = int(input("¿Cuánto quieres apostar? "))
                
                if apuesta <= 0:
                    print("La apuesta debe ser mayor a 0.")
                elif apuesta > self.dinero:
                    print("No tienes suficiente dinero.")
                else:
                    self.apuesta = apuesta
                    self.dinero -= apuesta
                    break
            except ValueError:
                print("Por favor, ingresa un número válido.")
    
    def repartir_cartas_iniciales(self):
        self.mano_jugador = Mano()
        self.mano_crupier = Mano()
        
        # Repartir dos cartas al jugador
        self.mano_jugador.agregar_carta(self.mazo.repartir())
        self.mano_jugador.agregar_carta(self.mazo.repartir())
        
        # Repartir dos cartas al crupier (una oculta)
        self.mano_crupier.agregar_carta(self.mazo.repartir())
        self.mano_crupier.agregar_carta(self.mazo.repartir())
    
    def mostrar_mesas(self, ocultar_crupier=True):
        os.system('cls' if os.name == 'nt' else 'clear')
        print("=" * 50)
        print("BLACKJACK")
        print("=" * 50)
        print(f"Dinero: ${self.dinero} | Apuesta: ${self.apuesta}")
        print("=" * 50)
        
        print("\nMano del Crupier:")
        if ocultar_crupier:
            self.mano_crupier.mostrar(ocultar_primera=True)
        else:
            self.mano_crupier.mostrar()
            
        print("\nTu Mano:")
        self.mano_jugador.mostrar()
        print()
    
    def turno_jugador(self):
        while self.mano_jugador.valor < 21:
            opcion = input("¿Quieres (P)edir, (Q)uedar o (D)oblar? ").lower()
            
            if opcion == 'p':
                self.mano_jugador.agregar_carta(self.mazo.repartir())
                self.mostrar_mesas()
                
                if self.mano_jugador.valor > 21:
                    print("¡Te has pasado de 21! Has perdido.")
                    self.juego_terminado = True
                    return
                    
            elif opcion == 'q':
                break
                
            elif opcion == 'd' and len(self.mano_jugador.cartas) == 2:
                # Doblar apuesta
                if self.dinero >= self.apuesta:
                    self.dinero -= self.apuesta
                    self.apuesta *= 2
                    
                    # El jugador recibe una sola carta adicional
                    self.mano_jugador.agregar_carta(self.mazo.repartir())
                    self.mostrar_mesas()
                    
                    if self.mano_jugador.valor > 21:
                        print("¡Te has pasado de 21! Has perdido.")
                        self.juego_terminado = True
                    return
                else:
                    print("No tienes suficiente dinero para doblar.")
            else:
                print("Opción no válida o no puedes doblar en este momento.")
    
    def turno_crupier(self):
        self.mostrar_mesas(ocultar_crupier=False)
        print("Turno del crupier...")
        time.sleep(1.5)
        
        # El crupier debe pedir cartas hasta tener al menos 17
        while self.mano_crupier.valor < 17:
            self.mano_crupier.agregar_carta(self.mazo.repartir())
            self.mostrar_mesas(ocultar_crupier=False)
            time.sleep(1.5)
            
            if self.mano_crupier.valor > 21:
                print("¡El crupier se ha pasado de 21! ¡Ganas!")
                self.dinero += self.apuesta * 2
                self.juego_terminado = True
                return
    
    def determinar_ganador(self):
        if self.mano_jugador.valor > self.mano_crupier.valor:
            print("¡Felicidades! ¡Has ganado!")
            self.dinero += self.apuesta * 2
        elif self.mano_jugador.valor < self.mano_crupier.valor:
            print("El crupier gana.")
        else:
            print("Es un empate. Recuperas tu apuesta.")
            self.dinero += self.apuesta
    
    def jugar_ronda(self):
        self.juego_terminado = False
        
        # Hacer apuesta
        self.hacer_apuesta()
        
        # Repartir cartas iniciales
        self.repartir_cartas_iniciales()
        
        # Mostrar mesas
        self.mostrar_mesas()
        
        # Verificar si el jugador tiene blackjack natural
        if self.mano_jugador.valor == 21:
            print("¡Blackjack natural!")
            # El crupier muestra su carta oculta
            self.mostrar_mesas(ocultar_crupier=False)
            
            # Verificar si el crupier también tiene blackjack
            if self.mano_crupier.valor == 21:
                print("El crupier también tiene Blackjack. Es un empate.")
                self.dinero += self.apuesta  # Recupera la apuesta
            else:
                print("¡Ganas 3:2!")
                self.dinero += self.apuesta * 2.5  # Pago 3:2
            return
        
        # Turno del jugador
        self.turno_jugador()
        if self.juego_terminado:
            return
        
        # Turno del crupier
        self.turno_crupier()
        if self.juego_terminado:
            return
        
        # Determinar ganador
        self.determinar_ganador()
    
    def jugar(self):
        while self.dinero > 0:
            self.jugar_ronda()
            
            if self.dinero <= 0:
                print("¡Te has quedado sin dinero! Juego terminado.")
                break
                
            continuar = input("\n¿Quieres jugar otra ronda? (s/n): ").lower()
            if continuar != 's':
                print(f"¡Gracias por jugar! Te vas con ${self.dinero}.")
                break
                
            # Si quedan pocas cartas, barajar de nuevo
            if len(self.mazo.cartas) < 15:
                print("Barajando de nuevo...")
                self.mazo = Mazo()
                self.mazo.barajar()
                time.sleep(1)
        else:
            print("¡Te has quedado sin dinero! Juego terminado.")

# Iniciar el juego
if __name__ == "__main__":
    juego = Blackjack()
    juego.jugar()
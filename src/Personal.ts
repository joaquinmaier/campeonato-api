import { Persona } from './Persona';
import { PosicionJugador } from './PosicionJugador';

export class DirectorTecnico extends Persona
{}

export class Jugador extends Persona
{
    private peso: number;
    private altura: number;
    private dorsal: number;
    private posicion: PosicionJugador;

    constructor( nombre: string[], nacionalidad: string, edad: number, peso: number, altura: number, dorsal: number, posicion: PosicionJugador ) {
        super( nombre, nacionalidad, edad );

        this.peso = peso;
        this.altura = altura;
        this.dorsal = dorsal;
        this.posicion = posicion;
    }

    // · Getters ·
    get_dorsal(): number {
        return this.dorsal;
    }

    get_posicion(): PosicionJugador {
        return this.posicion;
    }

    get_peso(): number {
        return this.peso;
    }

    get_altura(): number {
        return this.altura;
    }

    // · Setters ·
    set_dorsal( dorsal: number ) {
        this.dorsal = dorsal;
    }

    set_posicion( posicion: PosicionJugador ) {
        this.posicion = posicion;
    }

    set_peso( peso: number ) {
        this.peso = peso;
    }

    set_altura( altura: number ) {
        this.altura = altura;
    }
}

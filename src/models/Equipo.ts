import { v4 as uuidv4 } from 'uuid';

import { Jugador, DirectorTecnico } from './Personal';
import { Estadio } from './Estadio';

export class Equipo
{
    private id: string;
    private eliminado: boolean;
    private nombre: string;
    private director_tecnico: DirectorTecnico | null;
    private jugadores: Set<Jugador>;
    private estadio: Estadio | null;

    constructor( nombre: string );
    constructor( nombre: string, estadio: Estadio )
    constructor( nombre: string, estadio: Estadio, director_tecnico: DirectorTecnico, jugadores: Set<Jugador> );

    // Common implementation
    constructor( nombre: string, estadio?: Estadio, director_tecnico?: DirectorTecnico, jugadores?: Set<Jugador> ) {
        this.id                 = uuidv4();
        this.eliminado          = false;
        this.nombre             = nombre;
        this.director_tecnico   = director_tecnico ?? null;
        this.jugadores          = jugadores ?? new Set<Jugador>();
        this.estadio            = estadio ?? null;
    }

    find_jugador( id: string ): Jugador | undefined {
        for ( let jugador of this.jugadores ) {
            if ( jugador.get_id() == id ) {
                return jugador;
            }
        }

        return undefined;
    }

    // · Getters ·
    get_eliminado(): boolean {
        return this.eliminado;
    }

    get_nombre(): string {
        return this.nombre;
    }

    get_director_tecnico(): DirectorTecnico | null {
        return this.director_tecnico;
    }

    get_jugadores(): Set<Jugador> {
        return this.jugadores;
    }

    get_estadio(): Estadio | null {
        return this.estadio;
    }

    get_id(): string {
        return this.id;
    }

    // · Setters ·
    set_eliminado( elim: boolean ) {
        this.eliminado = elim;
    }

    set_nombre( nombre: string ) {
        this.nombre = nombre;
    }

    set_director_tecnico( dt: DirectorTecnico | null ) {
        this.director_tecnico = dt;
    }

    set_estadio( estadio: Estadio | null ) {
        this.estadio = estadio;
    }

    add_jugador( jugador: Jugador ) {
        if ( this.jugadores == null ) {
            this.jugadores = new Set<Jugador>();
        }

        if ( this.jugadores.size >= 26 ) {
            throw new RangeError( "Cannot add another player: players array is already at 26" );
        }

        this.jugadores.add( jugador );
    }

    remove_jugador( jugador: Jugador ) {
        if ( this.jugadores == null ) {
            throw new ReferenceError( "Jugadores array is null" );
        }

        if ( this.jugadores.size == 0 ) {
            throw new RangeError( "Jugadores array is empty" );
        }

        this.jugadores.delete( jugador );
    }

    toString(): string {
        return JSON.stringify( this );
    }
}

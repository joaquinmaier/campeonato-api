import { Jugador, DirectorTecnico } from './Personal';
import { Estadio } from './Estadio';

export class Equipo
{
    private eliminado: boolean;
    private nombre: string;
    private escudo: string;                             // Must be an IMG
    private director_tecnico: DirectorTecnico | null;
    private jugadores: Set<Jugador>;
    private estadio: Estadio | null;

    constructor( nombre: string, escudo: string );
    constructor( nombre: string, escudo: string, director_tecnico: DirectorTecnico, jugadores: Set<Jugador>, estadio: Estadio );

    // Common implementation
    constructor( nombre: string, escudo: string, director_tecnico?: DirectorTecnico, jugadores?: Set<Jugador>, estadio?: Estadio ) {
        this.eliminado = false;
        this.nombre = nombre;
        this.escudo = escudo;
        this.director_tecnico = director_tecnico ?? null;
        this.jugadores = jugadores ?? new Set<Jugador>();
        this.estadio = estadio ?? null;
    }

    // · Getters ·
    get_eliminado(): boolean {
        return this.eliminado;
    }

    get_nombre(): string {
        return this.nombre;
    }

    get_escudo() {
        return this.escudo;
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

    // · Setters ·
    set_eliminado( elim: boolean ) {
        this.eliminado = elim;
    }

    set_nombre( nombre: string ) {
        this.nombre = nombre;
    }

    set_director_tecnico( dt: DirectorTecnico ) {
        this.director_tecnico = dt;
    }

    set_estadio( estadio: Estadio ) {
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
}

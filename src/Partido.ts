import { Bracket } from './Bracket';
import { Equipo } from './Equipo';
import { Estadio } from './Estadio';

export class Partido
{
    private pendiente: boolean;
    private parent_bracket: Bracket;
    private resultado: Array<number> | null;
    private penales: Array<boolean> | null;
    private equipo_local: Equipo;
    private equipo_visitante: Equipo;
    private estadio: Estadio | null;

    constructor( parent_bracket: Bracket, local: Equipo, visitante: Equipo ) {
        this.pendiente = true;
        this.parent_bracket = parent_bracket;
        this.resultado = new Array<number>();
        this.penales = null;

        this.equipo_local = local;
        this.equipo_visitante = visitante;

        if ( local.get_estadio() == null ) {
            throw new Error( "Local team's stadium is NULL" );
        }

        this.estadio = local.get_estadio();
    }

    advance_winner() {
        try {
            const winner = this.get_winner();

            if ( winner == undefined ) {
                throw new Error( "Cannot advance winner before it has been defined" );
            }

            this.parent_bracket.set_standing_team( winner );

        } catch ( e ) {
            throw e;
        }
    }

    toString(): string {
        return `Partido: { pendiente: ${this.pendiente ? 'true' : 'false'}, resultado: ${this.resultado == null ? 'null' : this.resultado}, penales: ${this.penales}, equipo_local: ${this.equipo_local.toString()}, equipo_visitante: ${this.equipo_visitante.toString()}, estadio: ${this.estadio ? this.estadio.toString() : 'null' } }`;
    }

    // · Getters ·
    is_pendiente() {
        return this.pendiente;
    }

    get_resultado() {
        return this.resultado;
    }

    get_equipo_local() {
        return this.equipo_local;
    }

    get_equipo_visitante() {
        return this.equipo_visitante;
    }

    get_estadio() {
        if ( this.estadio == null ) {
            throw new Error( "Estadio is NULL" );
        }

        return this.estadio;
    }

    get_parent_bracket() {
        return this.parent_bracket;
    }

    get_winner(): Equipo | undefined {
        if ( this.resultado == null ) {
            return undefined;
        }

        if ( this.resultado[0] > this.resultado[1] ) {
            return this.equipo_local;

        } else if ( this.resultado[1] > this.resultado[0] ) {
            return this.equipo_visitante;

        }

        if ( this.penales == null ) {
            throw new Error( "El resultado es un empate y no se fue a penales" );
        }

        if ( this.penales[0] ) {
            return this.equipo_local;

        } else if ( this.penales[1] ) {
            return this.equipo_visitante;

        }

        // Just in case for some reason none of the above apply
        return undefined;
    }

    // · Setters ·
    set_pendiente( pendiente: boolean ): void {
        this.pendiente = pendiente;
    }

    set_resultado( goles_local: number, goles_visitante: number ) {
        this.resultado = [ goles_local, goles_visitante ];
    }

    set_penales( ganador_local: boolean ) {
        if ( ganador_local ) {
            this.penales = [ true, false ];

        } else {
            this.penales = [ false, true ];

        }
    }
}

import { v4 as uuidv4 } from 'uuid';

import { Equipo } from './Equipo';
import { Partido } from './Partido';
import { Bracket } from './Bracket';
import { bracket_json_replacer } from './utils';

export class Campeonato
{
    private id: string;
    private nombre: string;
    private equipos: Set<Equipo>;
    private bracket: Bracket;
    private remaining_partidos: Set<Partido>;

    constructor();
    constructor( nombre: string );

    constructor( nombre?: string ) {
        this.id                     = uuidv4();
        this.nombre                 = nombre ?? "";
        this.equipos                = new Set<Equipo>();
        this.bracket                = new Bracket();
        this.remaining_partidos     = new Set<Partido>();
    }

    start(): boolean {
        try {
            this.bracket.init( this.equipos );

        } catch ( e ) {
            if ( e instanceof Error ) {
                console.error( e.message );
            }

            return false;
        }

        return true;

    }

    print_bracket() {
        this.bracket.print( 0 );
    }

    print_partidos() {
        console.log( "[" );
        for ( let partido of this.remaining_partidos ) {
            console.log( partido.toString() );
        }
        console.log( "]" );
    }

    calc_next_partidos() {
        // Check each Partido to see if any one of them is still pending
        for ( let partido of this.remaining_partidos ) {
            if ( partido.is_pendiente() ) {
                throw new Error( "Cannot calculate next Partidos while some have yet to be played" );
            }
        }

        // Clear the Set
        for ( let partido_to_delete of this.remaining_partidos ) {
            this.remaining_partidos.delete( partido_to_delete );
        }

        this.bracket.calc_partidos( 0, this.remaining_partidos );
    }

    partidos_to_json_string(): string {
        let index = 0;
        let json_string = "[ ";

        for ( let partido of this.remaining_partidos ) {
            json_string += partido.toString();

            if ( index == this.remaining_partidos.size - 1 ) {
                break;
            }

            json_string += ", ";
            index++;
        }

        json_string += " ]";

        return json_string;
    }

    equipos_to_json_string(): string {
        let index = 0;
        let json_string = "[ ";

        for ( let equipo of this.equipos ) {
            json_string += equipo.toString();

            if ( index == this.equipos.size - 1 ) {
                break;
            }

            json_string += ", ";
            index++;
        }

        json_string += " ]";

        return json_string;
    }

    toJSONString(): string {
        return JSON.stringify( this, bracket_json_replacer );
    }

    get_winner(): Equipo | undefined {
        const winning_team = this.bracket.get_standing_team();

        if ( winning_team == null ) {
            return undefined;
        }

        return winning_team;
    }

    // · Getters ·
    get_equipos(): Set<Equipo> {
        return this.equipos;
    }

    get_bracket(): Bracket {
        return this.bracket;
    }

    get_remaining_partidos(): Set<Partido> {
        return this.remaining_partidos;
    }

    get_id(): string {
        return this.id;
    }

    get_nombre(): string {
        return this.nombre;
    }

    find_partido( id: string ): Partido | undefined {
        for ( let partido of this.remaining_partidos ) {
            if ( partido.get_id() == id ) {
                return partido;

            }
        }

        return undefined;
    }

    find_equipo( id: string ): Equipo | undefined {
        for ( let equipo of this.equipos ) {
            if ( equipo.get_id() == id ) {
                return equipo;
            }
        }

        return undefined;
    }

    // · Setters ·
    add_equipo( equipo: Equipo ) {
        if ( this.equipos.has( equipo ) ) {
            return;
        }

        this.equipos.add( equipo );
    }

    remove_equipo( equipo: Equipo ) {
        if ( !this.equipos.has( equipo ) ) {
            throw new Error( "Attempting to remove equipo that doesn't exist" );
        }

        this.equipos.delete( equipo );
    }

    set_nombre( nombre: string ) {
        this.nombre = nombre;
    }
}

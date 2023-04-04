import { v4 as uuidv4 } from 'uuid';

import { Equipo } from './Equipo';
import { Partido } from './Partido';
import { Bracket } from './Bracket';

export class Campeonato
{
    private id: string;
    private equipos: Set<Equipo>;
    private bracket: Bracket;
    private remaining_partidos: Set<Partido>;

    constructor() {
        this.id                 = uuidv4();
        this.equipos            = new Set<Equipo>();
        this.bracket            = new Bracket();
        this.remaining_partidos = new Set<Partido>();
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
        let json_string = "[ ";

        for ( let partido of this.remaining_partidos ) {
            json_string += partido.toString() + ", ";
        }

        console.log( `\x1b[0;35mPRE-FINISHED JSON:\n${json_string}\x1b[0m` );

        json_string = json_string.replace( /\d\d\d\d$/, '' );       // ! This is not working and causing issues
        json_string += " ]";

        return json_string;
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

    find_partido( id: string ): Partido | undefined {
        for ( let partido of this.remaining_partidos ) {
            if ( partido.get_id() == id ) {
                return partido;

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
}

import { Equipo } from './Equipo';
import { Bracket } from './Bracket';

export class Campeonato
{
    private equipos: Set<Equipo>;
    private bracket: Bracket;

    constructor() {
        this.equipos = new Set<Equipo>();
        this.bracket = new Bracket();
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

    // · Getters ·
    get_equipos(): Set<Equipo> {
        return this.equipos;
    }

    get_bracket(): Bracket {
        return this.bracket;
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

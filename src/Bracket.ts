import { Equipo } from './Equipo';

export class Bracket
{
    private standing_team: Equipo | null;

    private parent: Bracket | null;

    private left_child: Bracket | null;
    private right_child: Bracket | null;

    constructor();
    constructor( parent: Bracket );
    constructor( parent: Bracket, standing_team: Equipo );

    constructor( parent?: Bracket, standing_team?: Equipo ) {
        this.parent = parent ?? null;
        this.standing_team = standing_team ?? null;

        this.left_child = null;
        this.right_child = null;
    }

    init( equipos: Set<Equipo> ): void {
        if ( this.parent != null ) {
            throw new Error( "Bracket is not the first of the tree" );
        }

        if ( equipos.size % 2 != 0 ) {
            throw new Error( "Number of teams is odd" );
        }

        for ( let equipo of equipos ) {
            
        }
    }

    // · Getters ·
    get_standing_team(): Equipo | null {
        return this.standing_team;
    }

    get_parent(): Bracket | null {
        return this.parent;
    }

    get_left_child(): Bracket | null {
        return this.left_child;
    }

    get_right_child(): Bracket | null {
        return this.right_child;
    }

    // · Setters ·
    set_standing_team( equipo: Equipo ) {
        this.standing_team = equipo;
    }

    set_left_child( child: Bracket ) {
        this.left_child = child;
    }

    set_right_child( child: Bracket ) {
        this.right_child = child;
    }
}

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

        const logarithm_of_teams_size = Math.log( equipos.size ) / Math.log( 2 );   // = log_2( equipos.size )

        if ( !Number.isInteger( logarithm_of_teams_size ) ) {
            throw new RangeError( "Number of teams must be an exponent of two." );
        }

        let graph_nodes = new Map<number, Array<Bracket>>();

        // Create a node for each team
        graph_nodes.set( logarithm_of_teams_size, new Array<Bracket>() );
        for ( let equipo of equipos ) {
            let new_node = new Bracket();

            new_node.set_standing_team( equipo );

            graph_nodes.get( logarithm_of_teams_size )?.push( new_node );
        }

        // Go from the bottom to the top, creating a parent for each pair of nodes until we reach level 0
        for ( let curr_level = logarithm_of_teams_size - 1; curr_level > 0; curr_level-- ) {
            graph_nodes.set( curr_level, new Array<Bracket>() );
            const size_of_lower_level   = graph_nodes.get( curr_level + 1 )?.length ?? 0;

            for ( let curr_pair = 0; curr_pair < size_of_lower_level; curr_pair += 2 ) {
                let     new_parent = new Bracket();

                let     left_child = graph_nodes.get( curr_level + 1 )?.find( ( _, index: number ) => index == curr_pair );
                let     right_child = graph_nodes.get( curr_level + 1 )?.find( ( _, index: number ) => index == curr_pair + 1 );

                if ( left_child == undefined || right_child == undefined ) {
                    throw new Error( `Tried to access undefined child node` );
                }

                left_child.set_parent( new_parent );
                right_child.set_parent( new_parent );

                new_parent.set_left_child( left_child );
                new_parent.set_right_child( right_child );

                graph_nodes.get( curr_level )?.push( new_parent );
            }
        }

        let     root_left_child     = graph_nodes.get( 1 )?.find( ( _, index: number ) => index == 0 );
        let     root_right_child    = graph_nodes.get( 1 )?.find( ( _, index:number ) => index == 1 );

        if ( root_left_child == null || root_right_child == null ) {
            console.error( "root children were NULL" );
            return;
        }

        root_left_child.set_parent( this );
        root_right_child.set_parent( this );

        this.left_child = root_left_child;
        this.right_child = root_right_child;
    }

    print( level: number ) {
        console.log( `[${level}] ST: ${this.standing_team?.toString()}` );

        if ( this.left_child != null ) {
            console.log( "\x1b[0;32m<< Left Child:\x1b[0m" );
            this.left_child.print( level + 1 );
        }

        if ( this.right_child != null ) {
            console.log( "\x1b[0;33m>> Right Child:\x1b[0m" );
            this.right_child.print( level + 1 );
        }
    }

    is_leaf(): boolean {
        return this.left_child == null && this.right_child == null;
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

    set_parent( parent: Bracket ) {
        this.parent = parent;
    }

    set_left_child( child: Bracket ) {
        this.left_child = child;
    }

    set_right_child( child: Bracket ) {
        this.right_child = child;
    }
}

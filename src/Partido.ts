import { Equipo } from './Equipo';
import { Estadio } from './Estadio';

export class Partido
{
    private pendiente: boolean;
    private resultado: Array<number> | null;
    private equipo_local: Equipo;
    private equipo_visitante: Equipo;
    private estadio: Estadio | null;

    constructor( local: Equipo, visitante: Equipo ) {
        this.pendiente = true;
        this.resultado = new Array<number>();

        this.equipo_local = local;
        this.equipo_visitante = visitante;

        if ( local.get_estadio() == null ) {
            throw new Error( "Local team's stadium is NULL" );
        }

        this.estadio = local.get_estadio();
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

    // · Setters ·
    set_pendiente( pendiente: boolean ): void {
        this.pendiente = pendiente;
    }

    set_resultado( goles_local: number, goles_visitante: number ) {
        this.resultado = [ goles_local, goles_visitante ];
    }
}

import { v4 as uuidv4 } from 'uuid';

export class Estadio
{
    private id: string;
    private nombre: string;
    private coordenadas: number[];

    constructor( nombre: string, coordenadas: number[] ) {
        this.id             = uuidv4();
        this.nombre         = nombre;
        this.coordenadas    = coordenadas;
    }

    toString(): string {
        return JSON.stringify( this );
    }

    // · Getters ·
    get_id(): string {
        return this.id;
    }

    get_nombre(): string {
        return this.nombre;
    }

    get_coordenadas(): number[] {
        return this.coordenadas;
    }

    // · Setters ·
    set_nombre( new_name: string ): void {
        this.nombre = new_name;
    }

    set_coordenadas( coords: number[] ): void {
        this.coordenadas = coords;
    }
}

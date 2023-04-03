export class Estadio
{
    private nombre: string;
    private coordenadas: number[];

    constructor( nombre: string, coordenadas: number[] ) {
        this.nombre = nombre;
        this.coordenadas = coordenadas;
    }

    toString(): string {
        return `Estadio: { nombre: ${this.nombre}, coordenadas: ${this.coordenadas.toString()} }`
    }

    // · Getters ·
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

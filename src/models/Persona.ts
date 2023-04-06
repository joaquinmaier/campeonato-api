import { v4 as uuidv4 } from 'uuid';

export abstract class Persona
{
    private id: string;
    private nombre: string[];
    private nacionalidad: string;
    private edad: number;

    constructor( nombre: string[], nacionalidad: string, edad: number ) {
        this.id             = uuidv4();
        this.nombre         = nombre;
        this.nacionalidad   = nacionalidad;
        this.edad           = edad;
    }

    // · Getters ·
    get_id(): string {
        return this.id;
    }

    get_nombre(): string[] {
        return this.nombre;
    }

    get_nacionalidad(): string {
        return this.nacionalidad;
    }

    get_edad(): number {
        return this.edad;
    }

    // · Setters ·
    set_nombre( nombre: string[] ) {
        this.nombre = nombre;
    }

    set_edad( edad: number ) {
        this.edad = edad;
    }

    set_nacionalidad( nacionalidad: string ) {
        this.nacionalidad = nacionalidad;
    }
}

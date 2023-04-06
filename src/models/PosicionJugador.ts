export enum PosicionJugador {
    ARQUERO = 1,
    DEFENSOR_CENTRAL,
    LATERAL_IZQUIERDO,
    LATERAL_DERECHO,
    MEDIO_CENTRO,
    MEDIO_CENTRO_DEFENSIVO,
    MEDIO_CENTRO_OFENSIVO,
    MEDIO_IZQUIERDO,
    MEDIO_DERECHO,
    EXTREMO_IZQUIERDO,
    EXTREMO_DERECHO,
    DELANTERO_CENTRO
}

export const string_to_posicion_jugador = ( input: string ): PosicionJugador | null => {
    switch ( input ) {
        case "arquero":
            return PosicionJugador.ARQUERO;

        case "defensor central":
            return PosicionJugador.DEFENSOR_CENTRAL;

        case "lateral izquierdo":
            return PosicionJugador.LATERAL_IZQUIERDO;

        case "lateral derecho":
            return PosicionJugador.LATERAL_DERECHO;

        case "medio centro":
            return PosicionJugador.MEDIO_CENTRO;

        case "medio centro defensivo":
            return PosicionJugador.MEDIO_CENTRO_DEFENSIVO;

        case "medio centro ofensivo":
            return PosicionJugador.MEDIO_CENTRO_OFENSIVO;

        case "medio izquierdo":
            return PosicionJugador.MEDIO_IZQUIERDO;

        case "medio derecho":
            return PosicionJugador.MEDIO_DERECHO;

        case "extremo izquierdo":
            return PosicionJugador.EXTREMO_IZQUIERDO;

        case "extremo derecho":
            return PosicionJugador.EXTREMO_DERECHO;

        case "delantero centro":
            return PosicionJugador.DELANTERO_CENTRO;

        default:
            return null;
    }
};

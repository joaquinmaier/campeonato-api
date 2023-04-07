import { Express, Request, Response, NextFunction } from 'express';

import { campeonatos } from '../index';
import { get_campeonato_by_id } from '../utils';

import { Campeonato } from '../models/Campeonato';
import { Equipo } from '../models/Equipo';
import { Estadio } from '../models/Estadio';
import { Jugador, DirectorTecnico } from '../models/Personal';
import { string_to_posicion_jugador } from '../models/PosicionJugador';

export default {
    showCampeonatos: async ( req: Request, res: Response, next: NextFunction ) => {
        let json_string = "[ ";

        campeonatos.forEach(( campeonato, index ) => {
            json_string += campeonato.toJSONString();

            if ( index != campeonatos.length - 1 ) {
                json_string += ", ";

            }
        });

        json_string += " ]";
        res.json({ campeonatos: JSON.parse(json_string) });
    },

    createEmptyCampeonato: async ( _: any, res: Response, next: NextFunction ) => {
        let new_campeonato = new Campeonato();

        campeonatos.push( new_campeonato );

        res.json({ campeonato_id: new_campeonato.get_id() });
    },

    createCampeonato: async ( req: Request, res: Response, next: NextFunction ) => {
        if ( req.body.nombre != undefined && typeof req.body.nombre != "string" ) {
            res.status( 400 ).json({ err: `Nombre must be of type \"string\", found ${typeof req.body.nombre}` });
            return;
        }

        if ( req.body.autocalc != undefined && typeof req.body.autocalc != "boolean" ) {
            res.status( 400 ).json({ err: `Autocalc must be of type \"boolean\", found ${typeof req.body.nombre}` });
            return;
        }

        const attributes = [ req.body.nombre != undefined, req.body.autocalc != undefined ];

        if ( attributes[0] && attributes[1] ) {
            let new_campeonato = new Campeonato( req.body.nombre, req.body.autocalc );

            campeonatos.push( new_campeonato );

            res.status( 200 ).json({ campeonato: JSON.parse( new_campeonato.toJSONString() ) });

        } else if ( attributes[0] && !attributes[1] ) {
            let new_campeonato = new Campeonato( req.body.nombre );

            campeonatos.push( new_campeonato );

            res.status( 200 ).json({ campeonato: JSON.parse( new_campeonato.toJSONString() ) });

        } else if ( !attributes[0] && attributes[1] ) {
            let new_campeonato = new Campeonato( "", req.body.autocalc );

            campeonatos.push( new_campeonato );

            res.status( 200 ).json({ campeonato: JSON.parse( new_campeonato.toJSONString() ) });

        } else {
            res.status( 400 ).json({ err: "Attempted to create empty Campeonato. If intentional refer to /createEmpty" });

        }
    },

    getDataOfCampeonato: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        res.status( 200 ).json({ campeonato: JSON.parse( campeonato!.toJSONString() ) });
    },

    modifyDataOfCampeonato: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( req.body.nombre != undefined ) {
            campeonato?.set_nombre( req.body.nombre );
        }

        if ( req.body.autocalc != undefined && typeof req.body.autocalc == "boolean" ) {
            campeonato?.set_autocalc( req.body.autocalc );
        }

        res.status( 200 ).json({ campeonato: JSON.parse( campeonato!.toJSONString() ) });
    },

    startCampeonato: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        campeonato?.start();

        campeonato?.calc_next_partidos();

        res.sendStatus( 204 );
    },

    calcNextPartidos: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( campeonato?.is_autocalc_on() ) {
            res.status( 400 ).json({ err: "Campeonato has AUTOCALC on. Partidos will automatically be calculated when the current set is finished" });
            return;
        }

        try {
            campeonato?.calc_next_partidos();

        } catch ( e ) {
            if ( e instanceof Error ) {
                res.status( 400 ).json({ err: e.message });
                return;
            }
        }

        res.sendStatus( 204 );
    },

    getWinnerOfCampeonato: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const winner = campeonato?.get_winner();

        res.status( 200 ).json({ winner: winner == undefined ? null : JSON.parse( winner.toString() ) });
    },

    getEquipos: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        res.status( 200 ).json({ equipos: JSON.parse( campeonato!.equipos_to_json_string() ) });
    },

    getDataOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        res.status( 200 ).json({ equipo: JSON.parse( equipo!.toString() ) });
    },

    modifyDataOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        if ( !!req.body.nombre ) {
            equipo?.set_nombre( req.body.nombre );
        }

        res.status( 200 ).json({ equipo: JSON.parse( equipo!.toString() ) });
    },

    getPartidos: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const json = { partidos: JSON.parse( campeonato!.partidos_to_json_string() ) };
        res.json( json );
    },

    getDataOfPartido: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const partido = campeonato?.find_partido( req.params.id_partido );

        if ( partido == undefined ) {
            res.status( 404 ).json({ err: "Partido with specified ID does not exist" });
            return;
        }

        res.json({ partido: JSON.parse( partido!.toString() ) });
    },

    postResultOfPartido: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const partido = campeonato?.find_partido( req.params.id_partido );

        if ( partido == undefined ) {
            res.status( 404 ).json({ err: "Partido with specified ID does not exist" });
            return;
        }

        const goles_local               = req.body.goles_local;
        const goles_visitante           = req.body.goles_visitante;
        let ganador_local_por_penales   = undefined;

        if ( goles_local == undefined || goles_visitante == undefined ) {
            res.status( 400 ).json({ err: "Number of goals were undefined for at least one of the teams" });
            return;
        }

        if ( goles_local == goles_visitante ) {
            if ( req.body.ganador_penales == undefined ) {
                res.status( 400 ).json({ err: "The result is a tie and the winner by penalties was not specified" });
                return;
            }

            switch ( req.body.ganador_penales ) {
                case "local":
                    ganador_local_por_penales = true;
                    break;

                case "visitante":
                    ganador_local_por_penales = false;
                    break;

                default:
                    res.status( 400 ).json({ err: "The winner by penalties was an invalid value. Valid values are \'local\' or \'visitante\'" });
                    return;
            }
        }

        partido?.set_resultado( goles_local, goles_visitante );

        if ( ganador_local_por_penales != undefined ) {
            partido?.set_penales( ganador_local_por_penales );
        }

        res.status( 200 ).json({ winner: JSON.parse( partido!.get_winner()!.toString() ), modifiable: partido!.is_pendiente() ? true : false });
    },

    commitChangesToPartido: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const partido = campeonato?.find_partido( req.params.id_partido );

        if ( partido == undefined ) {
            res.status( 404 ).json({ err: "Partido with specified ID does not exist" });
            return;
        }

        try {
            const winner = partido?.get_winner();

            if ( winner == undefined ) {
                res.status( 400 ).json({ err: "The winner of the match is yet to be defined" });
                return;
            }

            try {
                partido?.advance_winner();

                campeonato.autocalc_notify();

            } catch ( e ) {
                if ( e instanceof Error ) {
                    res.status( 500 ).json({ err: e.message });
                }
            }

            res.status( 200 ).json({ winner: JSON.parse( winner!.toString() ), modifiable: false });

        } catch ( e ) {
            if ( e instanceof Error ) {
                res.status( 400 ).json({ err: e.message });
                return;
            }
        }
    },

    addEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( req.body.nombre == undefined || typeof req.body.nombre != "string" ) {
            res.status( 400 ).json({ err: "The team's name must be specified" });
            return;
        }

        let new_equipo = new Equipo( req.body.nombre );

        campeonato?.add_equipo( new_equipo );

        res.status( 200 ).json({ equipo: new_equipo });
    },

    deleteEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        if ( campeonato?.has_started() ) {
            res.status( 400 ).json({ err: "Cannot delete Equipo, Campeonato has already started" });
            return;
        }

        campeonato?.get_equipos().delete( equipo! );

        res.sendStatus( 204 );
    },

    getEstadioOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        res.json({ estadio: equipo!.get_estadio() == null ? null : JSON.parse( equipo!.get_estadio()!.toString() ) });
    },

    createEstadioOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( campeonato.has_started() ) {
            res.status( 400 ).json({ err: "Campeonato has already started" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        if ( equipo?.get_estadio() != null ) {
            res.status( 400 ).json({ err: "Equipo already has an Estadio" });
            return;
        }

        if ( req.body.nombre == undefined || typeof req.body.nombre != "string" ) {
            res.status( 400 ).json({ err: "Invalid nombre" });
            return;
        }

        if ( req.body.coordenadas == undefined ) {
            res.status( 400 ).json({ err: "Invalid coordenadas" });
            return;
        }

        equipo.set_estadio( new Estadio( req.body.nombre, req.body.coordenadas ) );

        res.json({ estadio: JSON.parse( JSON.stringify( equipo!.get_estadio()! ) ) });
    },

    modifyEstadioOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( campeonato.has_started() ) {
            res.status( 400 ).json({ err: "Campeonato has already started" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        if ( equipo.get_estadio() == null ) {
            res.status( 400 ).json({ err: "Equipo does not have an Estadio" });
            return;
        }

        if ( req.body.nombre != undefined && typeof req.body.nombre == "string" ) {
            equipo?.get_estadio()?.set_nombre( req.body.nombre );
        }

        if ( req.body.coordenadas != undefined && req.body.coordenadas.isArray() && typeof req.body.coordenadas[0] == "number" ) {
            equipo?.get_estadio()?.set_coordenadas( [ req.body.coordenadas[0], req.body.coordenadas[1] ] );
        }

        res.json({ equipo: JSON.parse( equipo!.toString() ) });
    },

    deleteEstadioOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        if ( campeonato?.has_started() ) {
            res.status( 400 ).json({ err: "Campeonato has already started" });
            return;
        }

        equipo?.set_estadio( null );
        res.sendStatus( 204 );
    },

    getDTOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 400 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 400 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        res.json({ director_tecnico: !!equipo!.get_director_tecnico() ? JSON.parse( JSON.stringify( equipo!.get_director_tecnico()! ) ) : null });
    },

    createDTOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 400 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 400 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        if ( equipo?.get_director_tecnico() != null ) {
            res.status( 400 ).json({ err: "Equipo already has a DirectorTecnico" });
            return;
        }

        if ( req.body.nombre == undefined || typeof req.body.nombre != "object" || typeof req.body.nombre[0] != "string" ) {
            res.status( 400 ).json({ err: "Invalid nombre" });
            return;
        }

        if ( req.body.nacionalidad == undefined || typeof req.body.nacionalidad != "string" ) {
            res.status( 400 ).json({ err: "Invalid nacionalidad" });
            return;
        }

        if ( req.body.edad == undefined || typeof req.body.edad != "number" ) {
            res.status( 400 ).json({ err: "Invalid edad" });
            return;
        }

        equipo?.set_director_tecnico( new DirectorTecnico( req.body.nombre, req.body.nacionalidad, req.body.edad ) );
        res.json({ director_tecnico: JSON.parse( JSON.stringify( equipo!.get_director_tecnico()! ) ) });
    },

    modifyDTOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( campeonato == undefined ) {
            res.status( 400 ).json({ err: "Campeonato has already started" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        const dt = equipo?.get_director_tecnico();

        if ( dt == null ) {
            res.status( 400 ).json({ err: "Equipo doesn't have a DirectorTecnico" });
            return;
        }

        if ( req.body.nombre != undefined ) {
            dt.set_nombre( req.body.nombre );
        }

        if ( req.body.edad != undefined ) {
            dt.set_edad( req.body.edad );
        }

        if ( req.body.nacionalidad != undefined ) {
            dt.set_nacionalidad( req.body.nacionalidad );
        }

        res.json({ director_tecnico: JSON.parse( JSON.stringify( dt ) ) });
    },

    deleteDTOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( campeonato.has_started() ) {
            res.status( 400 ).json({ err: "Campeonato has already started" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        const dt = equipo?.get_director_tecnico();

        if ( dt == null ) {
            res.status( 400 ).json({ err: "Equipo doesn't have a DirectorTecnico" });
            return;
        }

        equipo.set_director_tecnico( null );
        res.sendStatus( 204 );
    },

    getJugadoresOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        res.json({ jugadores: JSON.parse( JSON.stringify( equipo!.get_jugadores() ) ) });
    },

    deleteJugadoresOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( campeonato.has_started() ) {
            res.status( 400 ).json({ err: "Campeonato has already started" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        for ( let jugador of equipo?.get_jugadores() ) {
            equipo?.get_jugadores().delete( jugador );
        }

        res.sendStatus( 204 );
    },

    createJugadorForEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( campeonato.has_started() ) {
            res.status( 400 ).json({ err: "Campeonato has already started" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        if ( req.body.nombre == undefined || req.body.nacionalidad == undefined || req.body.edad == undefined || req.body.peso == undefined || req.body.altura == undefined || req.body.dorsal == undefined || req.body.posicion == undefined ) {
            res.status( 400 ).json({ err: "Missing required parameters" });
            return;
        }


        if ( typeof req.body.nombre != "object" || typeof req.body.nombre[0] != "string" || typeof req.body.nacionalidad != "string" || typeof req.body.edad != "number" || typeof req.body.peso != "number" || typeof req.body.altura != "number" || typeof req.body.dorsal != "number" || typeof req.body.posicion != "string" || string_to_posicion_jugador( req.body.posicion ) == null ) {
            res.status( 400 ).json({ err: "Invalid parameters passed" });
            return;
        }

        let new_jugador = new Jugador( req.body.nombre, req.body.nacionalidad, req.body.edad, req.body.peso, req.body.altura, req.body.dorsal, string_to_posicion_jugador( req.body.posicion )! );

        equipo?.add_jugador( new_jugador );

        res.json({ jugador: JSON.parse( JSON.stringify( new_jugador ) ) });
    },

    getDataOfJugador: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 400 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 400 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        const jugador = equipo?.find_jugador( req.params.id_jugador );

        if ( jugador == undefined ) {
            res.status( 400 ).json({ err: "Jugador with specified ID does not exist" });
            return;
        }

        res.json({ jugador: JSON.parse( JSON.stringify( jugador ) ) });
    },

    modifyJugadorOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 400 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        const jugador = equipo?.find_jugador( req.params.id_jugador );

        if ( jugador == undefined ) {
            res.status( 404 ).json({ err: "Jugador with specified ID does not exist" });
            return;
        }

        if ( req.body.nombre != undefined && typeof req.body.nombre == "object" && typeof req.body.nombre[0] == "string" ) {
            jugador.set_nombre( req.body.nombre );
        }

        if ( req.body.nacionalidad != undefined && typeof req.body.nacionalidad == "string" ) {
            jugador.set_nacionalidad( req.body.nacionalidad );
        }

        if ( req.body.edad != undefined && typeof req.body.edad == "number" ) {
            jugador.set_edad( req.body.edad );
        }

        if ( req.body.peso != undefined && typeof req.body.peso == "number" ) {
            jugador.set_peso( req.body.peso );
        }

        if ( req.body.altura != undefined && typeof req.body.altura == "number" ) {
            jugador.set_altura( req.body.altura );
        }

        if ( req.body.dorsal != undefined && typeof req.body.dorsal == "number" ) {
            jugador.set_dorsal( req.body.dorsal );
        }

        if ( req.body.posicion != undefined && typeof req.body.posicion == "string" && string_to_posicion_jugador( req.body.posicion ) != null ) {
            jugador.set_dorsal( string_to_posicion_jugador( req.body.posicion )! );
        }

        res.json({ jugador: JSON.parse( JSON.stringify( jugador ) ) });
    },

    deleteJugadorOfEquipo: async ( req: Request, res: Response ) => {
        const campeonato = get_campeonato_by_id( req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        if ( campeonato.has_started() ) {
            res.status( 400 ).json({ err: "Campeonato has already started" });
            return;
        }

        const equipo = campeonato?.find_equipo( req.params.id_equipo );

        if ( equipo == undefined ) {
            res.status( 404 ).json({ err: "Equipo with specified ID does not exist" });
            return;
        }

        const jugador = equipo?.find_jugador( req.params.id_jugador );

        if ( jugador == undefined ) {
            res.status( 404 ).json({ err: "Jugador with specified ID does not exist" });
            return;
        }

        equipo?.get_jugadores().delete( jugador );

        res.sendStatus( 204 );
    },

}

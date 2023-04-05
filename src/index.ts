import express from 'express';
import body_parser from 'body-parser';

import { Estadio } from './Estadio';
import { Equipo } from './Equipo';
import { Campeonato } from './Campeonato';

const PORT = 8080;
const app = express();

let campeonatos = new Array<Campeonato>();

const init_test_campeonato = (): Campeonato => {
    let campeonato = new Campeonato();

    campeonato.add_equipo( new Equipo( "E1", new Estadio( "E1S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E2", new Estadio( "E2S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E3", new Estadio( "E3S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E4", new Estadio( "E4S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E5", new Estadio( "E5S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E6", new Estadio( "E6S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E7", new Estadio( "E7S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E8", new Estadio( "E8S", [40.41275, 74.01338] ) ) );

    return campeonato;
}

app.use( body_parser.json() );

app.get('/', ( _, res ) => {
    res.status( 200 ).end( "ONLINE" );
});

app.post('/campeonatos/createEmpty', async ( _, res ) => {
    let new_campeonato = new Campeonato();

    campeonatos.push( new_campeonato );

    res.json({ campeonato_id: new_campeonato.get_id() });
});

app.post('/campeonatos/create', async ( req, res ) => {
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
});

app.get('/createCFT', async ( _, res ) => {
    let new_campeonato = init_test_campeonato();

    campeonatos.push( new_campeonato );

    res.json({ campeonato_id: new_campeonato.get_id() });
});

app.get('/campeonatos', async ( req, res ) => {
    let json_string = "[ ";

    campeonatos.forEach(( campeonato, index ) => {
        json_string += campeonato.toJSONString();

        if ( index != campeonatos.length - 1 ) {
            json_string += ", ";

        }
    });

    json_string += " ]";
    res.json({ campeonatos: JSON.parse(json_string) });
});

app.route( '/campeonatos/:id_campeonato' )
    .get( async ( req, res ) => {
        const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

        if ( campeonato == undefined ) {
            res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
            return;
        }

        res.status( 200 ).json({ campeonato: JSON.parse( campeonato!.toJSONString() ) });
    } )
    .patch( async ( req, res ) => {
        const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

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
    }
);

app.get('/campeonatos/:id_campeonato/winner', async ( req, res ) => {
    const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

    if ( campeonato == undefined ) {
        res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
        return;
    }

    const winner = campeonato?.get_winner();

    res.status( 200 ).json({ winner: winner == undefined ? null : JSON.parse( winner.toString() ) });
});

app.get('/campeonatos/:id_campeonato/equipos', async ( req, res ) => {
    const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

    if ( campeonato == undefined ) {
        res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
        return;
    }

    res.status( 200 ).json({ equipos: JSON.parse( campeonato!.equipos_to_json_string() ) });
});

app.route('/campeonatos/:id_campeonato/equipos/:id_equipo')
    .get( async ( req, res ) => {
        const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

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
    } )
    .patch( async ( req, res ) => {
        const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

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
    }
);

app.post('/campeonatos/:id_campeonato/start', async ( req, res ) => {
    const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

    if ( campeonato == undefined ) {
        res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
        return;
    }

    campeonato?.start();

    campeonato?.calc_next_partidos();

    res.status( 204 ).end( "OK" );
});

app.post('/campeonatos/:id_campeonato/calculatePartidos', async ( req, res ) => {
    const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

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
});

app.get('/campeonatos/:id_campeonato/partidos', async ( req, res ) => {
    const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

    if ( campeonato == undefined ) {
        res.status( 404 ).json({ err: "Campeonato with specified ID does not exist" });
        return;
    }

    const json = { partidos: JSON.parse( campeonato!.partidos_to_json_string() ) };
    res.json( json );
});

app.route('/campeonatos/:id_campeonato/partidos/:id_partido')
    .get( async ( req, res ) => {
        const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

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
    } )
    .post( async ( req, res ) => {
        const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

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
    }
);

app.post('/campeonatos/:id_campeonato/partidos/:id_partido/commit', async ( req, res ) => {
    const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

    if ( campeonato == undefined ) {
        res.status( 400 ).json({ err: "Campeonato with specified ID does not exist" });
        return;
    }

    const partido = campeonato?.find_partido( req.params.id_partido );

    if ( partido == undefined ) {
        res.status( 400 ).json({ err: "Partido with specified ID does not exist" });
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
        }
    }
});

// ! Test only endpoints, delete before going to production
app.get('/testBracket', async ( req, res ) => {
    let campeonato = init_test_campeonato();
    const result = campeonato.start();

    if ( !result ) {
        res.sendStatus( 500 );

    } else {
        res.sendStatus( 200 );

    }
});

app.get('/testPartidos', async ( req, res ) => {
    let campeonato = init_test_campeonato();
    const result = campeonato.start();

    if ( !result ) {
        res.sendStatus( 500 );
    }

    campeonato.calc_next_partidos();

    console.log( "\x1b[0;34m-- Partidos:\x1b[0m" );
    campeonato.print_partidos();

    console.log( "\x1b[0;35m++ Brackets:\x1b[0m" );
    campeonato.print_bracket();

    res.sendStatus( 200 );
})

app.post('/printBracket', async ( req, res ) => {
    let campeonato = campeonatos.find( (value) => value.get_id() == req.body.id_campeonato );

    if ( campeonato == undefined ) {
        res.status( 400 ).json({ err: "Campeonato does not exist" });
        return;
    }

    campeonato?.print_bracket();

    res.sendStatus( 200 );
});

app.listen(8080, () => {
    console.log( `Now listening on port ${PORT}` );
});

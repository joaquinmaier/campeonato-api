import express from 'express';

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

app.get('/', ( _, res ) => {
    res.status( 200 ).end( "ONLINE" );
});

app.get('/createCampeonato', async ( _, res ) => {
    let new_campeonato = new Campeonato();

    campeonatos.push( new_campeonato );

    res.json({ result: "OK", campeonato_id: new_campeonato.get_id() });
});

app.get('/createCFT', async ( _, res ) => {
    let new_campeonato = init_test_campeonato();

    campeonatos.push( new_campeonato );

    res.json({ result: "OK", campeonato_id: new_campeonato.get_id() });
});

app.get('/campeonatos/:id_campeonato/start', async ( req, res ) => {
    const campeonato = campeonatos.find( (value) => value.get_id() == req.params.id_campeonato );

    if ( campeonato == undefined ) {
        res.json({ result: "err", err: "Campeonato with specified ID does not exist" });
    }

    campeonato?.start();
    campeonato?.print_bracket();

    campeonato?.calc_next_partidos();
    campeonato?.print_partidos();

    res.json({ result: "OK" });
});

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

app.get('/printBracket', async ( req, res ) => {
    let campeonato = init_test_campeonato();

    campeonato.start();
    campeonato.print_bracket();

    res.sendStatus( 200 );
});

app.listen(8080, () => {
    console.log( `Now listening on port ${PORT}` );
});

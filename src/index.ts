import express from 'express';

import { Estadio } from './Estadio';
import { Equipo } from './Equipo';
import { Campeonato } from './Campeonato';

const PORT = 8080;
const app = express();

const init_test_campeonato = (): Campeonato => {
    let campeonato = new Campeonato();

    campeonato.add_equipo( new Equipo( "E1", "bruh", new Estadio( "E1S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E2", "bruh", new Estadio( "E2S", [40.41275, 74.01338] ) ) ); 
    campeonato.add_equipo( new Equipo( "E3", "bruh", new Estadio( "E3S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E4", "bruh", new Estadio( "E4S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E5", "bruh", new Estadio( "E5S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E6", "bruh", new Estadio( "E6S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E7", "bruh", new Estadio( "E7S", [40.41275, 74.01338] ) ) );
    campeonato.add_equipo( new Equipo( "E8", "bruh", new Estadio( "E8S", [40.41275, 74.01338] ) ) );

    return campeonato;
}

app.get('/', ( req, res ) => {
    res.status( 200 ).end( "ONLINE" );
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

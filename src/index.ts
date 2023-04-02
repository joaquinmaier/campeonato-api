import express from 'express';

import { Estadio } from './Estadio';
import { Equipo } from './Equipo';
import { Campeonato } from './Campeonato';

const PORT = 8080;
const app = express();

const init_test_campeonato = (): Campeonato => {
    let campeonato = new Campeonato();

    campeonato.add_equipo( new Equipo( "E1", "bruh", new Estadio( "E1S", [2.034567, -12.2456] ) ) );
    campeonato.add_equipo( new Equipo( "E2", "bruh", new Estadio( "E2S", [2.034567, -12.2456] ) ) );
    campeonato.add_equipo( new Equipo( "E3", "bruh", new Estadio( "E3S", [2.034567, -12.2456] ) ) );
    campeonato.add_equipo( new Equipo( "E4", "bruh", new Estadio( "E4S", [2.034567, -12.2456] ) ) );
    campeonato.add_equipo( new Equipo( "E5", "bruh", new Estadio( "E5S", [2.034567, -12.2456] ) ) );
    campeonato.add_equipo( new Equipo( "E6", "bruh", new Estadio( "E6S", [2.034567, -12.2456] ) ) );
    campeonato.add_equipo( new Equipo( "E7", "bruh", new Estadio( "E7S", [2.034567, -12.2456] ) ) );
    campeonato.add_equipo( new Equipo( "E8", "bruh", new Estadio( "E8S", [2.034567, -12.2456] ) ) );

    return campeonato;
}

app.get('/', ( req, res ) => {
    res.status( 200 ).end( "ONLINE" );
});

app.get('/testBracket', async ( req, res ) => {
    let campeonato = init_test_campeonato();
    const result = await campeonato.start();

    if ( !result ) {
        res.sendStatus( 500 );

    } else {
        res.sendStatus( 200 );

    }
});

app.get('/printBracket', async ( req, res ) => {
    let campeonato = init_test_campeonato();

    await campeonato.start();
    await campeonato.print_bracket();

    res.sendStatus( 200 );
});

app.listen(8080, () => {
    console.log( `Now listening on port ${PORT}` );
});

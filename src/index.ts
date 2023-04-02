import express from 'express';

import { Equipo } from './Equipo';
import { Campeonato } from './Campeonato';

const PORT = 8080;
const app = express();

const init_test_campeonato = (): Campeonato => {
    let campeonato = new Campeonato();

    campeonato.add_equipo( new Equipo( "E1", "bruh" ) );
    campeonato.add_equipo( new Equipo( "E2", "bruh" ) );
    campeonato.add_equipo( new Equipo( "E3", "bruh" ) );
    campeonato.add_equipo( new Equipo( "E4", "bruh" ) );
    campeonato.add_equipo( new Equipo( "E5", "bruh" ) );
    campeonato.add_equipo( new Equipo( "E6", "bruh" ) );
    campeonato.add_equipo( new Equipo( "E7", "bruh" ) );
    campeonato.add_equipo( new Equipo( "E8", "bruh" ) );

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

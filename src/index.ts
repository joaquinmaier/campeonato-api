import express from 'express';
import body_parser from 'body-parser';

import campeonato_routes from './routes/campeonatos';

import { Estadio } from './models/Estadio';
import { Equipo } from './models/Equipo';
import { Campeonato } from './models/Campeonato';

const PORT = 8080;
const app = express();

export let campeonatos = new Array<Campeonato>();

export const init_test_campeonato = (): Campeonato => {
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
333
app.use( '/campeonatos', campeonato_routes );

app.listen(8080, () => {
    console.log( `Now listening on port ${PORT}` );
});


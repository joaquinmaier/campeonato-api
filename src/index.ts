import express from 'express';
import body_parser from 'body-parser';
import swagger_ui from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

import campeonato_routes from './routes/campeonatos';
import default_routes from './routes/routes';

import { Estadio } from './models/Estadio';
import { Equipo } from './models/Equipo';
import { Campeonato } from './models/Campeonato';

const PORT = 8080;
const app = express();

const swagger_config = fs.readFileSync( './swagger.yaml', 'utf8' );

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
app.use( '/campeonatos', campeonato_routes );
app.use( '/docs', swagger_ui.serve, swagger_ui.setup( YAML.parse( swagger_config ) ) );
app.use( '/', default_routes );

app.listen(8080, () => {
    console.log( `Now listening on port ${PORT}` );
});


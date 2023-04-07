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

export const remove_campeonato = ( id: string ) => {
    campeonatos = campeonatos.filter( (value) => value.get_id() != id );
};

app.use( body_parser.json() );
app.use( '/campeonatos', campeonato_routes );
app.use( '/docs', swagger_ui.serve, swagger_ui.setup( YAML.parse( swagger_config ) ) );
app.use( '/', default_routes );

app.listen(8080, () => {
    console.log( `Now listening on port ${PORT}` );
});


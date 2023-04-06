import express from 'express';

import controllers from '../controllers/campeonatos';

const router = express.Router();

router.get( '/', controllers.showCampeonatos );

router.post( '/createEmpty', controllers.createEmptyCampeonato );

router.post( '/create', controllers.createCampeonato );

router.route( '/:id_campeonato' )
    .get( controllers.getDataOfCampeonato )
    .patch( controllers.modifyDataOfCampeonato );

router.post( '/:id_campeonato/start', controllers.startCampeonato );

router.post( '/:id_campeonato/calculatePartidos', controllers.calcNextPartidos );

router.get( '/:id_campeonato/winner', controllers.getWinnerOfCampeonato );

router.get( '/:id_campeonato/equipos', controllers.getEquipos );

router.route( '/:id_campeonato/equipos/:id_equipo' )
    .get( controllers.getDataOfEquipo )
    .patch( controllers.modifyDataOfEquipo );

router.get( '/:id_campeonato/partidos', controllers.getPartidos );

router.route( '/:id_campeonato/partidos/:id_partido' )
    .get( controllers.getDataOfPartido )
    .post( controllers.postResultOfPartido );

router.post( '/:id_campeonato/partidos/:id_partido/commit', controllers.commitChangesToPartido );

export default router;

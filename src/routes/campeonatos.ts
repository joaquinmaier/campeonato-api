import express from 'express';

import controllers from '../controllers/campeonatos';

const router = express.Router();

router.get( '/', controllers.showCampeonatos );

// ! Creation / Addition
router.post( '/createEmpty', controllers.createEmptyCampeonato );

router.post( '/create', controllers.createCampeonato );

router.route( '/:id_campeonato' )
    .get( controllers.getDataOfCampeonato )
    .patch( controllers.modifyDataOfCampeonato );

router.post( '/:id_campeonato/start', controllers.startCampeonato );

router.post( '/:id_campeonato/calculatePartidos', controllers.calcNextPartidos );

router.get( '/:id_campeonato/winner', controllers.getWinnerOfCampeonato );

// ! Equipos
router.get( '/:id_campeonato/equipos', controllers.getEquipos );

router.post( '/:id_campeonato/equipos/add', controllers.addEquipo );

router.route( '/:id_campeonato/equipos/:id_equipo' )
    .get( controllers.getDataOfEquipo )
    .patch( controllers.modifyDataOfEquipo )
    .delete( controllers.deleteEquipo );

// Estadio
router.route( '/:id_campeonato/equipos/:id_equipo/estadio' )
    .get( controllers.getEstadioOfEquipo )
    .post( controllers.createEstadioOfEquipo )
    .patch( controllers.modifyEstadioOfEquipo )
    .delete( controllers.deleteEstadioOfEquipo );

// Director Tecnico
router.route( '/:id_campeonato/equipos/:id_equipo/directorTecnico' )
    .get( controllers.getDTOfEquipo )
    .post( controllers.createDTOfEquipo )
    .patch( controllers.modifyDTOfEquipo )
    .delete( controllers.deleteDTOfEquipo );

// Jugadores
router.route( '/:id_campeonato/equipos/:id_equipo/jugadores' )
    .get( controllers.getJugadoresOfEquipo )
    .delete( controllers.deleteJugadoresOfEquipo );

router.post( '/:id_campeonato/equipos/:id_equipo/jugadores/add', controllers.createJugadorForEquipo );

router.route( '/:id_campeonato/equipos/:id_equipo/jugadores/:id_jugador' )
    .get( controllers.getDataOfJugador )
    .patch( controllers.modifyJugadorOfEquipo )
    .delete( controllers.deleteJugadorOfEquipo );

// ! Partidos
router.get( '/:id_campeonato/partidos', controllers.getPartidos );

router.route( '/:id_campeonato/partidos/:id_partido' )
    .get( controllers.getDataOfPartido )
    .post( controllers.postResultOfPartido );

router.post( '/:id_campeonato/partidos/:id_partido/commit', controllers.commitChangesToPartido );

export default router;

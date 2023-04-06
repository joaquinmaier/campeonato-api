import express from 'express';

import { campeonatos, init_test_campeonato } from '../index';

const   router  = express.Router();

router.get('/', async ( _, res ) => res.status( 200 ).end( "ONLINE" ) );

// ! Test only endpoints, delete before going to production
router.get('/createCFT', async ( _, res ) => {
    let new_campeonato = init_test_campeonato();

    campeonatos.push( new_campeonato );

    res.json({ campeonato_id: new_campeonato.get_id() });
});

router.post('/printBracket', async ( req, res ) => {
    let campeonato = campeonatos.find( (value) => value.get_id() == req.body.id_campeonato );

    if ( campeonato == undefined ) {
        res.status( 400 ).json({ err: "Campeonato does not exist" });
        return;
    }

    campeonato?.print_bracket();

    res.sendStatus( 200 );
});

export default router;

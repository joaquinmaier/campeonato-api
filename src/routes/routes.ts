import express from 'express';

import { campeonatos } from '../index';

const   router  = express.Router();

/**
 * Prints a simple **ONLINE** message.
 */
router.get('/', async ( _, res ) => res.status( 200 ).end( "ONLINE" ) );

export default router;

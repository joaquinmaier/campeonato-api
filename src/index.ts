import express from 'express';

const PORT = 8080;
const app = express();

app.get('/', ( req, res ) => {
    res.status( 200 ).end( "ONLINE" );
});

app.listen(8080, () => {
    console.log( `Now listening on port ${PORT}` );
});

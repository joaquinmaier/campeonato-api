import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';

const swaggerDefinition: OAS3Definition = {
    openapi: "3.0.0",
    info: {
        title: "My Dogshit API's Documentation",
        description: "Campeonato be like zzz",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:8080",
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemes: {},
    }
};

const swaggerOptions: OAS3Options = {
    swaggerDefinition,
    apis: [ "./src/routes/*.ts" ]
};

export default swaggerJSDoc( swaggerOptions );

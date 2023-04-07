import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';

const swaggerDefinition: OAS3Definition = {
    openapi: "3.0.3",
    info: {
        title: "campeonato-api",
        description: "A simple API to create and manage football _(also called soccer)_ championships.",
        version: "1.0.0",
        license: {
            name: "GNU GPLv3",
            url: "https://www.gnu.org/licenses/gpl-3.0.html",
        },
    },
    servers: [
        {
            url: "http://localhost:8080",
        }
    ],
    components: {
        schemes: {},
    },
    paths: {
        "/": {
            get: {
                description: "Returns a simple **ONLINE** message",
                responses: {
                    200: {
                        description: "The string \"ONLINE\"",
                        content: {
                        },
                    },
                },
            },
        },
    },
};

const swaggerOptions: OAS3Options = {
    swaggerDefinition,
    apis: [ "./src/routes/*.ts" ]
};

export default swaggerJSDoc( swaggerOptions );

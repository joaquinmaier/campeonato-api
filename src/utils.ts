import { campeonatos } from './index';

// Simple function that allows us to ommit printing Bracket attributes when using JSON.stringify.
export const bracket_json_replacer = ( key: string, value: any ) => {
    if ( key.match( /bracket/ ) ) return undefined;
    else return value;
};

export const get_campeonato_by_id = ( id: string ) => {
    return campeonatos.find( (value) => value.get_id() == id );
};

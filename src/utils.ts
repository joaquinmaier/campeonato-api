// Simple function that allows us to ommit printing Bracket attributes when using JSON.stringify.
export const bracket_json_replacer = ( key: string, value: any ) => {
    if ( key.match( /bracket/ ) ) return undefined;
    else return value;
};
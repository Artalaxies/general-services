/* eslint-disable new-cap */
/* eslint-disable max-len */

const Mockingbird = ( f ) => f( f );
const For = (f) => Mockingbird( ( m ) => ( a ) => f( m( m ) )( a ) );
const Func = ( f ) => ( {x, y} ) => ( y === 1000 ? {x, y} : f({x: x * 2, y: y + 1}));
const result = For( Func )( {x: 1, y: 0} );

console.log(result);

<script>
	/**
	 * REQUIRED IMPORTS
	 */
	import { createEventDispatcher, 
		onMount, 
		onDestroy,
		afterUpdate,
		beforeUpdate 
	} from 'svelte';
    const topojson = require('topojson');
    import { json } from 'd3-fetch';
    import { 
		geoOrthographic,
		geoMercator,
		geoPath,
		geoCircle,
		geoDistance
	} from 'd3-geo';
	import { 
		roundRect,
		detectCircularCollision
	} from './../helpers/canvas';


	/**
	 * PROPS
	 */
	export let mapUrl = null;
	export let dataUrl = null;
	export let mapCollection = 'collection';
	export let width = 900;
	export let height = 600;
	export let margin = {
		left: 10,
		right: 10,
		top: 10,
		bottom: 10
	}
	
	/**
	 * STATE
	 */
	let map = {};
	let mapData = [];
	let sphere = {type: "Sphere" }
	let rotationPosition = 0;
	let rotationMultiplier = 0.1;
	let rotationInterval;
	/**
	 * REFS
	 */
	let canvas;
	/**
	 * REACTIVE
	 */
	$: graphWidth = width - margin.left - margin.right;
	$: graphHeight = height - margin.top - margin.bottom;
	
	$: projection = geoOrthographic()
		.fitExtent( [ 
			[ margin.left, margin.top ],
			[ graphWidth, graphHeight ]
		], map );

	$: mapPath = geoPath()
		.projection( projection )

	$: positionPath = geoCircle()
		.radius( 1.5 )
	
	const getMap = () => {
		return new Promise( ( resolve, reject ) => {
			if( mapUrl === null ){
				reject( "No map file to display" )
			}
			json( mapUrl )
				.then( ( data ) => {
					map = topojson.feature( data, data.objects[ mapCollection ] )
					resolve( data )
				} )
				.catch( ( err ) => {
					reject( err )
				})
		} );
	}

	const drawMap = () => {
		return new Promise( ( resolve, reject ) => {
			try{
				const context = canvas.getContext( "2d" );
				projection.rotate( [rotationPosition*rotationMultiplier, -5, 0])
				
				mapPath.context( context );

				context.beginPath();
				mapPath( sphere );
				context.fillStyle = "#F0EDEB"
				context.fill();
				
				context.beginPath()
				mapPath( map )
				context.strokeStyle = "#737474"
				context.strokeWidth = 0.5
				context.fillStyle = "#969593"
				context.stroke();
				context.fill();

				resolve( map )
			} catch ( err ){
				reject( err )
			}
			
		} )
	}

	function rotateMap(){
		const context = canvas.getContext( "2d" );
		mapPath.context( context );

		function rotationStep( t ){
			rotationPosition += 1
			projection.rotate( [rotationPosition*rotationMultiplier, -5, 0])
			
			context.clearRect(0, 0, width, height )

			context.beginPath();
			mapPath( sphere );
			context.fillStyle = "#F0EDEB"
			context.fill();

			context.beginPath()
			mapPath( map )
			context.strokeStyle = "#737474"
			context.strokeWidth = 0.5
			context.fillStyle = "#969593"
			context.stroke();
			context.fill();

			drawData();

			rotationInterval = window.requestAnimationFrame( rotationStep )
		}

		rotationInterval = window.requestAnimationFrame( rotationStep )
	}

	const getData = () => {
		return new Promise( ( resolve, reject ) => {
			if( dataUrl === null ){
				resolve()
			}
			return json( dataUrl )
				.then( ( data ) => {
					mapData = prepareData( data )
					
					drawData();
					resolve( data )
				})
				.catch( (err) => {
					reject( err )
				})
		} );
	}

	const prepareData = ( raw_data ) => {
		let result

		// Sort according to longitude position from east to west
		result = raw_data.sort( ( a, b ) => {
			if( a[ 'long' ] === b[ 'long' ] ) return 0;

			return a[ 'long' ] > b[ 'long' ] ? -1 : 1
		} )

		// Setup start x and y values
		result.forEach( d => {
			let pos = projection( [ d[ 'long' ], d[ 'lat' ] ])
			d.x = pos[ 0 ]
			d.y = pos[ 1 ]
		})

		// Check for possible collisions and indicate this
		result.forEach( ( d, i ) => {
			d.lower = result.filter( ( dd, j ) =>  i !== j )
				.some( dd => {
					if( dd.lat > d.lat ){
						return detectCircularCollision( d, dd, 20 )
					}
					return false
				})

		} )
	
		return result;
	}

	const drawData = () => {
		const context = canvas.getContext( "2d" );
		
		mapData.forEach( location => {
			let position = projection( [ location[ "long" ], location[ "lat" ] ] )

			context.globalAlpha = 0.8;
			context.beginPath()
			mapPath( positionPath.center( [location["long"], location["lat"] ] )() );
			context.fillStyle = "#33655F"
			context.strokeStyle = "#33655F"
			context.fill()
			context.globalAlpha = 1;
			
			// Labels are not set as GeoJSON so have to manually obtain 
			// the distance to the center in order to hide labels when on the back
			let centerLocation = projection.invert( [width/2, height/2 ] )

			// Get great arc distance in radians
			let locationDistance = geoDistance( [ location["long"], location["lat"] ], centerLocation );
			
			// If the point is within a quarter circle from the center
			if(locationDistance < 1.55 ){
				context.textAlign = "start";
				let lineDisplacement = 25
				let labelDisplacement = lineDisplacement + 10
				
				if( position[ 0 ] < width/2 ){
					lineDisplacement = -1 * lineDisplacement
					labelDisplacement = -1 * labelDisplacement
					context.textAlign = "end";
				}

				let textY = position[1];
				let textX = position[0];

				if( location.lower ){
					textY = position[1] + 20
				}

				context.moveTo( position[0], position[1] )
				context.lineTo( position[0] + lineDisplacement, textY )
				context.stroke();

				context.beginPath()
				context.arc( position[0] + lineDisplacement, textY, 3, 0, Math.PI*2 )
				context.fill();

				context.font = "10px Lato";

				let textDimension =  context.measureText( location["label"] );

				let textWidth = textDimension.width;
						let textHeight = textDimension.actualBoundingBoxAscent + textDimension.actualBoundingBoxDescent + 10;

				context.globalAlpha = 0.9;
				if( lineDisplacement < 0 ){
					roundRect( context, 
						position[ 0 ] + lineDisplacement - (textWidth + 15),
						textY - 0.5 * textHeight, 
						textWidth + 10, 
						textHeight, 
						5, 
						"#33655F"
					)
				} else {
					roundRect( context, 
						position[ 0 ] + lineDisplacement + 5,
						textY - 0.5 * textHeight, 
						textWidth + 10, 
						textHeight, 
						5, 
						"#33655F"
					)
				}
				context.globalAlpha = 1;

				// Might want to make adjustments to the positions eventually
				let yPos = Math.floor( textY );
				let xPos = Math.floor( position[ 0 ] ) + labelDisplacement;
				context.fillStyle = "#ECECEC";
				context.fillText( location[ "label" ], xPos, yPos + 4 )
			}
			
		})
		
	}

	const loadingPromise = () => {
		return getMap()
			.then( drawMap )
			.then( getData )
			.then( rotateMap )
			.catch( err => {
				console.log( err )
			})
	}

	onMount( loadingPromise );
	onDestroy( () => window.cancelAnimationFrame( rotationInterval ) ); 
	
	beforeUpdate( () => {
		window.cancelAnimationFrame( rotationInterval );
	} )

	afterUpdate( () => {
		drawMap()
			.then( rotateMap )
	} )

</script>

<style>

</style>


<canvas width={ width } height={ height} bind:this={ canvas }>

</canvas>
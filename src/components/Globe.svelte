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
	import {
		fade
	} from 'svelte/transition';
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
		detectCircularCollision,
		detectBoxCollision,
		getNearestNeighbor,
		getNearestNeighborOnTop,
		getMousePosition,
		Label,
	} from './../helpers/canvas';
	import {
		eulerAngles
	} from './../helpers/maps';
	import {
		select
	} from 'd3-selection'
	import CloseButton from './CloseButton.svelte'
	import InfoList from './InfoList.svelte'


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
	export let color = "#33655F";
	
	/**
	 * STATE
	 */
	let map = {};
	let mapData = [];
	let sphere = {type: "Sphere" }
	let rotationPosition = [0, -5, 0];
	let rotationMultiplier = 0.15;
	let rotationInterval;
	let isRotating = true;
	let locationSelected = null;

	const lineDisplacement = 15
	const labelDisplacement = 10 + lineDisplacement
	const lowerDisplacement = 20

	let dragPosition = [0, 0];
	let touchStarted;
	/**
	 * REFS
	 */
	let canvas, overlay;
	
	/**
	 * STYLING
	 */
	$: overlayStyle = `width: ${width}px; height: ${height}px;`
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
		const context = canvas.getContext( "2d" );
		
		return new Promise( ( resolve, reject ) => {
			try{
				projection.rotate( rotationPosition )
				
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

	function drawRotation( context ){		 
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
	}

	function animateRotation( context ){
		// Set rotation postion 
		rotationPosition[0] += ( 1 * rotationMultiplier )
		projection.rotate( rotationPosition )

		drawRotation( context );
		rotationInterval = window.requestAnimationFrame( () => animateRotation( context) )

		// If is rotating is turned off, stop the animation
		if( !isRotating ){
			cancelAnimationFrame( rotationInterval )
		}
	}

	function rotateMap(){
		const context = canvas.getContext( "2d" );
		rotationInterval = window.requestAnimationFrame( () => animateRotation( context) )
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


		// Sort according to lat position from east to west
		result = raw_data.sort( ( a, b ) => {
			if( a[ 'lat' ] === b[ 'lat' ] ) return 0;

			return a[ 'lat' ] > b[ 'lat' ] ? -1 : 1
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
					// Only move the one that is below the other
					if(  detectCircularCollision( d, dd, 15 ) && dd.lat >= d.lat ){
						return true
					}
					return false
				})
		} )

		result.forEach( (d, i ) => {
			const ref = getNearestNeighborOnTop( d, result )
			d.nearestNeighbor = ref

			if( d.lower ){
				if( ref.lower ){
					if( ref.lowerDisplacement ){
						d.lowerDisplacement = ref.lowerDisplacement + 15
					} 
				} else {
					d.lowerDisplacement = lowerDisplacement
				}
			}
		})

		const context = canvas.getContext( "2d" );
		
		result.forEach( ( d ) => {
			let labelX = d.toggleSide ? 
				( d.x < width/2 ? d.x + labelDisplacement : d.x - labelDisplacement ) :
				( d.x < width/2 ? d.x - labelDisplacement : d.x + labelDisplacement )
			
			let labelY = d.y // d.lower ? d.y + 20 : d.y
			
			let labelAlign = d.toggleSide ?
				( d.x < width/2 ? "left" : "right" ) :
				( d.x < width/2 ? "right" : "left" )

			d._canvasLabel = new Label( context, labelX, labelY, d.label )
			
			d._canvasLabel
				.align( labelAlign )
				.textColor( "#404040" )
				.bgColor( "#FFFFFF" )
				.font( "10px Comfortaa");
		})
	
		return result;
	}

	const updateData = () => {

	}

	function distanceFromCenter( datapoint ){
		const center = projection.invert( [ width/2, height/2 ] );
		const dataloc = [ datapoint[ "long" ], datapoint[ "lat" ] ];
		return geoDistance( dataloc, center );
	}

	function isVisibleOnGlobe( datapoint ){
		return distanceFromCenter( datapoint ) < 1.55;
	}

	const drawData = () => {
		if( !canvas ){
			return
		}
		const context = canvas.getContext( "2d" );
		
		mapData.forEach( location => {
			// Get Cartesian coordinates from lat and long
			let position = projection( [ location[ "long" ], location[ "lat" ] ] )

			// Update the location of the datapoint on each step
			location.x = position[ 0 ]
			location.y = position[ 1 ]
			
			// Draw the circle on the location
			context.globalAlpha = 0.8;
			context.beginPath()
			mapPath( positionPath.center( [location["long"], location["lat"] ] )() );
			context.fillStyle = color
			context.strokeStyle = color
			context.fill()
			context.globalAlpha = 1;
		} )

		mapData.sort( (a, b) => {
			if( distanceFromCenter( a ) === distanceFromCenter( b )){
				return 0
			}
			return distanceFromCenter( a ) < distanceFromCenter( b ) ? 1 : -1;
		}).filter( location => {
			return isVisibleOnGlobe( location )
		}).forEach( location => {
			let labelX = location.toggleSide ? 
				( location.x < width/2 ? location.x + labelDisplacement : location.x - labelDisplacement ) :
				( location.x < width/2 ? location.x - labelDisplacement : location.x + labelDisplacement )
			
			let labelY = location.lower ? location.y + location.lowerDisplacement : location.y
			
			let labelAlign = location.toggleSide ?
				( location.x < width/2 ? "left" : "right" ) :
				( location.x < width/2 ? "right" : "left" )
			
			let handleX = location.toggleSide ? 
				( location.x < width/2 ? location.x + lineDisplacement : location.x - lineDisplacement ) :
				( location.x < width/2 ? location.x - lineDisplacement : location.x + lineDisplacement )


			location._canvasLabel
				.x( labelX )
				.y( labelY )
				.align( labelAlign )

			context.fillStyle = color
			context.strokeStyle = color

			context.moveTo( location.x, location.y )
			context.lineTo( handleX, labelY )
			context.stroke();

			context.beginPath()
			context.arc( handleX, labelY, 3, 0, Math.PI*2 )
			context.fill();
			
			location._canvasLabel();
		})
		
	}

	const loadingPromise = () => {
		getMap()
			.then( getData )
			.then( drawMap )
			.then( rotateMap )
			.catch( err => {
				console.log( err )
			})
	}

	/**
	 * INTERACTIONS
	 */
	const handleDragStart = ( evt ) => {
		evt.preventDefault()

		// Start to see whether touc was a click or a drag
		touchStarted = Date.now()
	
		// Store the starting position of the drag
		dragPosition = getMousePosition( evt )

		overlay.addEventListener( "mousemove", handleDrag )
		overlay.addEventListener( "touchmove", handleDrag, {passive: false})
		overlay.addEventListener( "mouseup", handleDragEnd)
		overlay.addEventListener( "touchend", handleDragEnd)
	}

	const handleDrag = ( evt ) => {
		evt.preventDefault()
		isRotating = false
		// Get geographic start position
		const startPosition = projection.invert( dragPosition );
		const startRotation = projection.rotate()
	
		// Store the dragged position of the drag
		dragPosition = getMousePosition( evt )

		
		// Get geographic end position
		const  endPosition = projection.invert( dragPosition );

		// Calculate the new rotation with a lot of help from others
		const endRotation = eulerAngles( startPosition, endPosition, startRotation );

		// Rotate
		if( endRotation ){
			projection.rotate( endRotation );
			rotationPosition = endRotation;
			drawRotation( canvas.getContext( "2d" ) );
		}
	}

	const handleDragEnd = ( evt ) => {
		evt.preventDefault()
		
		let timeDif = Date.now() - touchStarted;
		
		// If it can be considered a click toggle rotation
		if( timeDif < 500 ) {
			isRotating = !isRotating

			// Check if a label/datapoint was clicked
			if( mapData.length > 0){
				const idx = mapData.findIndex( d => {
					return detectCircularCollision( 
						{x: dragPosition[0], y: dragPosition[1] },
						d,
						10
					) || detectBoxCollision(
						{x: dragPosition[0], y: dragPosition[1] },
						d._canvasLabel.box()
					)
				} )

				if( idx > -1 && isVisibleOnGlobe( mapData[idx] ) ){
					if( mapData[ idx ].link ){
						window.location.href = mapData[ idx ].link
						return
					}
					
					locationSelected = mapData[ idx ]
					isRotating = false
				} else {
					locationSelected = null
					if( isRotating ){
						rotateMap()
					}
				}
			} else {
				if( isRotating ){
					rotateMap()
				}
			}
		} else {
			// After dragging always leave rotation off
			isRotating = false
		}

		overlay.removeEventListener( "mousemove", handleDrag )
		overlay.removeEventListener( "mouseup", handleDragEnd )
		overlay.removeEventListener( "touchmove", handleDrag )
		overlay.removeEventListener( "touchend", handleDragEnd )
	}

	const handleInfoClose = () => {
		locationSelected = null
	}

	/**
	 * LIFECYCLE 
	 */
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
#globe-overlay{
	position: absolute;
	top: 0;
	left: 0;
	font-family: Comfortaa, Lato, sans-serif;
}
</style>


<canvas width={ width } height={ height} bind:this={ canvas }>
</canvas>
<div style={ overlayStyle } bind:this={ overlay } id="globe-overlay" draggable="true"
	on:mousedown={ handleDragStart }
	on:touchstart={ handleDragStart }
>
	<InfoList 
		on:close={ handleInfoClose }
		content={ locationSelected }
		color={ color }
		bgColor={ 'rgba( 255, 255, 255, 0.95 )'}
	/>
</div>

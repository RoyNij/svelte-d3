<script>
import { createEventDispatcher } from 'svelte';
// To emit close event
const dispatch = createEventDispatcher();

// Variables to set
export let color = "#FFFFFF";
export let size = 15;
export let width = 2;
export let tr = true;
export let delay = 400;

// Variables to indicate clic
let closing = false;

// Handle click
function handleClick(){
	closing = true;

	setTimeout( () => {
		dispatch( "close" )
	}, delay)
}

$: styleVariables = `--size: ${size}px; 
	--linewidth: ${width}px;
	--color: ${color}; 
	--delay: ${delay}ms`

</script>

<style>
.close-button{
	position: absolute;
	cursor: pointer;
	width: var(--size);
	height: var(--size);
}

.close-button.tr{
	top: 5px;
	right: 5px;
}

.close-line{
	position: absolute;
	width: var(--size);
	height: var(--linewidth);
	border-radius: var(--linewidth) / 50%;
	left: 0;
	top: calc( 50% - calc( var(--linewidth) / 2 ) );
	background-color: var(--color);
	opacity: 1;
	transition: transform var( --delay ), 
		opacity calc( var(--delay) / 2 ) calc( var(--delay) / 2 );
}

#first{
	transform: rotate( 45deg );
}

#second{
	transform: rotate( -45deg );
}

.close-button.closing #first,
.close-button.closing #second{
	transform: rotate( 0deg );
	opacity: 0;
}

</style>

<div style={styleVariables} 
	class='close-button' 
	class:tr class:closing
	on:click={ handleClick }
>
	<span class="close-line" id="first"></span>
	<span class="close-line" id="second"></span>
</div>
<script>
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import Graph from './Graph.svelte';
import Axis from './Axis.svelte';

export let size = 5;
export let data = [];
export let xVar = "x";
export let yVar = "y";
export let width = 900;
export let height = 600;
export let margin = {
	top: 10,
	left: 10,
	right: 10,
	bottom: 10
}
export let color;

$: graphWidth = width - margin.left - margin.right;
$: graphHeight = height - margin.top - margin.bottom;
$: x = scaleLinear()
	.domain( extent( data.map( d => d[ xVar ] ) ) )
	.range( [0, graphWidth ] )
	
$: y = scaleLinear()
	.domain( extent( data.map( d => d[ yVar ] ) ) )
	.range( [0, graphHeight ] )
	
</script>

<style>

</style>

<Graph {width} {height}>
	<g>
	{#each data as d, i (d)}
		<circle 
			cx={x( d[ xVar ] )}
			cy={y( d[ yVar ] )}
			r={ size }
			fill={ color }
		>

		</circle>
	{/each}
	</g>
	<Axis scale={ x } values={data.map(d => d[xVar])} position={{x: 0, y: graphHeight}} />    
</Graph>
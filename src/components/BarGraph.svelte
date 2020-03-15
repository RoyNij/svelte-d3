<script>
import { onMount } from 'svelte'
import { cubicOut } from 'svelte/easing'
import {scaleBand, scaleLinear} from 'd3-scale'
import {select} from 'd3-selection'
import {transition} from 'd3-transition'
import {max} from 'd3-array'
import Axis from './Axis.svelte'
const _ = require('underscore');

export let width = 900;
export let height = 600;
export let margin = {
    top: 50,
    left: 10,
    bottom: 50,
    right: 10
}
export let xVar = "x"
export let yVar = "y"
export let data = []
export let color = "red"
export let animateHeight = false

let container;

$: canvasWidth = width - margin.left - margin.right
$: canvasHeight = height - margin.top - margin.bottom
$: xScale = scaleBand()
    .range([0, canvasWidth])
    .domain(data.map(d => d[xVar]))
    .paddingInner(0.05)

$: yScale = scaleLinear()
    .range([0, canvasHeight])
    .domain([0, max(data.map(d => d[yVar]))])

let animateBarHeight = function(){
    select(container).selectAll(".bar")
        .data(data)
        .transition()
        .duration(400).delay((d, i) => i*50)
        .attr("height", d => yScale(d[yVar]))
        .attr("y", d => canvasHeight - yScale(d[yVar]))
}


let position = function( node, animation, args){
    let start = animation.from.x - container.getBoundingClientRect().x
    let end = xScale(args.d[xVar])
    let change = end - start

    return {
        duration: 400,
        tick: t => {
            if(t >= 1){
                select(node).attr("x", (end))
            } else {
                select(node).attr("x", start + t*change)
            }
        },
        easing: cubicOut
    }
}

onMount(() => {
     if(animateHeight){
        animateBarHeight()
    }
    
})

</script>

<svg width={width} height={height}>
    <g class='canvas' 
        transform={"translate(" + margin.left + "," + margin.top + ")"}
        bind:this={container}
    >
        <g class='bars'>
            {#each data as d,i (d)}
            <rect class='bar'
                x={xScale(d[xVar])}
                y={animateHeight ? canvasHeight : (canvasHeight - yScale(d[yVar]))}
                width={xScale.bandwidth()}
                height={animateHeight ? 0 : yScale(d[yVar])}
                style={"fill: " + color}
                animate:position={{d, i}}
            ></rect>
            {/each}
        </g>   
        <Axis scale={xScale} values={data.map(d => d[xVar])} position={{x: 0, y: canvasHeight}} />    
    </g>
    
</svg>

<style>
</style>
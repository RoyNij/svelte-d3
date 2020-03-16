<script>
import { onMount } from 'svelte'
import { cubicOut } from 'svelte/easing'
import { fade } from 'svelte/transition'
import {scaleBand, scaleLinear} from 'd3-scale'
import {select} from 'd3-selection'
import {transition} from 'd3-transition'
import {max} from 'd3-array'
import Axis from './Axis.svelte'
const _ = require('underscore');

export let width = 900;
export let height = 600;
export let margin = {
    top: 80,
    left: 50,
    bottom: 150,
    right: 50
}
export let xVar = "x"
export let yVar = "y"
export let data = []
export let color = "red"
export let animateHeight = false

let visible = !animateHeight

let container;

$: canvasWidth = width - margin.left - margin.right
$: canvasHeight = height - margin.top - margin.bottom

$: xScale = scaleBand()
    .range([0, canvasWidth])
    .domain(data.map(d => d[xVar]))
    .paddingInner(0.05)

$: scaleMax = function(){
    let dataMax = max(data.map(d => d[yVar]));

    if(dataMax > 10000){
        return Math.ceil(dataMax/10000)*10000
    }
    if(dataMax > 1000){
        return Math.ceil(dataMax/1000)*1000
    }
    if(dataMax > 100){
        return Math.ceil(dataMax/100)*100
    }

    return dataMax
}

$: yScale = scaleLinear()
    .range([0, canvasHeight])
    .domain([0, scaleMax()])

let grow = function( node , args){
    let heightStart = 0
    let yStart = canvasHeight
    let heightEnd = yScale(args.d[yVar])
    let yEnd = canvasHeight - yScale(args.d[yVar])


    return {
        duration: animateHeight ? 400 : 0,
        tick: t => {
            select(node).attr('y', canvasHeight - t * (heightEnd - heightStart))
                .attr('height', t * (heightEnd - heightStart))
        },
        easing: cubicOut,
        delay: animateHeight ? args.i * 50 : 0
    }
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
        visible = true
    }
})

</script>


<svg width={width} height={height}>
    <g class='canvas' 
        transform={"translate(" + margin.left + "," + margin.top + ")"}
        bind:this={container}
    >
        <g class='y-grid'>
            {#each [0, 0.25,0.5,0.75, 1] as line (line)}
            <line
                x1="-3"
                x2={canvasWidth}
                y1={Math.round(yScale.range()[1] * line)}
                y2={Math.round(yScale.range()[1] * line)}
            ></line>

            {#if line !== 0}
            <text
                x="-5"
                y={canvasHeight - Math.round(yScale.range()[1] * line)}
                dominant-baseline="middle"
                style='text-anchor: end;'
                class='label'
            >
            {Math.round(yScale.domain()[1] * line)}
            </text>
            {/if}

            {/each}
        </g>

        {#if visible}
        <g class='bars'>
            {#each data as d,i (d)}
            <rect class='bar'
                x={xScale(d[xVar])}
                y={canvasHeight - yScale(d[yVar])}
                width={xScale.bandwidth()}
                height={yScale(d[yVar])}
                style={"fill: " + color}
                in:grow={{d: d, i: i}}
                out:fade
                animate:position={{d: d, i: i}}
            ></rect>           
            {/each}
        </g>   
        {/if}

        <Axis scale={xScale} values={data.map(d => d[xVar])} position={{x: 0, y: canvasHeight}} />    
    </g>
    
</svg>

<style>
</style>
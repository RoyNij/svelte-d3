<script>
import { cubicOut } from 'svelte/easing'
import { select } from 'd3-selection'
export let scale;
export let values;
export let position;

export let padding = 5

let container

let labelPosition = function( node, animation, args){
    let start = animation.from.x - container.parentNode.getBoundingClientRect().x
    let end = scale(args.d) + scale.bandwidth()/2
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

</script>

<g transform={"translate(" + position.x + "," + position.y + ")"} bind:this={container}>
    {#each values as value, i (value)}
    
    <text
        class='axis-label'
        x={scale(value) + scale.bandwidth()/2}
        y={padding}
        dominant-baseline="hanging"
        animate:labelPosition={{d: value, i: i}}
    >
        {value}
    </text>
    
    {/each}
</g>

<style>
.axis-label{
    text-anchor: middle;
}
</style>
<script>
import { onMount } from 'svelte';
import { cubicOut } from 'svelte/easing'
import { select } from 'd3-selection'
import { wrapText } from './../helpers/wrapText';
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
                select(node).attr("transform", "translate(" + end + "," + padding + ")")
            } else {
                select(node).attr("transform", "translate(" + (start + t*change) + "," + padding + ")")
            }
        },
        easing: cubicOut
    }
}

function fitText(node, args){

    return {
        duration: 0,
        tick: t => {
            if(scale.bandwidth() > 100){
                select(node).style("text-anchor", "middle")
                    .call(wrapText.bind(null, scale.bandwidth()))
            } else {
                select(node)
                    .attr("transform", "rotate(45,0,0)")
                    .style("text-anchor", "left")
                    .text(function(){
                        let text = select(this).attr("data-content")
                        return text
                    })
                    .call(wrapText.bind(null, scale.bandwidth()))
            }
        }
    }
}

onMount(() => {
    if(scale.bandwidth() > 100){
        select(container).selectAll('.axis-label')
            .style("text-anchor", "middle")
            .call(wrapText.bind(null, scale.bandwidth()))

    } else {
        select(container).selectAll('.axis-label')
            .attr("transform", "rotate(45, 0, 0)")
            .style("text-anchor", "left")
            .text(function(){
                let text = select(this).attr("data-content")
                return text
            })
            .call(wrapText.bind(null, scale.bandwidth()))
    }
})

</script>

<g transform={"translate(" + position.x + "," + position.y + ")"} bind:this={container}>
    {#each values as value, i (value)}
    
    <g class='label-group' 
        transform={'translate(' + (scale(value) + scale.bandwidth()/2) + ',' + padding + ')'}
        animate:labelPosition={{d: value, i: i}}    
    >
        <text
            class='axis-label'
            x="0"
            y="0"
            dominant-baseline="hanging"
            data-content={value}
            in:fitText={{d: value, i: i}}
        >
        </text>
    </g>
    
    {/each}
</g>

<style>
.axis-label{
   
}
</style>
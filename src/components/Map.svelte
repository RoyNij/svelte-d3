<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    const topojson = require('topojson');
    import { json } from 'd3-fetch';
    import { geoAlbersUsa, geoNaturalEarth1, geoMercator, geoEqualEarth, geoPath } from 'd3-geo';
    import HoverBox from './HoverBox.svelte';


    const dispatch = createEventDispatcher();

    export let mapLocation;
    export let width = 900;
    export let aspect = '4:3'
    export let mapCollection = 'collection';
    export let pathId = 'iso_a3';
    export let margin = {
        top: 25,
        left: 25,
        right: 25,
        bottom: 25
    }
    export let showLabel = false;
    export let labelVar = null;

    let mapData = {}

    const getMap = () => {
        return new Promise((resolve, reject) => {
            json( mapLocation )
                .then((data) => {
                    mapData = topojson.feature(data, data.objects[mapCollection])
                    resolve(data)
                })
                .catch((err) => {
                    reject( err )
                })
        })
    }

    const handleClick = ( feature ) => {
        if(!feature){
            return
        }
        dispatch('mapclick', feature);
    }

    let mapPromise = getMap();

    
    let hoveredInfo = null;
    let hoverPosition = {x: 0, y: 0}
    
    
    const handleMouseover = function( evt, feature ){
        if(!showLabel) return
        
        hoverPosition = {x: evt.layerX, y: evt.layerY}

        hoveredInfo = feature.properties[labelVar]
    }

    const handleMouseout = function( evt ){
        if(!showLabel) return
        
        hoveredInfo = null
    }


    $: height = width/aspect.split(":")[0] * aspect.split(":")[1]
    $: canvasWidth = width - margin.left - margin.right
    $: canvasHeight = height - margin.top - margin.bottom
    $: projection = geoMercator()
        .fitExtent([[margin.left, margin.top],[canvasWidth, canvasHeight]], mapData)
    $: mapPath = geoPath()
        .projection(projection)

</script>

{#await mapPromise}
    <p>...Waiting</p>
{:then map }
    <svg width={width} height={height}>
        <g class='canvas map'>
            <rect class='background'
                x="0"
                y="0"
                width={width}
                height={height}
            ></rect>

            {#each mapData.features as feature (feature.properties[pathId])}
            <path id={feature.properties[pathId]}
                class='country'
                d={mapPath(feature)}
                on:mouseover={(evt) => handleMouseover(evt, feature)}
                on:mouseout={handleMouseout}
                on:click={handleClick(feature)}
            >
            </path>
            {/each}
        </g>
    </svg>

    {#if hoveredInfo !== null}
    <HoverBox bind:content={hoveredInfo}  bind:position={hoverPosition}/>
    {/if}

{:catch err}
    <p>{err}</p>
{/await}

<style>
</style>
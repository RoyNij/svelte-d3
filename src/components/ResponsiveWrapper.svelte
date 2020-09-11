<script>
    export let aspect = "16:9";
    export let maxHeight;
    export let displaySize = true;
    
    let width = 900;
    
    
    $: height = (maxHeight && maxHeight > 0  ? 
        Math.min( Math.round(width/aspect.split(":")[0] * aspect.split(":")[1]), maxHeight ) :
        Math.round(width/aspect.split(":")[0] * aspect.split(":")[1]) )

</script>

<div class='responsive-wrapper' bind:clientWidth={width}>
    {#if displaySize }
    <div id="size-indicator">{width} x {height}</div>
    {/if}
    
    <slot width={width} height={height}>
    </slot>
</div>

<style>
    #size-indicator{
        top: 0;
        left: 0;
        position: absolute;
    }
    .responsive-wrapper{
        position: relative;
        width: 100%;
    }
</style>
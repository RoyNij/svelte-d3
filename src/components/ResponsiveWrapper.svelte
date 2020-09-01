<script>
    export let aspect = "16:9"
    export let maxHeight;
    
    let width = 900;
    
    
    $: height = (maxHeight && maxHeight > 0  ? 
        Math.min( Math.round(width/aspect.split(":")[0] * aspect.split(":")[1]), maxHeight ) :
        Math.round(width/aspect.split(":")[0] * aspect.split(":")[1]) )

</script>

<div class='responsive-wrapper' bind:clientWidth={width}>
    <div>{width} x {height}</div>
    <slot width={width} height={height}>
    </slot>
</div>

<style>
    .responsive-wrapper{
        width: 100%;
    }
</style>
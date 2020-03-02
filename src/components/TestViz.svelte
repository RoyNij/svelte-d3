<script>
    export let width;
    export let aspect = '1:1';
    
    $: height = width/aspect.split(":")[0] * aspect.split(":")[1];

    
</script>


    
<div class='circle' style='width: {width + "px"}; height: {height + "px"}'>
</div>


<style>
    .circle{
        border-radius: 50%;
        background-color: red;
    }
</style>

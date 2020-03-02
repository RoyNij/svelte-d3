<script>
    export let content = null;
    export let position = {x: 0, y: 0}
</script>

<div class='hover-box' style='top: {position.y + "px"}; left: {position.x + "px"}'>
    {content}
</div>

<style>
.hover-box{
    position: absolute;
}
</style>
<script>
    let width;

</script>

<div class='responsive-wrapper' bind:clientWidth={width}>
    <slot width={width}>
    </slot>
</div>

<style>
    .responsive-wrapper{
        width: 100%;
    }
</style>
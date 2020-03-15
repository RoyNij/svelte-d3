<script>
import ResponsiveWrapper from './../components/ResponsiveWrapper.svelte'
import Map from './../components/Map.svelte'

let width
</script>

<div class='container'>
    <ResponsiveWrapper let:width={width}>
        <Map width={Math.floor(width)}
            aspect="16:9"
            mapLocation="/nederland.json"
            mapCollection="nederland"
            pathId="GID_1"
        />
    </ResponsiveWrapper>
</div>

<style>
.container{
    width: 100%;
}
</style>



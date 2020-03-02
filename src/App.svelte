<script>
    import ResponsiveWrapper from './components/ResponsiveWrapper.svelte';
    import Map from './components/Map.svelte';
</script>

<div class='container'>
    <div class='left'>
        <ResponsiveWrapper let:width={width}>
            <Map width={Math.floor(width)} 
                aspect="1:1" 
                mapLocation='./data/nederland.json'
                mapCollection='nederland'
                pathId='NAME_1'
                showLabel={true}
                labelVar='NAME_1'
                on:mapclick={feature => {console.log(feature.detail)}}
            />
        </ResponsiveWrapper>
    </div>
    <div class='right'>
    </div>
</div>


<ResponsiveWrapper let:width={width}>
    <Map width={Math.floor(width)} 
        aspect="16:9" 
        mapLocation='./data/colombia_mun.json'
        mapCollection='colombia_mun'
        pathId='COD'
        showLabel={true}
        labelVar='MUNICIPIO'
    />
</ResponsiveWrapper>

<ResponsiveWrapper let:width={width}>
    <Map width={Math.floor(width)} 
        aspect="16:9" 
        mapLocation='./data/world.topojson'
        showLabel={true}
        labelVar='name'
    />
</ResponsiveWrapper>

<script>
    import ResponsiveWrapper from './components/ResponsiveWrapper.svelte';
    import Map from './components/Map.svelte';
    import Button from './components/Button.svelte';
</script>

<div class='container'>
    <ResponsiveWrapper let:width={width}>
        <Map width={width} 
            aspect="16:9" 
            mapLocation='./data/colombia_mun.json'
            mapCollection='colombia_mun'
            pathId='COD'
            showLabel={true}
            labelVar='MUNICIPIO'
        />
    </ResponsiveWrapper>
</div>



<Map width={300} 
    aspect="4:3" 
    mapLocation='./data/colombia_mun.json'
    mapCollection='colombia_mun'
    pathId='COD'
    showLabel={true}
    labelVar='MUNICIPIO'
/>
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

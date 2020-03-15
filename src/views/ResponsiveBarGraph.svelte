<script>
    import ResponsiveWrapper from './../components/ResponsiveWrapper.svelte';
    import BarGraph from './../components/BarGraph';

    export let rawData
</script>



<ResponsiveWrapper let:width={width}>
    <BarGraph data={rawData} width={width} animateHeight={true}/>
</ResponsiveWrapper>



<style>

</style>

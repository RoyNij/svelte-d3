<script>
    import ResponsiveWrapper from './../components/ResponsiveWrapper.svelte';
    import BarGraph from './../components/BarGraph';

    export let rawData
</script>



<ResponsiveWrapper let:width={width} let:height={height}>
    <BarGraph data={rawData} width={width} height={height} animateHeight={true}/>
</ResponsiveWrapper>



<style>

</style>

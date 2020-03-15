<script>
    import ResponsiveWrapper from './../components/ResponsiveWrapper.svelte';
    import SortedBarGraph from './SortedBarGraph';

    export let rawData
</script>

<ResponsiveWrapper let:width>
    <SortedBarGraph width={width} rawData={rawData} />
</ResponsiveWrapper>
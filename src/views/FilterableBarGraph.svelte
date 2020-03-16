<script>
    import Filterable from './../components/Filterable.svelte';
    import BarGraph from './../components/BarGraph.svelte';

    export let rawData
</script>

<Filterable rawData={rawData} let:data={data}>
    <BarGraph data={data} animateHeight={false} />
</Filterable>
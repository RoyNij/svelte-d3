<script>
    import BarGraph from './../components/BarGraph.svelte';
    import Sortable from './../components/Sortable.svelte';

    export let rawData = []
    export let color = "red"
    export let width = 900
</script>

<Sortable let:data={data} rawData={rawData}>
    <BarGraph data={data} color={color} animateHeight={true} width={width} />
</Sortable>

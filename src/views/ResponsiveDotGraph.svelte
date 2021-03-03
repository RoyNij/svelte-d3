<script>
import ResponsiveWrapper from './../components/ResponsiveWrapper.svelte'
import DotGraph from './../components/DotGraph.svelte';

export let data = [];
export let size = 2
export let color;
</script>

<ResponsiveWrapper let:width={width} let:height={height}>
	<DotGraph width={width} height={height} { data } {size} {color}/>
</ResponsiveWrapper>
<script>
import ResponsiveWrapper from "../components/ResponsiveWrapper.svelte";
import Globe from "../components/Globe.svelte";

export let color = "#2E7276";
export let bgColor = "#2E7276";
export let dataUrl = "/test-location-data.json";

$: containerStyle = `--color: ${color}; --bg-color: ${ bgColor }`;

</script>

<style>
.container{
	background-color: var( --bg-color );
}
</style>

<div class='container' style={ containerStyle }>
	<ResponsiveWrapper 
		let:width={width} 
		let:height={height} 
		aspect="1:1"
		maxHeight={ 600 }
	>
		<Globe 
			width={Math.floor( width ) }
			height={Math.floor( height ) }
			mapUrl="/land-110m.json"
			dataUrl={ dataUrl }
			mapCollection="land"
			color={ color }
		/>
	</ResponsiveWrapper>
</div>
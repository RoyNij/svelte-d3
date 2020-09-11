<script>
import ResponsiveWrapper from "../components/ResponsiveWrapper.svelte";
import Globe from "../components/Globe.svelte";

export let color = "#2E7276";
export let bgColor = "#2E7276";
export let dataUrl = "/test-location-data.json";
export let mapUrl = "/land-110m.json";
export let maxHeight = 600;
export let margin = { 
	top: 10,
	right: 10,
	bottom: 10,
	left: 10
};

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
		maxHeight={ maxHeight }
		displaySize={ false }
	>
		<Globe 
			width={Math.floor( width ) }
			height={Math.floor( height ) }
			mapUrl={ mapUrl }
			dataUrl={ dataUrl }
			mapCollection="land"
			color={ color }
			margin={ margin }
		/>
	</ResponsiveWrapper>
</div>
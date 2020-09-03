<script>
import ResponsiveWrapper from "../components/ResponsiveWrapper.svelte";
import Globe from "../components/Globe.svelte";

</script>

<style>

</style>

<div class='container'>
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
			dataUrl="/test-location-data.json"
			mapCollection="land"
		/>
	</ResponsiveWrapper>
</div>
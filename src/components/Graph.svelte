<script>
export let width = 900;
export let height = 600;
export let margin = {
	top: 10,
	right: 10,
	bottom: 10,
	left: 10
};

</script>

<style>

</style>

<svg width="{ width }" height="{ height }">
	<g transform="translate( { margin.left }, {margin.top } )"
	>
		<slot

		></slot>
	</g>
</svg>
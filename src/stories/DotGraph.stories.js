import DotGraph from './../components/DotGraph.svelte';
import ResponsiveDotGraph from './../views/ResponsiveDotGraph.svelte'

// export default {title : "DotGraph"};

const testData = []

for ( var i = 0; i < 5000; i++) {
	testData.push(
		{
			x: Math.random() * 10000,
			y: Math.random() * 10000
		}
	)
}

export const SimpleDotGraph = () => ({
    Component: DotGraph,
    props: {
		data: testData,
		size: 2,
		color: '#AEAEAE'
    }
})

export const ResponsiveDotGraphExample = () => ({
	Component: ResponsiveDotGraph,
	props: {
		data: testData,
		size: 2,
		color: 'green'
	}
})
import BarGraph from './../components/BarGraph.svelte';
import SortedBarGraph from './../views/SortedBarGraph.svelte';
import ResponsiveBarGraph from './../views/ResponsiveBarGraph.svelte';
import ResponsiveSortedBar from './../views/ResponsiveSortedBar.svelte';

export default {title : "Bargraph"};

const testData = [
    {
        x : "C",
        y : 100
    },
    {
        x : "B",
        y : 200
    },
    {
        x : "A",
        y : 300
    },
    {
        x : "D",
        y : 250
    },
    {
        x : "E",
        y : 100
    },
    {
        x : "F",
        y : 200
    },
    {
        x : "G",
        y : 300
    },
    {
        x : "H",
        y : 250
    },
    {
        x : "I",
        y : Math.round(Math.random() * 400)
    },
    {
        x : "J",
        y : Math.round(Math.random() * 400)
    },
    {
        x : "K",
        y : Math.round(Math.random() * 400)
    },
    {
        x : "L",
        y : Math.round(Math.random() * 400)
    },
    {
        x : "M",
        y : Math.round(Math.random() * 400)
    },
    {
        x : "N",
        y : Math.round(Math.random() * 400)
    },
    {
        x : "O",
        y : Math.round(Math.random() * 400)
    },
    {
        x : "P",
        y : Math.round(Math.random() * 400)
    }
]

export const SimpleBarGraph = () => ({
    Component: BarGraph,
    props: {
        data: testData,
        color: "red"
    }
})

export const AnimatedBarGraph = () => ({
    Component: BarGraph,
    props: {
        data: testData,
        animateHeight: true,
        color: "steelblue"
    }
})

export const SortableBarGraph = () => ({
    Component: SortedBarGraph,
    props: {
        rawData: testData,
        color: "green"
    }
})

export const ResponsiveBarGraphExample = () => ({
    Component: ResponsiveBarGraph,
    props: {
        rawData: testData,
    }
})

export const ResponsiveSortableBarGraph = () => ({
    Component: ResponsiveSortedBar,
    props: {
        rawData: testData
    }
})
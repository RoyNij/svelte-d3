import BarGraph from './../components/BarGraph.svelte';
import SortedBarGraph from './../views/SortedBarGraph.svelte';
import ResponsiveBarGraph from './../views/ResponsiveBarGraph.svelte';
import ResponsiveSortedBar from './../views/ResponsiveSortedBar.svelte';
import FilterableBarGraph from './../views/FilterableBarGraph.svelte';
import {generateWords} from './../utils/randomTextGenerator';

export default {title : "Bargraph"};

const testData = [
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
    },
    {
        x : generateWords(Math.ceil(Math.random()*3)),
        y : Math.round(Math.random() * 100000)
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
        data: [].concat(testData).splice(0, 7),
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

export const FilterableBarGraphExample = () => ({
    Component: FilterableBarGraph,
    props: {
        rawData: testData
    }
})
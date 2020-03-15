import Map from './../components/Map.svelte';
import ResponsiveMap from './../views/ResponsiveMap.svelte';
export default {title : "Map"}

export const SimpleMap = () => ({
    Component: Map,
    props : {
        mapLocation : "/nederland.json",
        mapCollection : "nederland",
        showLabel: true,
        labelVar: "NAME_1"
    }
})

export const ResponsiveMapView = () => ({
    Component: ResponsiveMap,
    props: {
        width: 900
    }
})
import Map from './../components/Map.svelte';
import ResponsiveMap from './../views/ResponsiveMap.svelte';
import Globe from './../components/Globe.svelte';
import ResponsiveGlobe from './../views/ResponsiveGlobe.svelte';
import Globe3D from './../components/Globe3D.svelte';
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

export const SimpleGlobe = () => ({
    Component: Globe,
    props: {
        mapUrl: "/land-110m.json",
        mapCollection: "land"
    }
})

export const ResponsiveGlobeView = () => ({
    Component: ResponsiveGlobe,
    props: {
        width: 900
    }
})

// export const ThreeGlobe = () => ({
//     Component: Globe3D
// })
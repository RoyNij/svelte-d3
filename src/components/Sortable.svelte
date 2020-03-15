<script>
    import {ascending, descending} from 'd3-array';
    import Button from './Button.svelte'

    export let rawData = []
    export let yVar = "y";
    let sortDirection = "asc"

    let sortedData = rawData

    function sortData( direction ){       
        let result;
        
        switch( direction ){
            case "asc":
                result = [].concat(rawData).sort((a, b) => ascending(a[yVar], b[yVar]));
                break;
            case "desc":
                result = [].concat(rawData).sort((a, b) => descending(a[yVar], b[yVar]));
                break;
            default:
                result = rawData
        }
        
        sortedData = result
    }

    
</script>

<div class='sortable-container'>
    <div class='button-container'>
        <Button on:click={sortData.bind(this, 'desc')}>
            <i class='material-icons rotate'>sort</i>
        </Button>
        <Button on:click={sortData.bind(this, 'asc')}>
            <i class='material-icons flip rotate'>sort</i>
        </Button>
        <Button on:click={sortData.bind(this, 'reset')}>
            <i class='material-icons'>undo</i>
        </Button>
    </div>

    <slot data={sortedData}>
    </slot>
</div>

<style>
.button-container{
    padding: 10px;
}

.rotate{
    transform: rotate(-90deg);
}

.flip{
    transform: scaleY(-1);
}

.rotate.flip{
    transform: scaleY(-1) rotate(90deg);
}
</style>
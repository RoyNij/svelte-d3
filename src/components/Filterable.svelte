<script>
import Button from './Button.svelte';
import {generateWords} from './../utils/randomTextGenerator';

export let rawData = []

let finalData = [].concat(rawData)

function addData(){
    finalData.push({
        x : generateWords(Math.ceil(Math.random() * 3)),
        y : Math.round(Math.random() * 100000)
    })

    finalData = finalData
}

function removeData(){
    finalData.pop()

    finalData = finalData
}

</script>

<div class='filterable-container'>
    <div class='button-container'>
        <Button on:click={addData.bind(this)}>
            Add Data
        </Button>
        <Button on:click={removeData.bind(this)}>
            Remove Data
        </Button>
    </div>

    <slot data={finalData}>
    </slot>

</div>
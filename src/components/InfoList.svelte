<script>
import CloseButton from './CloseButton.svelte'
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import { isArray } from 'util';

// To emit close event
const dispatch = createEventDispatcher();

export let color = "#404040";
export let bgColor = "rgba(234, 234, 234, 0.95)";
export let content = null;

export let titleVar = "label";
export let listVar = "partners";
export let listLabelVar = "label";
export let subListVar = "partners";

let containerStyle = `--color: ${color}; --background-color: ${bgColor};`

const handleClose = function(){
	dispatch( "close" );
}

</script>

<style>
.container{
	position: relative;
	background-color: var( --background-color );
	border-style: solid;
	border-width: 1px;
	border-color: var( --color );
	box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
	margin: 20px auto;
	padding: 10px 20px;
	color: var( --color );
	border-radius: 5px;
	max-width: 250px;
	min-height: 10px;
}

.list-title{
	text-align: center;
}

.list-label{
	margin: 3px 0;
	font-weight: 600;
}

.sub-list{
	margin-top: 0;
	margin-left: 0;
	margin-right: 0;
	margin-bottom: 8px;
	padding-inline-start: 20px;
	font-size: 16px;
}

.sub-item{
	margin-bottom: 5px;
	color: #404040;
}

@media only screen and (min-width: 768px){
	.container{
		margin: 20px 20px;
	}
}

@media only screen and (min-width: 1400px){
	.container{
		margin: 20px calc( 50vw - 680px );
	}
}


</style>

{#if content !== null}
<div class='container' style={ containerStyle }
	transition:fade
	on:mousedown|stopPropagation 
	on:touchstart|stopPropagation 
>
	<CloseButton on:close={ handleClose } 
		size={20} 
		width={2} 
		color={ color } 
	/>

	{#if content[ titleVar ] }
	<h3 class='list-title'>{ content[ titleVar ] }</h3>
	{/if}

	{#if Array.isArray( content[ listVar ] ) && content[ listVar ].length > 0}
	{#each content[ listVar ] as item }
		{#if Array.isArray( item[ subListVar ] ) && item[ subListVar].length > 0 }
			{#if item[ listLabelVar ] }
			<p class='list-label'>{ item[ listLabelVar ] }</p>
			{/if}

			<ul class="sub-list">
				{#each item[ subListVar ] as subitem }
				<li class="sub-item">{ subitem }</li>
				{/each}
			</ul>
		{/if}
	{/each}
	{/if}

	{#if Array.isArray( Object.keys( content[ listVar ] ) ) && Object.keys( content[ listVar ] ).length > 0 }
	{#each Object.keys( content[ listVar ] ) as list_key }
		{#if Array.isArray( content[ listVar ][ list_key ][ subListVar ] ) &&  content[ listVar ][ list_key ][ subListVar ].length > 0}
			{#if content[ listVar ][ list_key ][ listLabelVar ] }
			<p class='list-label'>{ content[ listVar ][ list_key ][ listLabelVar ] }</p>
			{/if}

			<ul class="sub-list">
				{#each content[ listVar ][ list_key ][ subListVar ] as subitem}
				<li class="sub-item">{ subitem }</li>
				{/each}
			</ul>
		{/if}
	{/each}
	{/if}
</div>
{/if}
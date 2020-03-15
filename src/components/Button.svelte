<button on:click>
    <slot></slot>
</button>

<style>
button{
    appearance: none;
    -webkit-appearance: none;
    padding: 5px;
    border-radius: 5px;
    border: none;
    background-color: #DEDEDE;
    cursor: pointer;
    line-height: 1;
}

button:focus{
    outline: none;
    background-color: aquamarine;
}
</style>
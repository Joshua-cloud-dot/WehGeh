
<template>
    <ul>
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/putzplan">Putzplan</router-link></li>
    </ul>



</template>



<style scoped>
    ul {
        list-style-type: none;
        margin: 1px;
        padding: 0;
    }
    li {
        display: inline;
        margin: 2px;
    }
    a {
        display: inline-block;
        background-color: black;
        border: solid 1px black;
        color: white;
        margin: 10px;
        cursor: pointer;
    }
    a:hover,
    a.router-link-active {
        background-color: var(--color-slate-700);
    }
</style>
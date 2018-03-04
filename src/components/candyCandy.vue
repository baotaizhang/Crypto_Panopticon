<template>
    <div>
        <svg width="960" height="600" id="chase"></svg>
    </div>
</template>

<style scoped>
    .links line {
        stroke: #999;
        stroke-opacity: 0.1;
    }
    .nodes circle {
        stroke: #fff;
        stroke-width: 0.3px;
    }
    .nodes text {
        pointer-events: none;
        font: 10px sans-serif;
    }
</style>

<script>
    import * as connection from "../lib/connection";
    connection.connect();
</script>

<template>
    <h1>Welcome to Nuxt 4!</h1>
    <pre>{{ data }}</pre>
</template>

<script setup lang="ts">

const data = await usePBData(async (pb) => {
    return pb.collection('testdata').getFullList(10);
});

</script>
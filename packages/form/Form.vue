<template>
    <form action="" class="d-form" onsubmit="return false">
        <slot></slot>
    </form>
</template>

<script setup>

import { ref } from 'vue';

let props = defineProps({
    
});



</script>

<style lang="scss" scoped>
.d-form {
    padding: 20px 0;
    // border-top: 1px solid var(--color-border);
    // border-bottom: 1px solid var(--color-border);
}
</style>
<template>
    <div class="d-radio-group">
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, watch, provide, nextTick } from 'vue';

const props = defineProps({
    value: {
        default: undefined
    },

});

let stateValue = ref(props.value);
const emit = defineEmits(['update:value', 'change']);
const updatingValue = ref('');
function change(event) {
    const lastValue = stateValue.value;
    const value = event.target._value;

    if (!('value' in props)) {
        stateValue.value = value;
    }
    if (!updatingValue.value && value !== lastValue) {
        updatingValue.value = true;
        emit('update:value', value);
        emit('change', value);

    }
    nextTick(() => {
        updatingValue.value = false;
    });
}


watch(() => props.value, (val) => {
    stateValue.value = val;
})
provide('radioGroupContext', {
    change,
    stateValue
})



</script>

<style lang="scss" scoped></style>
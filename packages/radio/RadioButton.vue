<template>
    <label class="d-radio-button-wrapper" :class="{ checked: stateValue === value, disabled: disabled }">
        <span class="d-radio-button">
            <input type="radio" :value="value" :checked="stateValue === value" @click="change"
                class="d-radio-button-input"/>
            <span class="d-radio-button-inner"></span>
        </span>
        <span>
            <slot>{{ value }}</slot>
        </span>
    </label>
</template>

<script setup>
import { ref, getCurrentInstance, watch, inject } from 'vue'
const props = defineProps({
    value: {
        default: ''
    },
    disabled: {
        default: false
    },
    updatingValue: {
        default: ''
    }
});

const { change, stateValue } = inject('radioGroupContext');



</script>

<style lang="scss" scoped>
.d-radio-button-wrapper {
    position: relative;
    display: inline-block;
    height: 32px;
    margin: 0;
    padding-inline: 15px;
    padding-block: 0;
    color: var(--color-text);
    font-size: 14px;
    line-height: 30px;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-block-start-width: 1.02px;
    border-inline-start-width: 1px;
    border-inline-end-width: 1px;
    cursor: pointer;
    transition: color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;

    .d-radio-button {
        position: absolute;
        width: 0;
        height: 0;
        z-index: -1;
    }
    &:hover{
        color: var(--color-text-hover);
    }

    &.checked {
        background-color: var(--color-primary);
        color: #ffffff;
    }
}
</style>
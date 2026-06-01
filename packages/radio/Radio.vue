<template>
    <label class="d-radio-wrap">
        <span class="d-radio">
            <input type="radio" class="d-radio-input" :disabled="disabled" :checked="value_ || (stateValue === value)" :value="value"
                @input="change">
            <span class="radio check" v-if="value_ || (stateValue === value)" name="check"></span>
            <span class="radio noCheck" v-else> </span>
        </span>
        <span class="d-radio-text">
            <slot></slot>
        </span>
    </label>
</template>
  
<script setup>
import { ref, watch, inject } from "vue";

let props = defineProps({
    checked: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    value: {
        default: ''
    }
});


let emit = defineEmits(["update:checked", "change", "errorDisabled"]);
let value_ = ref(props.checked);
watch(()=>props.checked, (val) => {
    value_.value = val;
});
const handleClick = (val) => {
    if (props.disabled) {
        emit("errorDisabled");
        return false;
    }
    value_.value = val;
    emit("update:checked", val);
};



const { change, stateValue } = inject('radioGroupContext', () => ({
    change: () => {
        console.log(event.target.checked);
        const value = event.target.checked;
        value_.value = value;
        handleClick(value);
        emit("change", value);
    },
    stateValue:''
}), true);








</script>
  
<style lang="scss" scoped>
.d-radio-wrap {
    display: inline-flex;
    align-items: center;

    .d-radio {
        position: relative;

        input {
            position: absolute;
            inset: 0;
            z-index: 1;
            cursor: pointer;
            opacity: 0;
            margin: 0;
        }
    }
}

.radio {
    display: block;
    width: 16px;
    height: 16px;
    line-height: 16px;

    direction: ltr;
    background-color: var(--color-primary);
    border: 1px solid var(--color-border);
    border-radius: 50%;
    border-collapse: separate;
    transition: all 0.3s;
    cursor: pointer;
    color: #fff !important;

    &.noCheck {
        background-color: transparent;
        border-width: 2px;
    }

    &.check {
        border-width: 6px;
        background: transparent;
        border-color: var(--color-primary);
    }

    >span {
        color: #fff !important;
        line-height: 16px;
    }
}

.d-radio-text {
    padding: 0 8px;
}
</style>
  
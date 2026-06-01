<template>
    <div class="d-box-group">
        <Checkbox v-for="(item, index) in options" :key="index" @change="change($event, item)"
            :checked="stateValue.includes(item.value)">
            {{ item.label }}
        </Checkbox>
    </div>
</template>

<script setup>
import { ref, watch, provide, nextTick } from 'vue';
import Checkbox from './Checkbox.vue';

const props = defineProps({
    value: {
        default: undefined
    },
    options: {
        type: Array
    }

});

let stateValue = ref(props.value);
const emit = defineEmits(['update:value', 'change']);

function change(val, { label, value }) {
    if (val) {
        if (!stateValue.value.includes(value)) stateValue.value.push(value);
    } else {
        stateValue.value = stateValue.value.filter(v => v !== value);
    }
    emit('update:value', stateValue.value);
    emit('change', stateValue.value);
}


watch(() => props.value, (val) => {
    stateValue.value = val;
})



</script>
<style lang="scss" scoped>
.d-box-group {
    display: flex;
}
</style>
<template>
    <div class="scrollNum">
        <div class="num" v-for="(item, index) in value.toString()" :key="index" :style="{ width: (/^\d+$/.test(item) ? width : 5) + 'px',height: height + 'px' }">
            <div v-if="/^\d+$/.test(item)" :style="{ top: -item * height + 'px' }">
                <i :style="{ fontSize: size + 'px', color, height: height + 'px' }" v-for="(ic, indexc) in 10" :key="indexc">{{ ic - 1
                }}</i>
            </div>
            <div v-else>
                <i :style="{ fontSize: size + 'px', color, height: height + 'px' }">{{ item }}</i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from './svgIcon.vue';
let props = defineProps({
    width: 12,
    value: 0,
    color: '',
    size: '',
    height: ''
})
</script>

<style lang="scss" scoped>
.scrollNum {
    display: inline-flex;
    align-items: center;
}

.num {
    width: 20px;
    display: flex;
    // border: 1px solid #ddd;
    color: #000;
    text-align: center;
    margin: 0;
    position: relative;
    z-index: 3;
    overflow: hidden;

    div {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        transition: all 0.8s ease-in-out;

        i {
            width: 100%;
            font-style: normal;
            // font-weight: bold;
            color: #ffffff;
            display: block;
        }
    }
}
</style>
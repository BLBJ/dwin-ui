<template>
    <div class="d-spin-nested-loading" :class="{ loading: spinning }">
        <div class="spin-spinning" v-if="spinning">
            <svg-icon v-if="spinning" class="css-rotate" name="loading" :size="size"
                :style="{ lineHeight: size + 'px', height: size + 'px' }"></svg-icon>
            <div v-if="tip" class="spin-text">{{tip}}</div>
        </div>
        <div class="d-spin-container" :class="{ ' spin-blur': spinning }">
            <slot></slot>
        </div>

    </div>
</template>

<script setup>
let props = defineProps({
    spinning: {
        type: Boolean,
        default: true,
    },
    tip:{
        type: String,
        default: "",
    },
    size: {
        type: [String, Number],
        default: "18",
    },
})
</script>

<style lang="scss" scoped>
.d-spin-nested-loading {
    position: relative;
    transition: .3s all;
}

.loading {
    background-color: transparent;
}

.spin-spinning {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    z-index: 4;
    display: block;
    width: 100%;
    height: 100%;
    max-height: 400px;

    .spin-text {
        position: absolute;
        top: calc(50% + 20px);
        width: 100%;
        padding-top: 5px;
        text-shadow: 0 1px 2px #ffffff;
        text-align: center;
    }
}

.spin-blur {
    clear: both;
    opacity: 0.5;
    user-select: none;
    pointer-events: none;
}

.css-rotate {
    position: absolute;
    top: 50%;
    inset-inline-start: 50%;
    margin: -10px;
    margin-top: -20px;
    display: inline-block;
    // transform: rotate(0);
    animation-name: rotate;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
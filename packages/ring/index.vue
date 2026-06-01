<template>
  <div class="d-parent-element-center">
    <svg :width="diameterShow" :height="diameterShow" :viewbox="viewbox">
      <defs>
        <linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient1">
          <stop offset="0%" :stop-color="strokeGradientColor[0]"></stop>
          <stop offset="100%" :stop-color="strokeGradientColor[1]"></stop>
        </linearGradient>
      </defs>
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="raduisActual"
        :stroke-width="strokeWidth"
        :stroke="stokeBgColor"
        fill="none"
      ></circle>
      <circle
        v-if="rate"
        :text="text"
        :cx="size / 2"
        :cy="size / 2"
        :r="raduisActual"
        :stroke-width="strokeWidth"
        :stroke="isGradient ? 'url(#gradient1)' : strokeColor"
        fill="none"
        :transform="transform"
        :stroke-dasharray="strokeDasharray"
        :stroke-linecap="linecap"
      ></circle>
    </svg>
    <div
      v-if="showText"
      class="element-center"
      :style="textStyle"
      v-html="textHtml || text"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    // 圆环外圈的直径
    size: {
      default: 175,
    },
    // 圆环的小宽度
    strokeWidth: {
      default: 5,
    },
    // 圆环的颜色
    strokeColor: {
      default: "#00D476",
    },
    stokeBgColor: {
      default: "rgba(255,255,255,.2)",
    },
    isGradient: {
      type: Boolean,
      default: false,
    },
    strokeGradientColor: {
      type: Array,
      default: () => ["#00D476", "#00D476"],
    },
    // 圆环显示的百分比 这边是小数
    rate: {
      default: 0.5,
    },
    showText: {
      type: Boolean,
      default: true,
    },
    // 圆环里面的文字 这里的文字如果跟rate息息相关 可以放到computed计算
    text: {
      default: 50,
    },
    textHtml: String,
    // 圆环里面的文字的fontSize大小
    textSize: {
      default: 20,
    },
    linecap: {
      default: "butt",
    },
  },
  computed: {
    raduisActual() {
      return this.size / 2 - this.strokeWidth;
    },
    diameterShow() {
      return this.size;
    },
    viewbox() {
      return `0 0 ${this.diameterShow} ${this.diameterShow}`;
    },
    strokeDasharray() {
      const perimeter = Math.PI * 2 * this.raduisActual;
      const showLength = this.rate * perimeter - 3;
      return `${showLength} 1000`;
    },
    transform() {
      return `matrix(0,-1,1,0,0,${this.diameterShow})`;
    },
    textStyle() {
      let res = {};
      res.fontSize = `${this.textSize}px`;
      return res;
    },
  },
};
</script>
<style scoped>
.d-parent-element-center {
  position: relative;
  display: inline-block;
}

.element-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  font-weight: bold;
}
</style>

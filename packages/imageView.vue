<template>
  <div class="images">
    <img
      :src="list"
      alt=""
      v-for="(list, index) in imgList"
      :key="index"
      class="picutures"
      @click="viewbigImg(index)"
    />
    <!--  -->
    <teleport to="body">
      <div class="bigImgModal" v-show="showBigImg">
        <span class="closeModal"
            ><svg-icon name="close" size="18" @click="closeModal"></svg-icon
          ></span>
        <div class="bigImg">
          <svg-icon @click="pre" class="pre" size="60" name="left"></svg-icon>
          <img :src="currentImg" />
          <svg-icon @click="next" class="next" size="60" name="right"></svg-icon>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import SvgIcon from "./svgIcon.vue";
let props = defineProps({
  imgList: Array,
});
const currentImg = ref(""); //当前的图片
const currentIndex = ref(0); //当前的图片索引
const showBigImg = ref(false);
// 查看大图的点击方法
const viewbigImg = (val) => {
  showBigImg.value = true;
  currentIndex.value = val;
  currentImg.value = props.imgList[currentIndex.value];
};
const pre = () => {
  if (currentIndex.value == 0) {
    currentIndex.value = props.imgList.length - 1;
    currentImg.value = props.imgList[props.imgList.length - 1];
  } else {
    currentIndex.value--;
    currentImg.value = props.imgList[currentIndex.value];
  }
};
const next = () => {
  if (currentIndex.value == props.imgList.length - 1) {
    currentIndex.value = 0;
    currentImg.value = props.imgList[0];
  } else {
    currentIndex.value++;
    currentImg.value = props.imgList[currentIndex.value];
  }
};
const closeModal = () => {
  showBigImg.value = false;
};
watch(
  () => props.imgList,
  (val) => {
    console.log(val);
    // value_.value = val;
  }
);
</script>

<style lang="scss">
.picutures {
  width: 40px;
  height: 40px;
  display: inline-block;
  margin: 0 5px;
}
.bigImgModal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
  background: rgba(0, 0, 0, 0.5);
  .closeModal {
    position: absolute;
    right:20px;
    top: 20px;
    cursor: pointer;
  }
  .bigImg {
    position: absolute;
    top: 50%;
    left: 50%;
    background: var(--color-background);
    transform: translate(-50%, -50%);
  }
  img {
    width: 800px;
    height: auto;
    margin: 0 auto;
    display: block;
  }
  .pre {
    position: absolute;
    top: calc(50% - 15px);
    left: -130px;
    cursor: pointer;
  }
  .next {
    position: absolute;
    top: calc(50% - 15px);
    right: -130px;
    cursor: pointer;
  }
}
</style>

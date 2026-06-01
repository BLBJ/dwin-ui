<template>
  <div class="star-container">
    <div class="star-icon" v-for="i in count" :key="i">
      <svg-icon :size="size" class="star" name="star-fill" color="#6d6d6dff" />
      <svg-icon
        :size="size"
        class="star-fill star-fill-first"
        name="star-fill"
        @click="handleClick(i, 'first')"
        :color="color"
        :class="{ active: i * unitValue - unitValue / 2 <= rating_ }"
      />
      <svg-icon
        :size="size"
        class="star-fill star-fill-second"
        name="star-fill"
        @click="handleClick(i, 'second')"
        :color="color"
        :class="{ active: i * unitValue <= rating_ }"
      />
    </div>
    <span class="star-count">{{ rating_ }}</span>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  rating: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 5,
  },
  size: {
    type: String,
    default: "20",
  },
  color: {
    type: String,
    default: "#fa9d32ff",
  },
  unitValue: {
    type: Number,
    default: 1,
  },
  allowHalf: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:rating"]);

const rating_ = ref(props.rating);

function handleClick(val, type) {
  if (props.allowHalf) {
    if (type === "first") {
      rating_.value = val * props.unitValue - props.unitValue / 2;
    } else {
      rating_.value = val * props.unitValue;
    }
  } else {
    rating_.value = val * props.unitValue;
  }

  emits("update:rating", rating_.value);
}
watch(
  () => props.rating,
  (newVal, oldVal) => {
    rating_.value = newVal;
  }
);
</script>

<style lang="scss" scoped>
.star-container {
  display: flex;
  align-items: center;
}

.star-icon {
  position: relative;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  fill: #ccc;
  .star {
    display: block;
    cursor: pointer;
  }
  .star-fill {
    display: block;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
    opacity: 0;
  }
  .star-fill-first {
    top: 0;
    left: 0;
    z-index: 2;
    &.active {
      opacity: 1;
    }
  }
  .star-fill-second {
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    &.active {
      opacity: 1;
    }
  }
}
.star-count{
  display: inline-block;
  margin-left: 5px;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
}
</style>

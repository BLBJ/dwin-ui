<template>
  <div :class="prompt_class" :name="name" :style="styles">
    <svg-icon class="icon" v-if="type === 'info'" color="rgba(43, 140, 229, 1)" name="info-fill"></svg-icon>
    <svg-icon class="icon" v-if="type === 'warning'" color="rgba(255, 125, 0, 1)" name="warning-fill"></svg-icon>
    <svg-icon class="icon" v-if="type === 'success'" color="rgba(0, 180, 42, 1)" name="success-fill"></svg-icon>
    <svg-icon class="icon" v-if="type === 'error'" color="rgba(245, 63, 63, 1)" name="error-fill"></svg-icon>
    <span> {{ content }}</span>
  </div>
</template>

<script>
import SvgIcon from '../../svgIcon.vue';
export default {
  props: {
    duration: {
      type: Number,
      default: 1.5,
    },
    type: {
      type: String,
    },
    content: {
      type: String,
      default: "",
    },
    styles: {
      type: Object,
      default: function () {
        return {
          right: "50%",
        };
      },
    },
    className: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function,
    },
  },
  computed: {
    prompt_class() {
      return [`promptPanel`, ...this.class];
    },
  },
  components: {
    SvgIcon
  },
  data() {
    return {
      class: [],
    };
  },
  methods: {
    clearCloseTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    },
    close() {
      this.onClose();
      this.$parent.close(this.name);
    },
    shake() {
      if (this.class.length) return;
      this.class.push("animate__animated");
      setTimeout(() => {
        this.class.pop();
      }, 1000);
    },
  },
  created() { },
  mounted() {
    this.clearCloseTimer();

    //    if (this.duration !== 0) {
    //       this.closeTimer = setTimeout(() => {
    //         // console.log(this.name)
    //         this.close();
    //       }, this.duration * 1000);
    //     }
  },
  beforeUnmount() {
    this.clearCloseTimer();
  },
};
</script>

<style scoped lang="scss">
.promptPanel {
  width: fit-content;
  margin: 0 auto;
  font-size: 14px;
  color: #000;
  height: 40px;
  line-height: 40px;
  letter-spacing: 1px;
  padding: 0 12px;
  margin-bottom: 5px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  >.icon {
    display: inline-block;
    margin-left: 0;
    margin-right: 8px;
  }
}

.prompt-info {
  background: rgba(43, 140, 229, 0.3);

}

.prompt-error {
  background: rgba(245, 63, 63, 0.3);

}

.prompt-success {
  background: rgba(0, 180, 42, 0.3);
}

.prompt-warning {
  background: rgba(255, 125, 0, 0.3);
}

.move-up-enter-from,
.move-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.move-up-enter-active,
.move-up-leave-active {
  transition: all 0.5s ease;
}

.animate__animated {
  animation: headShake 1s ease-in-out;
}

@keyframes headShake {
  0% {
    transform: translateX(-20px);
  }

  20% {
    transform: translateX(10px);
  }

  40% {
    transform: translateX(-8px);
  }

  60% {
    transform: translateX(5px);
  }

  80% {
    transform: translateX(0px);
  }
}
</style>

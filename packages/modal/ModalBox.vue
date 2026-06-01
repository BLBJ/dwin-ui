<template>
  <teleport to="body">
    <div class="d-modal" v-bind="$attrs" v-if="visible"></div>
    <div v-if="visible" class="reference"></div>
    <transition
      name="modal-fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      :css="false"
    >
      <div class="d-modal-wrap" v-if="visible">
        <div
          :class="['messageConfirm', type]"
          :style="{ width: width + 'px' }"
          ref="wrap"
          v-bind="$attrs"
        >
          <slot name="title">
            <div v-if="isShowTitle" class="title">{{ title }}</div>
          </slot>
          <div class="close" v-show="isShowClose" @click="close">
            <svg-icon name="close"></svg-icon>
          </div>
          <slot name="content">
            <div class="content">
              <svg-icon class="icon"  v-if="type === 'warning'" color="rgba(255, 125, 0, 1)" name="info-circle"></svg-icon>
              <svg-icon class="icon" v-if="type === 'error'" color="rgba(245, 63, 63, 1)" name="info-circle"></svg-icon>
              <svg-icon class="icon" v-if="type === 'success'" color="rgba(0, 180, 42, 1)" name="check-circke"></svg-icon>
              <span>{{ content }}</span>
            </div>
          </slot>

          <slot name="btn">
            <div :class="['button']" v-show="isShowBtn">
              <button
                class="btn blue"
                v-if="['info', 'success', 'warning', 'error'].includes(type)"
                @click="btnClick"
              >
                {{ btnText }}
              </button>

              <button
                class="btn cancel"
                :class="{ blue: btnCancelType === 'info' }"
                v-if="!['info', 'success', 'warning', 'error'].includes(type)"
                @click="cancel"
              >
                {{ cancelText }}
              </button>
              <button
                class="btn confirm"
                :class="{ blue: btnConfirmType === 'info' }"
                v-if="!['info', 'success', 'warning', 'error'].includes(type)"
                @click="confirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import SvgIcon from "../svgIcon.vue";
let clickTimer = null;
export default {
  name: "Message",
  props: {
    width: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "提示",
    },
    content: {
      type: String,
      default: "",
    },
    isShowTitle: {
      type: Boolean,
      default: true,
    },
    isShowClose: {
      type: Boolean,
      default: false,
    },
    isShowBtn: {
      type: Boolean,
      default: true,
    },
    btnText: {
      type: String,
      default: "知道了",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    type: {
      type: String,
      default: "",
    },
    btnCancelType: {
      type: String,
      default: "default",
    },
    btnConfirmType: {
      type: String,
      default: "info",
    },
    onBtn: {
      type: Function,
      default: () => {},
    },
    okCallback: {
      type: Function,
      default: () => {},
    },
    cancelCallback: {
      type: Function,
      default: () => {},
    },
    background: {
      default: "#232324",
    },
    btnControllable: {
      type: Boolean,
      default: false,
    },
    //按钮防抖
    isStabilization: {
      type: Boolean,
      default: false,
    },
  },
  components: { SvgIcon },
  emits: ["onOk", "onCancel", "update:modelValue","close"],
  watch: {
    modelValue(val) {
      this.visible = val;
    },
  },
  computed: {},
  data() {
    return {
      visible: this.modelValue,
      mousePosition: {},
    };
  },
  methods: {
    close() {
      this.hide();
    },
    btnClick() {
      this.hide();
      this.onBtn();
    },
    cancel() {
      !this.btnControllable && this.hide();
      this.$emit("onCancel");
      this.cancelCallback();
    },
    confirm() {
      if (this.isStabilization) {
        if (clickTimer) {
          clearTimeout(clickTimer);
        }
        clickTimer = setTimeout(() => {
          !this.btnControllable && this.hide();
          this.$emit("onOk");
          this.okCallback();
        }, 300);
        return;
      } else {
        !this.btnControllable && this.hide();
        this.$emit("onOk");
        this.okCallback();
      }
    },
    hide() {
      this.visible = false;
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
    reset() {
      const el = document.querySelector(".reference");
      el.style.display = "block";
      const rect = el.getBoundingClientRect();
      // console.log("reset:", globalThis.mousePosition, rect);
      // console.log(this.$refs.wrap.offsetHeight, "warp");
      this.$refs.wrap.style.transformOrigin = `${mousePosition.x - rect.left}px ${
        mousePosition.y - rect.top
      }px`;
    },
    beforeEnter(el) {
      console.log("beforeEnter");

      el.children[0].style.transform = "scale(0)";
      el.children[0].style.transition = ".3s";
    },
    enter(el, done) {
      // console.log("enter");
      this.$nextTick(this.reset);
      setTimeout(() => {
        done();
      }, 100);
    },
    afterEnter(el) {
      console.log("afterEnter");
      this.$nextTick(() => {
        el.children[0].style.transform = "scale(1)  translate(-50%, -50%)";
      });
    },
    leave(el, done) {
      // console.log("leave");
      el.children[0].style.transform = "scale(0)";
      // el.style.display ='none';
      setTimeout(done, 100);
    },
  },
  mounted() {
    // console.log("mounted");
  },
};
</script>

<style scoped lang="scss">
.d-modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  overflow: auto;
  z-index: 2000;
}
.reference {
  position: absolute;
  width: 0;
  height: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.d-modal-wrap {
  position: fixed;
  top: 10px;
  right: 0;
  bottom: 10px;
  left: 0;
  z-index: 2000;
  overflow: auto;
  outline: 0;
}
.messageConfirm {
  position: absolute;
  z-index: 2001;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 520px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: all 0.3s ease;
  padding: 0 20px 0 20px;
  max-height: 100vh;

  &.confirm {
    width: 360px;
    // left: calc(50% - 180px);
  }
  .close {
    position: absolute;
    right: 8px;
    top: 0;
    padding: 5px;
    cursor: pointer;
    font-size: 24px;
    color: #636363;
    z-index: 100;
    .svg-icon {
      font-size: 46px;
      color: grey;
      position: absolute;
      top: 3px;
      right: 3px;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: var(--color-title);
    line-height: 47px;
    text-align: left;
    // border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .message_img {
    border-radius: 50%;
    width: 17px;
    margin-right: 3px;
  }

  .content {
    position: relative;
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text);
    line-height: 26px;
    letter-spacing: 2px;
    text-align: center;
    margin: 31px 0;
    .icon{
      margin-right: 10px;
    }
   
  }

  .btn {
    min-width: 68px;
    height: 32px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: var(--color-text);
    line-height: 22px;

    &.blue {
      background: var(--color-primary);
      color: #ffffff;
      border: none;
    }
    &.cancel {
      border: 1px solid var(--color-border);
      background: transparent;
      margin-right: 20px;
    }
  }
  .button {
    display: flex;
    justify-content: right;
    padding: 16px 0;
    // border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

// .messageConfirm{
//   overflow-y: scroll
// }
// .messageConfirm::-webkit-scrollbar{
//   width: 0;
// }

.modal-fade-enter-from,
.modal-fade-leave-to {
  // transform: scale(0);
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: 3s ease;
}
</style>

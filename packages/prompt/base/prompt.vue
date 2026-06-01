<template>
  <div class="d-prompt" :style="wrapStyles">
    <transition-group name="move-up" tag="p">
      <PromptItem
        v-for="(item, index) in notices"
        :ref="`notice_` + index"
        :key="index"
        :type="item.type"
        :content="item.content"
        :styles="item.styles"
        :duration="item.duration"
        :name="item.name"
        :on-close="item.onClose"
      ></PromptItem>
    </transition-group>
  </div>
</template>

<script>
import PromptItem from "./promptItem.vue";
import { transferIndex, transferIncrease } from "./transfer-queue";
let seed = 0;
const now = Date.now();

function getUuid() {
  return "inotification_" + now + "_" + seed++;
}

export default {
  components: { PromptItem },
  props: {
    type: {
      type: String,
      default: "info",
    },
    styles: {
      type: Object,
      default: function () {
        return {
          top: "65px",
          left: "50%",
        };
      },
    },
    content: {
      type: String,
    },
  },
  computed: {
    wrapStyles() {
      let styles = Object.assign({}, this.styles);
      styles["z-index"] = 9999 + this.tIndex;

      return styles;
    },
  },
  data() {
    return {
      notices: [],
      tIndex: this.handleGetIndex(),
      timer: "",
    };
  },
  methods: {
    add(notice) {
      const name = notice.name || getUuid();

      let _notice = Object.assign(
        {
          content: "",
          duration: 1500,
          name: name,
          showType: "single",
        },
        notice
      );
      //单个展示模式
      if (notice.showType === "single" && this.notices.length) {
        Object.keys(_notice).map((key) => {
          if (key !== "name") {
            this.notices[0][key] = _notice[key];
          }
        });
        this.timer && clearTimeout(this.timer);
        if (notice.duration !== 0) {
          this.timer = setTimeout(() => {
            this.close(this.notices[0]["name"]);
          }, notice.duration);
        }

        console.log(this.$refs);
        if (!["info", "success"].includes(notice.type))
          this.$refs.notice_0 && this.$refs.notice_0[0].shake();
        return name;
      }
      this.notices.push(_notice);
      this.tIndex = this.handleGetIndex();

      if (_notice.duration !== 0) {
        this.timer = setTimeout(() => {
          this.close(name);
          _notice.onClose()
        }, notice.duration);
      }
      return name;
    },
    close(name) {
      // console.log(name);
      const notices = [...this.notices];
      for (let i = 0; i < notices.length; i++) {
        if (notices[i].name === name) {
          this.notices.splice(i, 1);
          break;
        }
      }
    },
    closeAll() {
      this.notices = [];
    },
    handleGetIndex() {
      transferIncrease();
      return transferIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
.d-prompt {
  position: fixed;
  width: 100%;
  top: 16px;
  left: 0;
  pointer-events: none;
  z-index: 9000;
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
</style>

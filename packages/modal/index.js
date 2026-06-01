import ModalBox from "./ModalBox.vue";
import { createApp, h, render } from "vue";

const newInstance = (properties) => {
  const _props = properties || {};

  const mountNode = document.createElement("div");
  document.body.appendChild(mountNode);

  const Instance = createApp(ModalBox, {
    ..._props,
    modelValue: true,
    // remove() {
    //   app.unmount(mountNode);
    //   document.body.removeChild(mountNode);
    // },
  });

  console.log(Instance);
  let instance = Instance.mount(mountNode);
  return instance;
};

mouseListen();
globalThis.mousePosition = {};
function mouseListen() {
  const getClickPosition = (e) => {
    mousePosition = {
      x: e.pageX,
      y: e.pageY,
    };
    // console.log(mousePosition);
    // 100ms 内发生过点击事件，则从点击位置动画展示
    // 否则直接 zoom 展示
    // 这样可以兼容非点击方式展开
    setTimeout(() => (mousePosition = null), 100);
  };

  // 只有点击事件支持从鼠标位置动画展开
  if (
    typeof globalThis !== "undefined" &&
    globalThis.document &&
    globalThis.document.documentElement
  ) {
    document.addEventListener("click", getClickPosition, true);
  }
}

const prompt = {
  name: "Prompt",
  info(options, ...args) {
    return this.message("info", options, ...args);
  },
  error(options, ...args) {
    return this.message("error", options, ...args);
  },
  warning(options, ...args) {
    return this.message("warning", options, ...args);
  },
  success(options, ...args) {
    return this.message("success", options, ...args);
  },
  confirm(options, ...args) {
    return this.message("confirm", options, ...args);
  },
  message(type, options, ...args) {
    if (typeof options === "string") {
      options = {
        content: options,
        type,
        isShowTitle: false,
        ...args[0],
      };
    }
    console.log(options);
    return newInstance(options);
  },
};

export default prompt;

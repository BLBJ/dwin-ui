import Prompt from "./base/prompt.vue";
import { createApp, h } from "vue";

const newInstance = (properties) => {
  const _props = properties || {};
  console.log(Prompt);
  const Instance = createApp({
    ...Prompt,
    props: _props,
  });
  const parent = document.createElement("div");
  const Instance_ = Instance.mount(parent);
  document.body.appendChild(Instance_.$el);
  const notification = Instance_;

  return {
    noitce(noticeProps) {
      return notification.add(noticeProps);
    },
    remove(name) {
      notification.close(name);
    },
    component: notification,
    destory(element) {
      notification.closeAll();
      setTimeout(() => {
        document.body.removeChild(document.getElementsByClassName(element)[0]);
      }, 500);
    },
  };
};

const defaults = {
  top: 84,
  duration: 3 * 1000,
};

let messageInstance;
let name = 1;
const prefixKey = "wb_message_key_";
const showType = "single"; //single/ multiple 展示方式 单个/多个

function getMessageInstance() {
  messageInstance =
    messageInstance ||
    newInstance({
      styles: {
        top: `${defaults.top}px`,
      },
    });
  return messageInstance;
}

function notice(
  type,
  options = {}
) {
  const instance = getMessageInstance();
  let options_default = {
    content: "",
    styles: {},
    duration: defaults.duration,
    showType: showType,
    onClose: function () { },
  }
  options = Object.assign(options_default, options);
  return instance.noitce({
    name: `${prefixKey}${name++}`,
    type,
    ...options
  });
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
  message(type, options, ...args) {
    if (typeof options === "string") {
      options = {
        content: options,
        duration: args[0] || defaults.duration,
      };
    }
    return notice(type, options);
  },
  remove(name) {
    return messageInstance.remove(name);
  },
};



export default prompt;

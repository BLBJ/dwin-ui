export default {
	beforeMount(el, binding) {
      function documentHandler (e) {
        if (!el.contains(e.target) || (el === e.target)) {
          binding.value(e);
        }
      }
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler, true);
	
	},
	unmounted(el) {
		// 在组件销毁前，移除事件监听器以避免内存泄漏
        document.removeEventListener('click', el.__vueClickOutside__, true);
        delete el.__vueClickOutside__;
	},
}
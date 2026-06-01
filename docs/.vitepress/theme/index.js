// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import DwinUI from  '../../../dwin-ui/dist/index.es';
import '../../../dwin-ui/dist/style.css';

export default {
    ...DefaultTheme,
    enhanceApp: async ({ app, router, siteData }) => {
        // app is the Vue 3 app instance from `createApp()`. router is VitePress'
        // custom router. `siteData`` is a `ref`` of current site-level metadata.
          app.use(DwinUI);
      },
}
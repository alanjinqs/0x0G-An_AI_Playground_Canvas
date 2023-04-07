import { createApp } from "vue"
import { createPinia } from "pinia"
import VMdPreview from "@kangc/v-md-editor/lib/preview"
import "@kangc/v-md-editor/lib/style/preview.css"
import vuePressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js"

import App from "./App.vue"
import router from "./router"
import "@/assets/main.css"
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/cdn"

import Prism from "prismjs"

VMdPreview.use(vuePressTheme, {
  Prism,
  extend(md: any) {
    // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
    // md.set(option).use(plugin);
  }
})
VMdPreview.use(createKatexPlugin())

const app = createApp(App)

app.use(VMdPreview)

app.use(createPinia())
app.use(router)

app.mount("#app")

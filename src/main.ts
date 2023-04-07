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

  }
})
VMdPreview.use(createKatexPlugin())

const app = createApp(App)

app.use(VMdPreview)

app.use(createPinia())
app.use(router)

app.mount("#app")

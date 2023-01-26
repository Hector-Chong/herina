import { defineConfig } from "vitepress";
import { getConfigurationConfigEn, getGuideConfigEn } from "./lang/en";
import { getConfigurationConfigZhCn, getGuideConfigZhCn } from "./lang/zh-cn";

export default defineConfig({
  title: "Herina",
  description: "Build bundle with Herina.",
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        sidebar: {
          "/guide/": getGuideConfigEn(),
          "/configuration/": getConfigurationConfigEn()
        },
        nav: [
          { text: "Guide", link: "/guide/herina" },
          { text: "Configuration", link: "/configuration/introduction" },
          { text: "Author", link: "/author/index" }
        ]
      }
    },
    ["zh-cn"]: {
      label: "简体中文",
      lang: "zh-cn",
      link: "/zh-cn",
      themeConfig: {
        sidebar: {
          "/zh-cn/guide/": getGuideConfigZhCn(),
          "/zh-cn/configuration/": getConfigurationConfigZhCn()
        },
        nav: [
          { text: "指引", link: "/zh-cn/guide/herina" },
          { text: "配置", link: "/zh-cn/configuration/introduction" },
          { text: "开发人", link: "/zh-cn/author/index" }
        ]
      }
    }
  },
  themeConfig: {
    logo: "/image/herina.png",
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2022-present Héctor Chong"
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/Hector-Chong/herina" }
    ]
  },
  head: [["style", {}, ".VPImage{border-radius:24px }"]]
});

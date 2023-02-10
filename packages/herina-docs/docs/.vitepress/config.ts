import { defineConfig } from "vitepress";
import { getConfigurationConfigEn, getGuideConfigEn } from "./lang/en";
import { getConfigurationConfigZhCn, getGuideConfigZhCn } from "./lang/zh-cn";

export default defineConfig({
  title: "Herina",
  description: "Build bundle with Herina.",
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-cn",
      themeConfig: {
        sidebar: {
          "/guide/": getGuideConfigZhCn(),
          "/configuration/": getConfigurationConfigZhCn()
        },
        nav: [
          { text: "指引", link: "/guide/herina" },
          { text: "配置", link: "/configuration/introduction" },
          { text: "开发人", link: "/author/index" }
        ]
      }
    },
    ["en"]: {
      label: "English",
      lang: "en",
      link: "/en",
      themeConfig: {
        sidebar: {
          "/en/guide/": getGuideConfigEn(),
          "/en/configuration/": getConfigurationConfigEn()
        },
        nav: [
          { text: "Guide", link: "/en/guide/herina" },
          { text: "Configuration", link: "/en/configuration/introduction" },
          { text: "Author", link: "/en/author/index" }
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

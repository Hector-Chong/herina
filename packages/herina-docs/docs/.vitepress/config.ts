import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Herina",
  description: "Build bundle with Herina.",
  themeConfig: {
    logo: "/image/herina.png",
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2022-present Héctor Chong"
    },
    sidebar: {
      "/guide/": getGuideConfig(),
      "/configuration/": getConfigurationConfig()
    },
    nav: [
      { text: "Guide", link: "/guide/herina" },
      { text: "Configuration", link: "/configuration/introduction" },
      { text: "Author", link: "/author/index" }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Hector-Chong/herina" }
    ]
  },
  head: [["style", {}, ".VPImage{border-radius:24px }"]]
});

function getGuideConfig() {
  return [
    {
      text: "Introduction",
      items: [
        {
          text: "Herina",
          link: "/guide/herina",
          activeMatch: "/guide/"
        },
        {
          text: "Installation",
          link: "/guide/installation"
        },
        {
          text: "Configuration",
          link: "/guide/configuration"
        },
        {
          text: "Concepts",
          link: "/guide/concepts"
        },
        {
          text: "Getting Started",
          link: "/guide/getting-started"
        }
      ]
    },
    {
      text: "Update",
      items: [
        {
          text: "Full Update",
          link: "/guide/update/full"
        },
        {
          text: "Incremental Update",
          link: "/guide/update/incremental"
        }
      ]
    },
    {
      text: "Others",
      items: [
        {
          text: "Dynamic import",
          link: "/guide/others/dynamic-import"
        }
      ]
    },
    {
      text: "Packages",
      items: [
        {
          text: "@herina-rn/core",
          items: [
            {
              text: "Introduction",
              link: "/guide/packages/core/introduction"
            },
            {
              text: "Types",
              link: "/guide/packages/core/types"
            },
            {
              text: "build()",
              link: "/guide/packages/core/build"
            },
            {
              text: "buildIncremental()",
              link: "/guide/packages/core/buildIncremental"
            },
            {
              text: "buildVersionsJson()",
              link: "/guide/packages/core/buildVersionsJson"
            },
            {
              text: "defineHerinaConfig()",
              link: "/guide/packages/core/defineHerinaConfig"
            }
          ]
        },
        {
          text: "@herina-rn/client",
          items: [
            {
              text: "Introduction",
              link: "/guide/packages/client/introduction"
            },
            {
              text: "registerUpdateManager()",
              link: "/guide/packages/client/registerUpdateManager"
            },
            {
              text: "getUpdateManager()",
              link: "/guide/packages/client/getUpdateManager"
            },
            {
              text: "UpdateManager",
              items: [
                {
                  text: "Introduction",
                  link: "/guide/packages/client/updateManager/introduction"
                },
                {
                  text: "checkForUpdate()",
                  link: "/guide/packages/client/updateManager/checkForUpdate"
                },
                {
                  text: "requestBundleUpdate()",
                  link: "/guide/packages/client/updateManager/requestBundleUpdate"
                },
                {
                  text: "requestIncrementalUpdates()",
                  link: "/guide/packages/client/updateManager/requestIncrementalUpdates"
                },
                {
                  text: "applyBundleUpdate()",
                  link: "/guide/packages/client/updateManager/applyBundleUpdate"
                },
                {
                  text: "applyIncrementalUpdate()",
                  link: "/guide/packages/client/updateManager/applyIncrementalUpdate"
                },
                {
                  text: "isBundleUpdateAvailable()",
                  link: "/guide/packages/client/updateManager/isBundleUpdateAvailable"
                },
                {
                  text: "isIncrementalUpdateAvailable()",
                  link: "/guide/packages/client/updateManager/isIncrementalUpdateAvailable"
                },
                {
                  text: "clearCache()",
                  link: "/guide/packages/client/updateManager/clearCache"
                },
                {
                  text: "setUseOriginalBundle()",
                  link: "/guide/packages/client/updateManager/setUseOriginalBundle"
                },
                {
                  text: "reloadApp()",
                  link: "/guide/packages/client/updateManager/reloadApp"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

function getConfigurationConfig() {
  return [
    {
      text: "Configuration",
      items: [
        {
          text: "Introduction",
          link: "/configuration/introduction"
        },
        {
          text: "Global Config",
          link: "/configuration/global"
        },
        {
          text: "Incremental Config",
          link: "/configuration/incremental"
        }
      ]
    }
  ];
}

export function getGuideConfigZhCn() {
  return [
    {
      text: "介绍",
      items: [
        {
          text: "Herina",
          link: "/guide/herina",
          activeMatch: "/guide/"
        },
        {
          text: "安装",
          link: "/guide/installation"
        },
        {
          text: "配置",
          link: "/guide/configuration"
        },
        {
          text: "概念",
          link: "/guide/concepts"
        },
        {
          text: "比较",
          link: "/guide/comparisons"
        },
        {
          text: "开始上手",
          link: "/guide/getting-started"
        }
      ]
    },
    {
      text: "更新",
      items: [
        {
          text: "代码更新",
          link: "/guide/update/code"
        },
        {
          text: "资源文件更新",
          link: "/guide/update/assets"
        }
      ]
    },
    {
      text: "其它",
      items: [
        {
          text: "动态 Import",
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
              text: "介绍",
              link: "/guide/packages/core/introduction"
            },
            {
              text: "类型声明",
              link: "/guide/packages/core/types"
            },
            {
              text: "buildUpdate()",
              link: "/guide/packages/core/buildUpdate"
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
              text: "介绍",
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
                  text: "requestUpdate()",
                  link: "/guide/packages/client/updateManager/requestUpdate"
                },
                {
                  text: "applyUpdate()",
                  link: "/guide/packages/client/updateManager/applyUpdate"
                },
                {
                  text: "isUpdateAvailable()",
                  link: "/guide/packages/client/updateManager/isUpdateAvailable"
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

export function getConfigurationConfigZhCn() {
  return [
    {
      text: "配置",
      items: [
        {
          text: "介绍",
          link: "/configuration/introduction"
        },
        {
          text: "全局配置",
          link: "/configuration/global"
        }
      ]
    }
  ];
}

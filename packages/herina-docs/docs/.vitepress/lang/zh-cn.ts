export function getGuideConfigZhCn() {
  return [
    {
      text: "介绍",
      items: [
        {
          text: "Herina",
          link: "/zh-cn/guide/herina",
          activeMatch: "/zh-cn/guide/"
        },
        {
          text: "安装",
          link: "/zh-cn/guide/installation"
        },
        {
          text: "配置",
          link: "/zh-cn/guide/configuration"
        },
        {
          text: "概念",
          link: "/zh-cn/guide/concepts"
        },
        {
          text: "开始上手",
          link: "/zh-cn/guide/getting-started"
        }
      ]
    },
    {
      text: "代码更新",
      items: [
        {
          text: "全量更新",
          link: "/zh-cn/guide/update/full"
        },
        {
          text: "递增式更新",
          link: "/zh-cn/guide/update/incremental"
        }
      ]
    },
    {
      text: "其它",
      items: [
        {
          text: "动态 Import",
          link: "/zh-cn/guide/others/dynamic-import"
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
              link: "/zh-cn/guide/packages/core/introduction"
            },
            {
              text: "类型声明",
              link: "/zh-cn/guide/packages/core/types"
            },
            {
              text: "build()",
              link: "/zh-cn/guide/packages/core/build"
            },
            {
              text: "buildIncremental()",
              link: "/zh-cn/guide/packages/core/buildIncremental"
            },
            {
              text: "buildVersionsJson()",
              link: "/zh-cn/guide/packages/core/buildVersionsJson"
            },
            {
              text: "defineHerinaConfig()",
              link: "/zh-cn/guide/packages/core/defineHerinaConfig"
            }
          ]
        },
        {
          text: "@herina-rn/client",
          items: [
            {
              text: "介绍",
              link: "/zh-cn/guide/packages/client/introduction"
            },
            {
              text: "registerUpdateManager()",
              link: "/zh-cn/guide/packages/client/registerUpdateManager"
            },
            {
              text: "getUpdateManager()",
              link: "/zh-cn/guide/packages/client/getUpdateManager"
            },
            {
              text: "UpdateManager",
              items: [
                {
                  text: "Introduction",
                  link: "/zh-cn/guide/packages/client/updateManager/introduction"
                },
                {
                  text: "checkForUpdate()",
                  link: "/zh-cn/guide/packages/client/updateManager/checkForUpdate"
                },
                {
                  text: "requestBundleUpdate()",
                  link: "/zh-cn/guide/packages/client/updateManager/requestBundleUpdate"
                },
                {
                  text: "requestIncrementalUpdates()",
                  link: "/zh-cn/guide/packages/client/updateManager/requestIncrementalUpdates"
                },
                {
                  text: "applyBundleUpdate()",
                  link: "/zh-cn/guide/packages/client/updateManager/applyBundleUpdate"
                },
                {
                  text: "applyIncrementalUpdate()",
                  link: "/zh-cn/guide/packages/client/updateManager/applyIncrementalUpdate"
                },
                {
                  text: "isBundleUpdateAvailable()",
                  link: "/zh-cn/guide/packages/client/updateManager/isBundleUpdateAvailable"
                },
                {
                  text: "isIncrementalUpdateAvailable()",
                  link: "/zh-cn/guide/packages/client/updateManager/isIncrementalUpdateAvailable"
                },
                {
                  text: "clearCache()",
                  link: "/zh-cn/guide/packages/client/updateManager/clearCache"
                },
                {
                  text: "setUseOriginalBundle()",
                  link: "/zh-cn/guide/packages/client/updateManager/setUseOriginalBundle"
                },
                {
                  text: "reloadApp()",
                  link: "/zh-cn/guide/packages/client/updateManager/reloadApp"
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
          link: "/zh-cn/configuration/introduction"
        },
        {
          text: "全局配置",
          link: "/zh-cn/configuration/global"
        },
        {
          text: "递增式更新配置",
          link: "/zh-cn/configuration/incremental"
        }
      ]
    }
  ];
}

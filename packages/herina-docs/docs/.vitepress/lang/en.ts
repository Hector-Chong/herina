export function getGuideConfigEn() {
  return [
    {
      text: "Introduction",
      items: [
        {
          text: "Herina",
          link: "/en/guide/herina",
          activeMatch: "/en/guide/"
        },
        {
          text: "Installation",
          link: "/en/guide/installation"
        },
        {
          text: "Configuration",
          link: "/en/guide/configuration"
        },
        {
          text: "Concepts",
          link: "/en/guide/concepts"
        },
        {
          text: "Getting Started",
          link: "/en/guide/getting-started"
        }
      ]
    },
    {
      text: "Update",
      items: [
        {
          text: "Full Update",
          link: "/en/guide/update/full"
        },
        {
          text: "Incremental Update",
          link: "/en/guide/update/incremental"
        }
      ]
    },
    {
      text: "Others",
      items: [
        {
          text: "Dynamic import",
          link: "/en/guide/others/dynamic-import"
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
              link: "/en/guide/packages/core/introduction"
            },
            {
              text: "Types",
              link: "/en/guide/packages/core/types"
            },
            {
              text: "build()",
              link: "/en/guide/packages/core/build"
            },
            {
              text: "buildIncremental()",
              link: "/en/guide/packages/core/buildIncremental"
            },
            {
              text: "buildVersionsJson()",
              link: "/en/guide/packages/core/buildVersionsJson"
            },
            {
              text: "defineHerinaConfig()",
              link: "/en/guide/packages/core/defineHerinaConfig"
            }
          ]
        },
        {
          text: "@herina-rn/client",
          items: [
            {
              text: "Introduction",
              link: "/en/guide/packages/client/introduction"
            },
            {
              text: "registerUpdateManager()",
              link: "/en/guide/packages/client/registerUpdateManager"
            },
            {
              text: "getUpdateManager()",
              link: "/en/guide/packages/client/getUpdateManager"
            },
            {
              text: "UpdateManager",
              items: [
                {
                  text: "Introduction",
                  link: "/en/guide/packages/client/updateManager/introduction"
                },
                {
                  text: "checkForUpdate()",
                  link: "/en/guide/packages/client/updateManager/checkForUpdate"
                },
                {
                  text: "requestUpdate()",
                  link: "/en/guide/packages/client/updateManager/requestUpdate"
                },
                {
                  text: "requestIncrementalUpdates()",
                  link: "/en/guide/packages/client/updateManager/requestIncrementalUpdates"
                },
                {
                  text: "applyUpdate()",
                  link: "/en/guide/packages/client/updateManager/applyUpdate"
                },
                {
                  text: "applyIncrementalUpdate()",
                  link: "/en/guide/packages/client/updateManager/applyIncrementalUpdate"
                },
                {
                  text: "isUpdateAvailable()",
                  link: "/en/guide/packages/client/updateManager/isUpdateAvailable"
                },
                {
                  text: "isIncrementalUpdateAvailable()",
                  link: "/en/guide/packages/client/updateManager/isIncrementalUpdateAvailable"
                },
                {
                  text: "clearCache()",
                  link: "/en/guide/packages/client/updateManager/clearCache"
                },
                {
                  text: "setUseOriginalBundle()",
                  link: "/en/guide/packages/client/updateManager/setUseOriginalBundle"
                },
                {
                  text: "reloadApp()",
                  link: "/en/guide/packages/client/updateManager/reloadApp"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getConfigurationConfigEn() {
  return [
    {
      text: "Configuration",
      items: [
        {
          text: "Introduction",
          link: "/en/configuration/introduction"
        },
        {
          text: "Global Config",
          link: "/en/configuration/global"
        },
        {
          text: "Incremental Config",
          link: "/en/configuration/incremental"
        }
      ]
    }
  ];
}

# 安装

```bash
yarn add @herina-rn/core @herina-rn/client
cd ./ios && pod install
```

or

```bash
npm install --save @herina-rn/core @herina-rn/client
cd ./ios && pod install
```

## 链接库 (可选)

若你正在使用较旧的 React Native 版本，你可能需要执行以下命令将 Herina 关联至 App。

```bash
npx react-native link @herina-rn/core
npx react-native link @herina-rn/client
```

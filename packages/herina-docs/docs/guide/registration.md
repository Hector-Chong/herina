# Registration

## registerApp

Before invoking any APIs, registering Herina by invoking `registerApp` is essential.

When invoking `registerApp`, there will be a listener to receive events from Wechat. `registerApp` returns a function to remove the listener, and no events will be received from Wechat.

### Type

```typescript
function registerApp(request: {
  appid: string;
  universalLink?: string;
  log?: boolean;
  logPrefix?: string;
}): () => void;
```

### Parameters

| Name          | Type    | Required | Default Value | Description                                                  |
| ------------- | ------- | -------- | ------------- | ------------------------------------------------------------ |
| appid         | Boolean | Yes      | /             | AppID from [Developer Application Registration Page](https://open.weixin.qq.com/) |
| universalLink | String  | No       | ""            | Required on iOS. An URL for Wechat to navigate to your App. You may find it on [Developer Application Registration Page](https://open.weixin.qq.com/). |
| log           | Boolean | No       | false         | iOS only. Logging problems to troubleshoot in the Xcode logging panel. |
| logPrefix     | String  | No       | /             | iOS only. A prefix to logging.                               |

### Returns

```typescript
() => void
```

A function to remove the listener for receiving events from native.

###  Example

```jsx
import {registerApp, sendAuthRequest} from 'herina';
import {Button, Text} from 'react-native';
import {verifyWechatCode} from '@/api/auth/wechat'

useEffect(()=>{
	registerApp('wx964290141ebe9b7b');
}, [])

const onButtonClicked = async () =>{
  const {data: {code}} = await sendAuthRequest();
  
  // ...
}

return <Button onClick={onButtonClicked}>
  <Text>Send Auth Request</Text>
</Button>
```


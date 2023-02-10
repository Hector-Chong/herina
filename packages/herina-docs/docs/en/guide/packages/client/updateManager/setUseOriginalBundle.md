# setUseOriginalBundle()

Determines whether to use the original bundle or not.

## Arguments

| Name | Required | Type    | Default Value | Note |
| ---- | -------- | ------- | ------------- | ---- |
| use  | YES      | boolean | /             | /    |

## Returns

```typescript
Promise<boolean>;
```

## Example

```typescript
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager();

const restoreToOriginal = async () => {
  return manager.setUseOriginalBundle(true);
};

await restoreToOriginal();
```

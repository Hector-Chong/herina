# setUseOriginalBundle()

Determines whether to use the original bundle or not.

## Arguments

None

## Returns

```typescript
Promise<boolean>;
```

## Example

```typescript
import { registerUpdateManager } from "@herina/client";

const manager = registerUpdateManager();

const restoreToOriginal = async () => {
  return manager.setUseOriginalBundle();
};

await restoreToOriginal();
```

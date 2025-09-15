---
inclusion: always
---

# Testing Guidelines

## Frontend Testing Framework

**ALWAYS use Vitest for frontend testing, never Jest.**

### Vitest Imports and Setup
When writing frontend tests, always use these imports:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
```

### Key Differences from Jest
- Use `vi` instead of `jest` for mocking: `vi.fn()`, `vi.mock()`, `vi.clearAllMocks()`
- Use `vi.useFakeTimers()` and `vi.advanceTimersByTime()` for timer mocking
- Import test functions from 'vitest' package, not globals

### Test Commands
- Run tests: `npm test -- --run [pattern]`
- Always use `--run` flag to avoid watch mode in CI/automation contexts
- Frontend tests are configured with Vitest in `vite.config.ts`

### Backend Testing
- Backend uses Jest (NestJS standard)
- Use Jest syntax for backend tests only

### Example Vitest Test Structure
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', () => {
    // Test implementation
  });
});
```

This ensures consistency and avoids the confusion of switching between Jest and Vitest syntax during development.
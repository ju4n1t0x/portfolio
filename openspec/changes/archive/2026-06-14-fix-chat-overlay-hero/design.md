# Design: Fix Chat Overlay Hero

## Overview
Minimal conditional rendering fix in `ChatInterface.tsx` to prevent the Hero section from overlapping chat messages.

## Architecture Impact
- **No architectural changes**
- **No new components**
- **No state management changes**
- **Single file modification**

## Technical Approach

### Current State
```tsx
{!currentSection && (
  <WelcomeScreen ... />
)}
```

The Hero renders when `currentSection` is `null`. This doesn't account for the case where messages exist but no section is active (e.g., user types a free-text message).

### Target State
```tsx
{!currentSection && !hasMessages && (
  <WelcomeScreen ... />
)}
```

The Hero renders only when:
1. No section is active (`!currentSection`)
2. AND no messages exist (`!hasMessages`)

### Implementation Details
- **File**: `portfolio/src/components/organisms/ChatInterface/ChatInterface.tsx`
- **Line**: ~377 (inside the `ChatInterface` component return)
- **Change**: Add `&& !hasMessages` to the existing condition
- **Variable**: `hasMessages` is already defined at line ~279: `const hasMessages = messages.length > 0`

## Risk Assessment
- **Risk**: Minimal
- **Scope**: Single conditional expression
- **Side effects**: None expected
- **Testing**: Manual verification of Hero visibility states

## Rollback Plan
Revert the single line change if any issues arise.

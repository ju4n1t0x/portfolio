# Proposal: Fix Chat Overlay Hero

## Intent
Fix the issue where AI chat responses are hidden behind the Hero section when the first message is sent.

## Problem
When the user sends the first message, the Hero section (`WelcomeScreen`) continues to render because the condition only checks `!currentSection`. Since `currentSection` remains `null` until a suggestion button is clicked, both the Hero and the messages render simultaneously. The Hero with `flex-1` takes all available space and overlaps the chat messages.

## Scope
- **Files**: `portfolio/src/components/organisms/ChatInterface/ChatInterface.tsx`
- **Changes**: Single conditional rendering logic update
- **Risk**: Minimal - isolated change with no side effects

## Approach
Change the Hero rendering condition from:
```tsx
{!currentSection && (
  <WelcomeScreen ... />
)}
```

To:
```tsx
{!currentSection && !hasMessages && (
  <WelcomeScreen ... />
)}
```

This ensures the Hero hides as soon as there are messages, regardless of whether a section is active.

## Success Criteria
- Hero section disappears when the first message is sent
- Chat messages are fully visible and not overlapped
- Hero reappears when the chat is cleared (if applicable)
- No visual regression in other states

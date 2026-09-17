# Tasks: Fix Chat Overlay Hero

## Implementation Tasks

### Task 1: Update Hero Rendering Condition

**Description**: Update the conditional rendering of the WelcomeScreen component in ChatInterface.tsx to hide the Hero when messages exist.

**File**: `portfolio/src/components/organisms/ChatInterface/ChatInterface.tsx`

**Location**: Line ~377 (inside the ChatInterface component return)

**Current Code**:
```tsx
{!currentSection && (
  <WelcomeScreen
    onProjects={handleProjectsSuggestion}
    onExperience={handleExperienceSuggestion}
    onContact={handleContactSuggestion}
    avatarSrc={heroAvatar}
  />
)}
```

**Target Code**:
```tsx
{!currentSection && !hasMessages && (
  <WelcomeScreen
    onProjects={handleProjectsSuggestion}
    onExperience={handleExperienceSuggestion}
    onContact={handleContactSuggestion}
    avatarSrc={heroAvatar}
  />
)}
```

**Acceptance Criteria**:
- [ ] Hero section hides when first message is sent
- [ ] Hero section hides when suggestion button is clicked
- [ ] Hero section reappears when chat is cleared (if applicable)
- [ ] No visual regression in existing states
- [ ] Messages are fully visible without overlap

**Dependencies**: None

**Estimated Effort**: 5 minutes

**Risk**: Low

## Review Workload Forecast

- **Estimated changed lines**: 1 line modified
- **Files changed**: 1 file
- **400-line budget risk**: Low
- **Chained PRs recommended**: No
- **Decision needed before apply**: No

## Delivery Strategy

- **delivery_strategy**: `ask-always`
- **chain_strategy**: Not applicable (single task, minimal change)
- **Review budget**: 80 lines (user-specified)

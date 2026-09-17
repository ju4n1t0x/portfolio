# Chat Hero Visibility Specification

## Purpose

Controls when the Hero (WelcomeScreen) is visible versus hidden in the ChatInterface, ensuring chat messages are never overlapped by the Hero section.

## Requirements

### Requirement: Hero Hides on First Message

The system MUST hide the Hero section when the conversation has any messages, regardless of whether a section is active.

The Hero rendering condition SHALL be `{!currentSection && !hasMessages}`, not `{!currentSection}` alone.

#### Scenario: User sends free-text message

- GIVEN no section is active (`currentSection` is null) and no messages exist
- WHEN the user sends a free-text chat message
- THEN the Hero section is hidden
- AND chat messages are fully visible without overlap

#### Scenario: User sends message while section is active

- GIVEN a section is already active (`currentSection` is not null)
- WHEN the user sends a chat message
- THEN the Hero section remains hidden (previous behavior preserved)

### Requirement: Hero Hides on Suggestion Click

The system MUST hide the Hero when the user clicks a suggestion button, since clicking a suggestion both sets `currentSection` and adds messages.

#### Scenario: User clicks a suggestion button

- GIVEN the Hero is currently visible
- WHEN the user clicks any suggestion button (projects, experience, contact)
- THEN `currentSection` is set to the relevant section
- AND messages are added to the conversation
- AND the Hero section is hidden

### Requirement: Hero Reappears on Chat Clear

The system SHOULD show the Hero section again when the chat is cleared and no section is active.

#### Scenario: Chat is cleared

- GIVEN the conversation has messages and no section is active
- WHEN all messages are cleared (e.g., new conversation)
- THEN the Hero section reappears
- AND the chat message area is hidden

#### Scenario: Section cleared but messages remain

- GIVEN a section is active and messages exist
- WHEN the section is cleared but messages are not removed
- THEN the Hero section remains hidden (because `hasMessages` is true)
- AND messages remain visible

### Requirement: No Visual Regression in Existing States

The system SHALL NOT introduce visual regressions in states where the Hero visibility already works correctly.

#### Scenario: Section active, no messages before fix

- GIVEN a section is active with messages
- WHEN the fix is applied
- THEN the behavior is identical to before (Hero hidden, messages visible)
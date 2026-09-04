# Salvo AI Chatbot Guide

## Overview

The Salvo AI Assistant is a floating chatbot widget available throughout the authenticated application. It provides instant help with navigation, feature understanding, and platform guidance.

## Features

### Design Philosophy
- **Institutional Aesthetic**: Matches the deep-space command center design language
- **No Cartoonish Elements**: Professional, enterprise-grade interface
- **Consistent Colors**: Uses Salvo's color palette (primary: #3D50FC, ai-signal: #05E0E0)
- **Floating Widget**: Always accessible in bottom-right corner

### Capabilities

The chatbot can help with:

1. **Recovery Strategies**
   - Explanation of different recovery methods
   - When each strategy is applied
   - Success rates and cost implications

2. **Platform Navigation**
   - Guide users to different screens
   - Explain what each section does
   - Help find specific features

3. **AI Diagnosis**
   - How the diagnosis engine works
   - Understanding confidence scores
   - Interpreting recommendations

4. **Metrics & KPIs**
   - Dashboard metric explanations
   - Recovery yield calculations
   - Performance indicators

5. **Policy Rules**
   - Understanding policy gates
   - Threshold explanations
   - Risk tolerance settings

6. **Integration Setup**
   - Razorpay connection guide
   - Configuration steps
   - Troubleshooting tips

7. **Audit & Compliance**
   - Accessing audit logs
   - Understanding log entries
   - Compliance tracking

## Usage

### Opening the Chatbot
- Click the floating purple button with message icon in the bottom-right corner
- Button is always visible on authenticated screens

### Interacting
- Type your question in the input field
- Press Enter or click the Send button
- AI responds instantly with relevant information

### Closing
- Click the X button in the chatbot header
- Chatbot minimizes back to floating button
- Conversation history is preserved during session

## Sample Questions

Try asking:
- "What are the recovery strategies?"
- "How does diagnosis work?"
- "Where can I find metrics?"
- "How do I set up Razorpay integration?"
- "What is the policy gate?"
- "Show me the simulator"
- "Explain recovery yield"
- "How do I view audit logs?"

## Technical Details

### Component Location
- `src/ui/components/chatbot/AIChatbot.tsx`
- Integrated in `src/ui/layout/AppShell.tsx`

### State Management
- Local React state (no external dependencies)
- Message history maintained during session
- Auto-scroll to latest message

### Response System
- Pattern-based intelligent responses
- Context-aware fallbacks
- Instant reply (800ms simulated thinking time)

### Styling
- Tailwind CSS with Salvo design tokens
- Responsive (mobile: full screen, desktop: fixed 380x600px)
- Smooth animations and transitions

## Future Enhancements

Potential improvements:
- [ ] Backend API integration for dynamic responses
- [ ] Context awareness from current screen
- [ ] Transaction-specific help
- [ ] Natural language query to API endpoints
- [ ] Multi-turn conversation memory
- [ ] Quick action buttons (navigate, execute, etc.)
- [ ] File/screenshot attachment support
- [ ] Export conversation history

## Accessibility

- Keyboard navigation (Tab, Enter)
- ARIA labels for screen readers
- Focus management
- Semantic HTML structure

## Browser Support

Tested on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

---

**Last Updated**: 2026-09-03
**Version**: 1.0.0

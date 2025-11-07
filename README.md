## App Description

Shadow is an AI-powered training app designed to help sales reps improve their communication and performance. The app allows users to record pitches, receive AI-generated feedback, and review detailed performance insights. 

---

## HIG Implementation

Each screen uses a clear hierarchy, logical grouping, and familiar navigation patterns to help users understand the app’s flow without needing instructions. The bottom tab navigation follows the native iOS layout, giving users quick access to the Record, Insights, Training, Chat, and Settings screens familiarly and predictably. The app’s color theme provides a strong contrast between the background and text.

In Shadow, the large circular **Record** button on the Home screen uses a bold accent color and a microphone icon to instantly convey that it starts a new recording. Similarly, the **Save** and **Delete** buttons in the Recording Review modal are labeled with strong, high-contrast text to ensure users understand the outcome of each action before tapping. Icons throughout the app follow HIG’s guidance to use universally recognizable symbols, such as a **gear** for Settings, a **stats chart** for Insights, and a **chat bubble** for the Chat tab. These icons help users quickly understand navigation without needing to read every label.

When a user begins recording, the Record button expands and pulses to confirm that recording is active. Pressable elements provide subtle opacity changes when tapped, offering immediate visual feedback that an interaction was registered. The **Review Recording** modal slides smoothly up from the bottom of the screen, maintaining a sense of spatial continuity consistent with native iOS transitions. When system permissions—such as microphone or location access—are denied, the app presents a native **Alert dialog** that clearly explains the issue and offers an “Open Settings” option. Additionally, the combination of consistent icons, well-communicated actions, appropriate motion, and native feedback patterns ensures that the app not only looks polished but also behaves in a way users naturally expect from high-quality iOS applications.

---

## HIG Implementation for API
When the user records a pitch on the **Home screen** and submits it for grading, the app calls `sendRecordingForGrade` in the background while immediately confirming what’s happening through clear system feedback: the user sees an alert that grading is in progress, and another when the grade is ready, instead of being left waiting without context. That remote response is then stored via the `RecordingsProvider` so results load instantly and consistently the next time the user opens the app, matching HIG principles around continuity of experience and making past interactions easily recoverable without re-fetching or re-doing work.

The **Chat screen** applies the same ideas to conversational AI calls. API requests made through `useChat` are reflected directly in the interface with the *“Assistant is thinking…”* bubble inline with the conversation, using a familiar iOS-style message indicator rather than a disconnected global spinner. This keeps system status closely tied to the user’s last action and avoids clutter, while errors from the chat or other calls are surfaced in-line in a short, specific message so the user understands what went wrong and what to do next. Across these flows, asynchronous work never blocks interaction: users can scroll, review content, or navigate away while network or AI tasks complete, aligning with HIG guidance to keep apps responsive and prevent operations from feeling heavy or brittle.

---
## Wireframe using Figma
# Record Page
<img width="380" height="763" alt="RECORD_WIRE" src="https://github.com/user-attachments/assets/115ffef4-b57a-4ab3-b6a3-2736e3c25ad7" />

# Insights Page
<img width="386" height="769" alt="INSIGHTS_WIRE" src="https://github.com/user-attachments/assets/805d94e3-72b7-43c0-9f12-9f2b672d5d23" />

# Chat Page
<img width="397" height="776" alt="CHAT_WIRE" src="https://github.com/user-attachments/assets/02029332-0c2c-46b3-b65b-6f11bb7fe152" />

# Settings Page
<img width="389" height="764" alt="SETTINGS_WIRE" src="https://github.com/user-attachments/assets/57159563-ffed-475d-883c-c2586ffd128c" />


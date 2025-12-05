## App Description

Shadow is an AI-powered training app designed to help sales reps improve their communication and performance. The app allows users to record pitches, receive AI-generated feedback, and review detailed performance insights. 


---

## HIG Implementation

* **Clear Hierarchy, Logical Grouping, and Familiar Navigation:**
    * I use a clear hierarchy, logical grouping on each screen, and the native iOS-style **bottom tab navigation** for quick access to Record, Insights, Training, Chat, and Settings.
* **Strong Contrast and Visual Clarity:**
    * The app's **color theme** providing a strong contrast between the background and text.
    * The **Save and Delete buttons** in the Recording Review modal being labeled with strong, high-contrast text.
* **Instantly Convey Action/Purpose:**
    * The large circular **Record button** on the Home screen using a bold accent color and a microphone icon.
* **Use Universally Recognizable Icons:**
    * The icons follow HIG guidance, such as a **gear for Settings**, a **stats chart for Insights**, and a **chat bubble for the Chat tab**.
* **Provide Immediate Visual Feedback:**
    * The **Record button expanding and pulsing** when recording is active to confirm the status.
    * The pressable elements providing **subtle opacity changes when tapped**.
* **Maintain Spatial Continuity (Appropriate Motion):**
    * The **Review Recording modal sliding smoothly up** from the bottom, consistent with native iOS transitions.
* **Use Native System Feedback (Alerts):**
    * The app presents a **native Alert dialog** that clearly explains the issue and offers an "Open Settings" option when system permissions (like microphone or location access) are denied.

---

## HIG Implementation for API

* **Provide Immediate System Feedback for Asynchronous Tasks (API):**
    * I immediately confirm the API call (`sendRecordingForGrade`) with an **alert that grading is in progress**, and a second alert when the grade is ready, preventing the user from waiting without context.
* **Ensure Continuity of Experience (API Data Persistence):**
    * The API response is being **stored via the `RecordingsProvider`**, so results load instantly and consistently when the user re-opens the app.
* **Keep System Status Tied to User Action (Chat API):**
    * The Chat screen where API requests (`useChat`) are reflected in the interface with the **“Assistant is thinking…” bubble inline** with the conversation, using a familiar iOS-style message indicator.
* **Surface Errors Clearly and Locally (API Error Handling):**
    * The errors from the chat or other calls are surfaced **in-line in a short, specific message** so the user understands what went wrong and what to do next.
* **Keep Apps Responsive (Non-Blocking API Operations):**
    * **asynchronous work never blocking interaction**, allowing users to scroll, review content, or navigate away while network or AI tasks complete.

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


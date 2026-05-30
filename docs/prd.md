# Product Requirements Document (PRD) — BookBot

BookBot is an AI-powered conversational platform built to automate customer operations for local small businesses (salons, health clinics, personal training gyms, and restaurants).

---

## 1. Value Proposition

Small business owners spend hours responding to redundant client inquiries and scheduling appointments. BookBot solves this by offering an automated AI assistant that handles:
* Answering services, pricing, and FAQ queries using the company's knowledge base context.
* Capturing user lead contact profiles (name, email, phone number) directly within chat feeds.
* Querying live calendars and scheduling bookings without manual human steps.
* Re-engaging cold leads and sending booking reminder notifications.

---

## 2. Core Feature Specifications

### A. Web Chat Widget
* **UX/UI**: Renders as a floating bubble that expands on hover/click. Responsive mobile full-screen overlay.
* **Typing Simulation**: Streams responses letter-by-letter to replicate realistic conversational interactions.
* **Lead Generation Forms**: When the conversational AI asks for contact info, the widget displays inline text inputs (rather than standard free-text chat input) to ensure accurate schema mapping.
* **Booking Panel**: Calendar slot choices are shown as clickable action buttons inside the flow.

### B. Business Management Dashboard
* **Leads Center**: A detailed table listing lead statuses, contact information, and channels. Clicking rows opens details drawers containing full chat transcripts.
* **Overview Analytics**: Visual representations of user conversions, chat volumes, and channel metrics over time.
* **Settings & Onboarding**: Simple four-step setup (Profile -> FAQ Content -> Work Hours -> Snippet copy).

### C. WhatsApp Channel Integration
* **Automation**: Customers can chat with the company directly through WhatsApp.
* **Flow**: Connects to the same prompt classification engine, with support for template alerts (e.g. appointment reminders).

### D. Billing System (Lemon Squeezy)
* **Limits**: Inbound messages are gated based on subscription plan tiers.
* **Tiers Table**:
  - **Free**: $0/mo, 100 conversations/mo, 1 business allowed.
  - **Starter**: $29/mo, 1,000 conversations/mo, 1 business allowed.
  - **Growth**: $79/mo, 5,000 conversations/mo, 3 businesses allowed, removes "Powered by BookBot" branding.
  - **Pro**: $149/mo, Unlimited conversations/mo, 10 businesses allowed, removes branding.

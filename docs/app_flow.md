# Application Flow Diagrams — BookBot

This document details the functional logic and process flows for BookBot's core subsystems.

---

## 1. Conversational Inbound Message Flow (Widget & WhatsApp)

This flow runs when a customer sends a message through the website widget or the WhatsApp channel.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer Client
    participant API as Next.js API (/api/chat)
    participant Claude as Anthropic Claude API
    participant DB as Supabase DB
    participant Cal as Google Calendar API

    Customer->>API: Send message (sessionId, message, businessSlug, channel)
    Note over API: Look up Business & verify active plan
    API->>Claude: Intent Classification Request (Greeting/QA/Booking/Lead)
    Claude-->>API: Intent category string (e.g., "booking")
    
    alt Intent is QA or Booking
        Note over API: Generate OpenAI vector of message
        API->>DB: Query similarity (match_chunks RPC)
        DB-->>API: Return top 3 text context blocks
    end

    alt Intent is Booking
        API->>Cal: Query free/busy slots
        Cal-->>API: Return busy slots
        Note over API: Filter slots within working hours
    end

    Note over API: Assemble System prompt + RAG chunks + history
    API->>Claude: Send full dialog context
    
    alt Channel is WIDGET
        Claude-->>Customer: Stream tokens character-by-character
    else Channel is WHATSAPP
        Claude-->>API: Full string response
        API->>Customer: WhatsApp message API delivery
    end
    
    Note over API: Parse message for name/phone/email
    alt Lead info detected
        API->>DB: Create or update Lead record
    end
    API->>DB: Update history in Conversation
```

---

## 2. Booking Reservation Flow

This flow runs when a customer selects a booking slot in the chat widget.

```mermaid
graph TD
    A[Customer selects slot] --> B[POST /api/bookings/create]
    B --> C{Verify slot availability}
    C -->|Slot is busy| D[Return error response]
    C -->|Slot is free| E[Create Google Calendar event]
    E --> F[Create Cal.com booking]
    F --> G[Save Booking record to DB]
    G --> H[Send email via Resend]
    G --> I[Send SMS via Twilio]
    G --> J[Schedule Follow-up reminder 24h prior]
    J --> K[Return confirmation to client]
```

---

## 3. Automated Follow-Up Engine (Cron Job)

This cron job runs daily at 9:00 AM UTC.

```mermaid
graph TD
    A[Vercel Cron Trigger] --> B[POST /api/cron/followups]
    B --> C{Verify CRON_SECRET}
    C -->|Invalid| D[Return 401 Unauthorized]
    C -->|Valid| E[Query PENDING follow-ups where scheduledAt <= now]
    E --> F{For each follow-up}
    F -->|WhatsApp| G[Send WhatsApp template reminder]
    F -->|Widget| H[Send notification email via Resend]
    F -->|SMS| I[Send SMS via Twilio]
    G & H & I --> J[Update Follow-up status to SENT]
    J --> K[Log results and return 200 OK]
```

# Supplementary Documentation — BookBot

This file contains additional guidelines, references, command checklists, and notes to assist in development.

---

## 1. Quick Reference Commands

### Development
Start the Next.js development server:
```bash
npm run dev
```

### Compile the Chat Widget
Rebuild the embeddable chat widget script from source:
```bash
npm run build:widget
```

### Database Operations
Generate new Prisma Client definitions:
```bash
npx prisma generate
```
Generate and execute local migrations:
```bash
npx prisma migrate dev --name your_migration_name
```
Execute pending migrations on the production database:
```bash
npx prisma migrate deploy
```

---

## 2. Integration Webhook Targets

### WhatsApp Webhook
Set up the webhook endpoint in the Meta Developer Console:
* **Callback URL**: `https://yourdomain.com/api/whatsapp/webhook`
* **Verify Token**: Must match the `WHATSAPP_VERIFY_TOKEN` env variable.
* **Fields to subscribe to**: `messages`.

### Lemon Squeezy Webhook
Set up the webhook endpoint in the Lemon Squeezy Dashboard:
* **Callback URL**: `https://yourdomain.com/api/billing/webhook`
* **Signing Secret**: Must match the `LEMONSQUEEZY_WEBHOOK_SECRET` env variable.
* **Events to subscribe to**:
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
  - `subscription_payment_success`

### Cal.com Booking Webhook
Set up the webhook endpoint in the Cal.com Dashboard:
* **Callback URL**: `https://yourdomain.com/api/bookings/webhook` (or set events directly via Cal.com API in Task 09).

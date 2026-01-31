# GP Solutions Pro

A comprehensive field service management platform built with Next.js, Supabase, and modern web technologies. Competitive with Jobber and Housecall Pro.

## Features

### Core Features
- **📅 Job Scheduling** - Schedule, assign, and track jobs with calendar views
- **👥 Customer Management** - Full CRM with contact history and notes
- **📋 Estimates/Quotes** - Create professional quotes, convert to jobs when approved
- **🧾 Invoicing** - Generate invoices, track payments, send reminders
- **⏱️ Time Tracking** - Clock in/out for jobs with detailed time logs
- **💰 Expense Tracking** - Track materials, fuel, and other job costs
- **📊 Reports & Analytics** - Revenue trends, job metrics, employee performance

### Advanced Features
- **🗺️ Route Optimization** - Plan daily routes with Google Maps integration
- **👤 Lead Pipeline** - Track leads from inquiry to conversion
- **💳 Online Payments** - Accept payments via Stripe
- **📱 SMS Reminders** - Automated appointment reminders via Twilio
- **✅ Job Checklists** - Custom checklists per job type
- **🔄 Recurring Jobs** - Schedule recurring maintenance jobs
- **⭐ Review Requests** - Auto-request Google reviews after job completion

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Payments**: Stripe
- **SMS**: Twilio
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase instance (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gp-solutions-pro.git
cd gp-solutions-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials and optional Stripe/Twilio keys.

4. Run the database migration:
```sql
-- Run supabase/schema.sql in your Supabase SQL editor
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional - Payments
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Optional - SMS
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── page.tsx     # Dashboard home
│   │   ├── jobs/        # Job management
│   │   ├── customers/   # Customer CRM
│   │   ├── schedule/    # Calendar views
│   │   ├── estimates/   # Quotes
│   │   ├── invoices/    # Billing
│   │   ├── leads/       # Sales pipeline
│   │   ├── time/        # Time tracking
│   │   ├── expenses/    # Expense tracking
│   │   ├── route/       # Route optimization
│   │   ├── reports/     # Analytics
│   │   └── settings/    # Configuration
│   ├── api/             # API routes
│   │   ├── payments/    # Stripe integration
│   │   └── sms/         # Twilio integration
│   └── layout.tsx
├── components/          # Shared components
├── lib/
│   ├── supabase.ts     # Database client & types
│   ├── store.ts        # Zustand state
│   └── utils.ts        # Helper functions
└── supabase/
    └── schema.sql      # Database schema
```

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Client portal for customers
- [ ] GPS technician tracking
- [ ] Inventory management
- [ ] QuickBooks integration
- [ ] Multi-language support

## License

MIT

## Credits

Built by [GP Solutions Team]

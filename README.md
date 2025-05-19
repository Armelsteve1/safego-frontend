# 🌐 SafeGo – Frontend (Next.js)

Welcome to the **SafeGo Frontend**, the client-side application of the SafeGo platform. Built using **Next.js**, **React**, and **TailwindCSS**, this project provides a fast, responsive, and modern user interface for ride-sharing and mobility.

> 🔒 Private GitHub Repository: [`https://github.com/Armelsteve1/safego-frontend`](https://github.com/Armelsteve1/safego-frontend)

---

## ⚙️ Tech Stack

| Feature            | Tech                         |
| ------------------ | ---------------------------- |
| Framework          | Next.js (App Router)         |
| Language           | TypeScript                   |
| Styling            | TailwindCSS                  |
| Forms & Validation | React Hook Form + Zod        |
| State Management   | Context API / URL Parameters |
| Code Style         | ESLint + Prettier            |
| Build Tool         | Vite                         |
| Deployment Target  | Vercel                       |

---

## 🗂️ Project Structure

```
safego-frontend/
├── app/                → Main App routes & layout
│   ├── components/     → Shared UI components
│   ├── (auth)/         → Auth-related pages
│   ├── (trips)/        → Trip search & booking
│   ├── layout.tsx      → Global layout
│   └── page.tsx        → Home or root route
├── public/             → Static assets
├── styles/             → Tailwind base styles
├── utils/              → Helpers and utilities
├── lib/                → API or client-side libs
├── types/              → TypeScript interfaces
├── .env                → Environment variables (local)
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js `v18+`
- npm or yarn
- Vercel account (for deployment)
- Backend API running (see [safego-backend](https://github.com/Armelsteve1/safego-backend))

---

### 🔧 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/Armelsteve1/safego-frontend.git
cd safego-frontend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# → Add the appropriate API URLs and tokens

# 4. Run the dev server
npm run dev
```

---

## 🌍 Environment Variables

Create a `.env` file and define the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_COGNITO_REGION=your-region
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_S3_BUCKET=your-s3-bucket-name
```

---

## 🧹 Useful Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run start        # Start production server
```

---

## 🧪 Testing

(Currently no test framework installed – recommend Cypress or Playwright for E2E.)

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 🧠 Future Enhancements

- Responsive optimizations (mobile first)
- Unit & E2E tests
- Improved UX for trip search
- Dark mode support
- i18n (French/English)

---

## 📬 Contact

For any questions or access requests, contact:  
**Armel Steve** – [GitHub @Armelsteve1](https://github.com/Armelsteve1)

---

## 📄 License

This project is private and not licensed for public use.

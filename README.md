# 🚀 Dimas Tri Mulyo - Portfolio Website

<div align="center">
  <img src="src/assets/images/portofolio.png" alt="Portfolio Preview" width="800"/>
  
  [![Live Demo](https://img.shields.io/badge/Live-dimasu.site-00C7B7?style=for-the-badge&logo=vercel)](https://dimasu.site)
  [![GitHub](https://img.shields.io/badge/GitHub-dimasu21-181717?style=for-the-badge&logo=github)](https://github.com/dimasu21)
</div>

---

## ✨ Features

- 🌐 **Multi-language** (English & Indonesian with i18next)
- 📝 **Blog System** with Supabase CMS, pagination, and likes
- 💬 **Guestbook** with real-time comments (Google/GitHub auth)
- 🎨 **Modern UI** with Framer Motion animations & Tailwind CSS
- 🔍 **SEO Optimized** with JSON-LD, sitemap, and meta tags
- 📱 **Fully Responsive** (Mobile, Tablet, Desktop)
- 🌙 **Dark Theme** with premium glassmorphism effects

---

## 🛠️ Tech Stack

| Category       | Technologies                       |
| -------------- | ---------------------------------- |
| **Frontend**   | React 18, Vite 7                   |
| **Styling**    | Tailwind CSS, Framer Motion        |
| **Backend**    | Supabase (Auth, Database, Storage) |
| **Deployment** | Cloudflare Pages                   |
| **SEO**        | react-helmet-async, JSON-LD        |

---

## 📂 Project Structure

```
src/
├── assets/          # Images, CSS, fonts
├── components/      # Reusable UI components
├── context/         # React Context (Auth)
├── i18n/            # Translations (en.json, id.json)
├── lib/             # Supabase client, utilities
└── pages/           # Route pages
    ├── About/
    ├── Blog/        # Blog list & single post
    ├── BlogAdmin/   # Admin CMS for blog
    ├── Certificate/
    ├── Contact/
    ├── Experience/
    ├── Guestbook/
    ├── Hero/
    ├── Legal/       # Privacy & Disclaimer
    ├── Projects/
    ├── Service/
    └── Skills/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/DimasTriM/modern-portfolio.git
cd modern-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it.

### Build for Production

```bash
npm run build
```

---

## 🔐 Environment Setup

Create a Supabase project and configure the client in `src/lib/supabase.js`.

Required Supabase tables:

- `blog_posts` - Blog content
- `blog_likes` - Post likes
- `guestbook` - Guestbook messages
- `admins` - Admin email whitelist

---

## 📄 License

This project is licensed under **CC BY-NC-SA 4.0**.
You may share and adapt with attribution, non-commercially.

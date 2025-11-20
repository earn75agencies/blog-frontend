# Gidi Blog - Frontend

A modern, international blogging platform frontend built with React, TypeScript, and Tailwind CSS.

## Features

- 🌍 **Multi-language Support** - 22+ languages supported
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Fast Performance** - Optimized with React Query and code splitting
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS
- 🔐 **Authentication** - JWT-based authentication
- 📝 **Rich Text Editor** - Markdown support with syntax highlighting
- 🔍 **Search** - Full-text search capabilities
- 💬 **Comments** - Nested comment system
- 🏷️ **Tags & Categories** - Organized content
- 👥 **User Profiles** - Follow/unfollow users
- 📊 **Dashboard** - Author dashboard with statistics

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Forms**: React Hook Form
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Internationalization**: i18next
- **Build Tool**: Vite

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/      # Reusable components
│   ├── auth/       # Authentication components
│   ├── comment/    # Comment components
│   ├── layout/     # Layout components
│   ├── post/       # Post components
│   └── ui/         # UI components
├── config/         # Configuration files
├── hooks/          # Custom hooks
├── i18n/           # Internationalization
│   └── locales/    # Translation files
├── pages/          # Page components
├── services/       # API services
├── store/          # State management
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Arabic (ar)
- Hindi (hi)
- Turkish (tr)
- Dutch (nl)
- Polish (pl)
- Swedish (sv)
- Danish (da)
- Finnish (fi)
- Norwegian (no)
- Czech (cs)
- Romanian (ro)
- Hungarian (hu)
- Greek (el)

## License

MIT


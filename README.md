# AI Recruitment Dashboard

A comprehensive React TypeScript application for managing recruitment processes with role-based access control for Admin, Recruiter, and Candidate roles.

## Features

### 🎯 Role-Based Dashboard
- **Admin Dashboard**: User management, system overview, reports
- **Recruiter Dashboard**: Job management, candidate tracking, interview scheduling
- **Candidate Dashboard**: Job browsing, application tracking, interview management

### 🔧 Core Technologies
- **React 19** with TypeScript for type safety
- **React Router** for navigation and routing
- **TailwindCSS** for modern, responsive styling
- **Lucide React** for beautiful icons
- **Vite** for fast development and building

### 📊 Key Components
- Real-time interview status tracking (READY, LIVE, COMPLETED)
- Job cards with application management
- Candidate profiles with skill matching
- Dynamic dashboards with statistics
- Responsive design for all screen sizes

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar and header
│   ├── Sidebar.tsx     # Role-based navigation
│   ├── Header.tsx      # Top navigation bar
│   ├── JobCard.tsx     # Job listing component
│   ├── CandidateCard.tsx # Candidate profile component
│   └── InterviewStatus.tsx # Real-time interview status
├── pages/               # Page components by role
│   ├── auth/           # Authentication pages
│   │   └── Login.tsx   # Login page with role selection
│   ├── admin/          # Admin-specific pages
│   │   └── Dashboard.tsx
│   ├── recruiter/      # Recruiter-specific pages
│   │   └── Dashboard.tsx
│   └── candidate/      # Candidate-specific pages
│       └── Dashboard.tsx
├── routes/             # Routing configuration
│   └── AppRoutes.tsx   # Role-based routing logic
├── types/              # TypeScript type definitions
│   └── index.ts        # Core data models
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-recruitment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Usage

1. **Login**: Select your role (Admin, Recruiter, or Candidate) and enter any email/password
2. **Navigate**: Use the sidebar to access different sections based on your role
3. **Manage**: Perform role-specific actions like posting jobs, reviewing candidates, or applying for positions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Type Safety

This project uses TypeScript for comprehensive type safety including:
- User role definitions
- Job and candidate data models
- Interview session types
- Pipeline and report structures

## Styling

The application uses TailwindCSS for:
- Responsive design
- Consistent color scheme
- Modern UI components
- Dark/light theme support (configurable)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.



admin@company.com
recruiter@company.com
candidate@company.com

admin123
recruiter123
candidate123
# Personal Calendar

A React-based personal calendar application for managing weekly tasks and daily planned activities.

## Features

- **Week View**: View and manage tasks for the entire week
- **Day View**: Plan your day with time-based activities
- **Task Management**: Add, update, and delete tasks
- **Activity Planning**: Schedule activities with specific times
- **Design Tokens**: Consistent design system with reusable tokens
- **Component-Based**: Modular, reusable components

## Project Structure

```
Personal Calenda/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   └── Input/
│   ├── context/           # React Context for state management
│   │   └── CalendarContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useLocalStorage.js
│   ├── pages/             # Page components
│   │   ├── WeekView/
│   │   └── DayView/
│   ├── tokens/            # Design tokens
│   │   ├── colors.js
│   │   ├── spacing.js
│   │   ├── typography.js
│   │   ├── borders.js
│   │   └── shadows.js
│   ├── utils/             # Utility functions
│   │   └── dateUtils.js
│   ├── App.jsx            # Main app component
│   ├── App.css
│   ├── main.jsx           # App entry point
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Personal-Calenda
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

## Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment to GitHub Pages

### Option 1: Using GitHub Actions (Recommended)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages when you push to the `main` branch.

1. Make sure your repository is named exactly as specified in `vite.config.js` (currently set to `Personal-Calenda`)
2. Update the `base` path in `vite.config.js` if your repository name is different
3. Push your code to the `main` branch
4. Go to your repository Settings → Pages
5. Under "Source", select "GitHub Actions"
6. The workflow will automatically deploy on each push to `main`

### Option 2: Manual Deployment

1. Install `gh-pages` (already in devDependencies):
```bash
npm install
```

2. Build and deploy:
```bash
npm run deploy
```

3. Go to your repository Settings → Pages
4. Under "Source", select the `gh-pages` branch
5. Your site will be available at `https://<username>.github.io/Personal-Calenda/`

### Important: Update Base Path

Before deploying, make sure to update the `base` path in `vite.config.js` to match your GitHub repository name:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/Your-Repository-Name/', // Update this!
  // ...
})
```

## Design Tokens

The project uses a design token system for consistent styling:

- **Colors**: Primary, secondary, neutral, and semantic colors
- **Spacing**: Consistent spacing scale
- **Typography**: Font families, sizes, weights, and line heights
- **Borders**: Border radius and widths
- **Shadows**: Box shadows for elevation

All tokens are located in `src/tokens/` and can be imported and used throughout the application.

## Components

The project includes reusable components:

- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Card**: Container component with different styles
- **Input**: Form input with label and error handling

All components follow a consistent structure and use design tokens.

## Development

### Adding New Components

1. Create a new folder in `src/components/`
2. Create component file (e.g., `ComponentName.jsx`)
3. Create CSS file (e.g., `ComponentName.css`)
4. Create `index.js` for easy imports
5. Export from `src/components/index.js`

### Adding New Design Tokens

1. Create or update token files in `src/tokens/`
2. Export from `src/tokens/index.js`
3. Use tokens in components and pages

## License

MIT

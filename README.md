# TaskManager

A polished task manager built with Next.js, TypeScript, and Tailwind CSS. Add, complete, search, and delete tasks with smooth animations, inline validation, and clear feedback. Built to practice AI-assisted development with Cursor.

## Features

- **Add tasks** with inline validation (required, max 100 characters) and a live character counter
- **Mark tasks complete** with a checkbox and strikethrough styling
- **Delete tasks** with a confirmation dialog before removal
- **Search tasks** with a debounced input
- **Animations**: fade-in for new tasks, slide-out for deleted tasks, and hover effects with reduced-motion support
- **Helpful feedback**: loading states, success messages, and friendly empty states
- **Performance optimizations** using `React.memo`, `useCallback`, and lazy loading
- **Accessible** markup with semantic HTML, ARIA attributes, and keyboard-friendly controls

## Tech Stack

- [Next.js](https://nextjs.org/) / React
- TypeScript
- Tailwind CSS
- Vitest and React Testing Library (for tests)
- Built with [Cursor](https://cursor.com/) (AI-assisted development)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/HamzaShafiq44/TaskManager.git
   cd TaskManager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

| Command | Description |
| --- | --- |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm test` | Run the automated tests |
| `npm run lint` | Check code style |

## Usage

1. **Add a task**: type in the form at the top of the page and press **Add**. Empty tasks and tasks over 100 characters show an inline error.
2. **Complete a task**: check the box on a task card. The text is struck through. Uncheck it to restore it.
3. **Search**: type in the search box to filter tasks by title.
4. **Delete a task**: click **Delete** on a card and confirm in the dialog. Cancel keeps the task.
5. **Empty states**: when there are no tasks, or none match your search, the app shows a message explaining what to do next.

## Environment Variables

This app runs entirely in the browser and doesn't need any environment variables or API keys.

If you add a backend or external API later, create a `.env.local` file in the project root and never commit it:

```bash
# Example
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Project Structure

```
src/
├── app/            # Main page and layout
├── components/     # TaskForm, TaskList, TaskItem, EmptyState
├── hooks/          # useDebounce and other custom hooks
└── types/          # Shared TypeScript types
```

## Author

Built by [HamzaShafiq44](https://github.com/HamzaShafiq44).

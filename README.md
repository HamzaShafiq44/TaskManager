# TaskManager

A polished task manager built with Next.js, TypeScript, and Tailwind CSS. Create tasks with required deadlines, set priorities, and keep track of work with search, filters, and clear progress feedback. Tasks and theme preferences are saved in the browser.

## Features

- **Create tasks** with a title, priority, and required deadline; past dates are not allowed, and duplicate title/priority/deadline combinations are rejected
- **Complete tasks permanently** with confirmation; completed tasks cannot be reopened or edited
- **Delete tasks** with a confirmation dialog; completed tasks can still be deleted
- **Track progress** with active and completed task counts and All, Active, and Completed filters
- **Prioritize active work** by deadline, then priority
- **Highlight deadlines**, including tasks due today and overdue tasks
- **Search tasks** by title with a debounced input
- **Save tasks and theme preferences** in browser local storage
- **Accessible interactions** with inline validation, ARIA attributes, keyboard focus styling, and reduced-motion support
- **Animated feedback** when adding and deleting tasks, along with success messages and contextual empty states

## Tech Stack

- [Next.js](https://nextjs.org/) / React
- TypeScript
- Tailwind CSS
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
| `npm run lint` | Check code style |

## Usage

1. **Add a task**: enter a title, choose a priority and a deadline that is today or later, then press **Add task**. A task with the same title (ignoring letter case), priority, and deadline cannot be added twice.
2. **Complete a task**: check its box and confirm. Completed tasks are permanent and cannot be reopened or edited.
3. **Review tasks**: use the **All**, **Active**, and **Completed** filters. Active tasks are sorted by nearest deadline, with higher-priority tasks first when deadlines match.
4. **Search**: type in the search box to filter tasks by title.
5. **Delete a task**: click **Delete** on a card and confirm in the dialog. Cancel keeps the task.
6. **Keep your data**: tasks and theme preferences are stored in this browser and remain available after reloading the page.

## Environment Variables

This app runs without a backend and doesn't need any environment variables or API keys. Task data and theme preferences are stored locally in the browser.

If you add a backend or external API later, create a `.env.local` file in the project root and never commit it:

```bash
# Example
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Project Structure

```
app/                # Main page, layout, and global styles
components/         # Task form, list, items, search, and shared UI
hooks/              # Custom React hooks
lib/                # Shared application utilities
```

## Author

Built by [HamzaShafiq44](https://github.com/HamzaShafiq44).

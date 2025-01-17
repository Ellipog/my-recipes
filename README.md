# My Recipes

A modern web application that helps you create, manage, and share recipes based on your available ingredients. Built with Next.js, MongoDB, and OpenAI.

## Features

- **AI-Powered Recipe Generation**

  - Generate recipes based on available ingredients
  - Specify number of servings, allergies, and cooking utilities
  - Option for immediate cooking or preparation in advance
  - Includes nutritional information for each recipe

- **Recipe Management**

  - Save generated recipes to your personal collection
  - View detailed recipe information including ingredients and steps
  - Interactive checklist for ingredients and cooking steps
  - Built-in cooking timers for each step

- **User Authentication**

  - Secure user registration and login
  - JWT-based authentication
  - Protected recipe access

- **Recipe Sharing**

  - Generate shareable links for your recipes
  - Share recipes with friends and family
  - View shared recipes without authentication

- **Modern UI/UX**
  - Responsive design for all devices
  - Beautiful gradient text and modern styling
  - Loading animations and notifications
  - Side menu for quick navigation

## Tech Stack

- **Frontend**

  - Next.js 15.1.4
  - React 19
  - TailwindCSS
  - Framer Motion

- **Backend**

  - Next.js API Routes
  - MongoDB with Mongoose
  - OpenAI API
  - JWT Authentication

- **Development**
  - TypeScript
  - ESLint
  - Turbopack
  - Bun

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/my-recipes.git
cd my-recipes
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:

```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `OPENAI_API_KEY`: OpenAI API key for recipe generation

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/contexts`: React context providers
- `/lib`: Utility functions and database connection
- `/models`: Mongoose models
- `/public`: Static assets
- `/data`: OpenAI function definitions

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

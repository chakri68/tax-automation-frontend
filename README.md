This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File structure
- components:
  - The "components" directory is where you store React components that are used throughout your application. These components are usually reusable pieces of UI that are used across multiple pages.

- contexts:
  - The "contexts" directory is used for managing application-wide state using React Context API. Contexts are used to share data between components without having to pass props down the component tree manually.

- pages:
  - The "pages" directory is a crucial part of Next.js. It contains individual files that correspond to different pages of the application. Each file in this directory represents a specific route and is automatically associated with a URL based on its filename. For example, if you have a file named "about.js" in the "pages" directory, it will be accessible at "/about".

- pages/api:
  - The "pages/api" directory is a special directory in Next.js that is used for creating serverless API routes. These API routes allow you to define server-side functions that can be accessed from the frontend using simple HTTP requests. Each file in this directory represents a separate API endpoint, and you can use various HTTP methods (GET, POST, PUT, DELETE, etc.) to handle different types of requests.

- public:
  - The "public" directory is where you store static assets such as images, fonts, and other files that you want to make publicly accessible. When you place a file in this directory, it becomes available at the root of your application URL. For example, if you place an image called "logo.png" in the "public" directory, you can access it in your code using "/logo.png".

- styles:
  - The "styles" directory is used for managing styles in your Next.js application. It includes global CSS files, CSS modules, or any other styling solutions you might prefer.
   

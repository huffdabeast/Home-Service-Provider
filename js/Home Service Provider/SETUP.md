# Project Setup Instructions

This document provides step-by-step instructions for setting up the necessary external services for this project.

## 1. GitHub Integration

This project is already in a directory that is a Git repository. Here’s how to ensure it’s connected to a remote repository on GitHub.

### Step 1: Create a New Repository on GitHub
1.  Go to [GitHub](https://github.com) and log in.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  Name your repository (e.g., `home-service-provider`).
4.  Provide an optional description.
5.  Choose between **Public** or **Private**.
6.  **IMPORTANT**: Do **not** initialize the repository with a `README`, `.gitignore`, or `license`. We have already created files.
7.  Click **Create repository**.

### Step 2: Connect Your Local Repository to GitHub
GitHub will now show you a page with commands. Since your repository already exists locally, you will use the "…or push an existing repository from the command line" option.

1.  **Verify your remote:** Check if a remote named `origin` already exists. The environment details show one does: `origin: https://github.com/huffdabeast/AI_Comparison.git`. You may want to update this to your new repository.
    ```bash
    # To remove the existing remote
    git remote remove origin
    ```

2.  **Add your new remote:**
    ```bash
    git remote add origin <your-new-repository-url.git>
    ```
    (Replace `<your-new-repository-url.git>` with the URL from the GitHub page).

3.  **Push your code to GitHub:**
    ```bash
    # Push the existing code from your local 'master' or 'main' branch
    git push -u origin master 
    # Or if your branch is named 'main'
    # git push -u origin main
    ```

Your local project is now connected to GitHub.

## 2. Supabase Setup

Supabase will serve as the backend, providing a database, authentication, and APIs.

### Step 1: Create a New Project on Supabase
1.  Go to [Supabase](https://supabase.com) and sign in or create an account.
2.  Click on **New project**.
3.  Choose an organization.
4.  Enter a **Project name** (e.g., `home-service-provider`).
5.  Generate a secure **Database Password**. Be sure to save this somewhere safe.
6.  Choose a **Region** that is closest to your users.
7.  Click **Create new project**.

### Step 2: Get Your API Keys
Once your project is created, you need to get the API keys to connect your frontend application.
1.  In the Supabase dashboard, go to the **Project Settings** (the gear icon in the left sidebar).
2.  Select the **API** tab.
3.  You will find your **Project URL** and your **Project API keys**. You need the `anon` `public` key.
4.  These are the values you will use for the environment variables mentioned in `memory-bank/techContext.md`.

### Step 3: Create Database Tables (Optional)
You can use the Supabase UI to create your database tables.
1.  Go to the **Table Editor** (the table icon in the left sidebar).
2.  Click **Create a new table**.
3.  Define your table name and columns. For example, you could create a `services` table with columns like `id`, `name`, `description`, and `price`.
4.  Enable **Row Level Security (RLS)** for your tables to ensure data is secure. You can define policies for who can access or modify data.

## 3. Vercel Deployment

Vercel is a platform for frontend frameworks and static sites, built to integrate with your headless content, commerce, or database.

### Step 1: Create a New Project on Vercel
1.  Go to [Vercel](https://vercel.com) and sign up with your GitHub account.
2.  After logging in, click the **Add New...** button and select **Project**.
3.  **Import Git Repository:** Vercel will show a list of your GitHub repositories. Find the repository you created for this project (e.g., `home-service-provider`) and click **Import**.
4.  **Configure Project:**
    - **Framework Preset:** Vercel should automatically detect that you are using Vite. If not, select **Vite**.
    - **Build and Output Settings:** The default settings for Vite are usually correct.
    - **Environment Variables:** This is a crucial step. You need to add the same Supabase environment variables that you use locally.
        - `VITE_SUPABASE_URL` = `your-supabase-url`
        - `VITE_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
5.  Click **Deploy**.

### Step 2: Automatic Deployments
Vercel will now build and deploy your site. Once the initial deployment is complete, Vercel will automatically redeploy your application every time you push a new commit to your main branch on GitHub.

You have now completed the full setup process.

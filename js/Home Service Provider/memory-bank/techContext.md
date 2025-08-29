# Tech Context

## Technologies Used
- **Frontend Framework:** To be determined (e.g., React, Vue, Svelte). For the purpose of this setup, we will assume **React** with **Vite**.
- **Backend-as-a-Service (BaaS):** Supabase
- **Database:** PostgreSQL (via Supabase)
- **Hosting/Deployment:** Vercel
- **Version Control:** Git / GitHub
- **Package Manager:** npm

## Development Setup
1.  **Prerequisites:** Node.js and npm installed.
2.  **Clone Repository:** `git clone <repository-url>`
3.  **Install Dependencies:** `npm install`
4.  **Environment Variables:** Create a `.env.local` file in the root of the frontend project directory and add the Supabase URL and anon key.
    ```
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
5.  **Run Development Server:** `npm run dev`

## Technical Constraints
- The application must be deployable on Vercel's free tier.
- The backend must utilize Supabase's free tier.
- All development should be possible on standard developer machines (Windows, macOS, Linux).

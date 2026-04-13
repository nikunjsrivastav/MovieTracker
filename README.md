# MovieTracker

MovieTracker is a sleek, modern web application designed for browsing movies, tracking your favorites, and discovering new titles using the TMDB API. Built with **React** and **Vite**, it offers a fast, fluid experience with a focus on premium aesthetics and smooth interactions.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended).
- **TMDB API Key**: You'll need an API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/nikunjsrivastav/MovieTracker.git
    cd MovieTracker
    ```

2.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```

### Configuration

The app requires a TMDB API key to fetch movie data. You can configure it in two ways:

1.  **Environment Variable**:
    Create a `.env` file in the `frontend` directory (copying from `.env.example`):
    ```bash
    cp .env.example .env
    ```
    Open `.env` and replace `YourTmdbKeyhere` with your actual API key:
    ```env
    VITE_TMDB_API_KEY=your_actual_api_key_here
    ```

2.  **In-App Settings**:
    Alternatively, you can add your API key directly within the app's settings page, which will save it to your local storage.

### Running the App

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Styling**: Vanilla CSS (Custom Design System)
- **API**: TMDB API
- **Routing**: React Router

## 📂 Project Structure

- `frontend/`: Contains the React application.
- `backend/`: Placeholder for future backend implementation.
- `docs/`: Project documentation and assets.

---
"If you all want you can fork and start adding the features"

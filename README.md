# Campus Placement Assistant

An AI-powered web application connecting college students to an official **Microsoft Azure Foundry Agent** (`Campus-Placement-Assistant`, version `23`) powered by `gpt-4.1-mini` with built-in File Search knowledge.

---

## 1. Architecture

```text
React / Vite Frontend (Port 5173)
       ↓ (POST /api/chat)
Express Backend (Port 5001)
       ↓ (DefaultAzureCredential)
Microsoft Foundry Project (PlacementAssistant)
       ↓
Campus-Placement-Assistant (v23)
       ↓
GPT-4.1-mini + Built-in File Search
       ↓
AI Placement Response
```

> **Security Note:** Azure credentials and `DefaultAzureCredential` are used exclusively on the Node.js/Express backend. The frontend communicates with the backend via `/api/chat` and never exposes Azure tokens, secrets, or endpoint credentials.

---

## 2. Prerequisites

1. **Node.js**: v18 or higher (v20+ recommended).
2. **Azure CLI**: Logged in with access to the Azure Foundry resource:
   ```bash
   az login
   ```
   Verify your active subscription:
   ```bash
   az account show
   ```

---

## 3. Configuration

### Backend Environment Variables (`backend/.env`)

The backend configuration is located in `backend/.env`:

```env
FOUNDRY_PROJECT_ENDPOINT=https://placementassistant.services.ai.azure.com/api/projects/PlacementAssistant
FOUNDRY_AGENT_NAME=Campus-Placement-Assistant
FOUNDRY_AGENT_VERSION=23
PORT=5001
```

---

## 4. How to Run Locally

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm install
npm start
```

The backend server will start on `http://localhost:5001`.

### Step 2: Start the Frontend Application

Open a second terminal window and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`. Open your browser and navigate to `http://localhost:5173`.

---

## 5. API Reference

### `POST /api/chat`

Sends a message to the Microsoft Foundry Agent and returns the response.

**Request:**
```json
{
  "message": "What companies visit Chitkara University for CSE placements?"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "response": "Here are the companies that recruit from Chitkara University..."
}
```

**Response (Error - 500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Azure Authentication Error: Please ensure you are logged in via Azure CLI (`az login`).",
  "details": "ChainedTokenCredential authentication failed."
}
```

### `GET /api/health`

Returns backend status and connected agent configuration.

---

## 6. Features & Highlights

- **Direct Foundry Connection:** Interacts with the real Azure Foundry Agent `Campus-Placement-Assistant` version 23 without mock data.
- **Accurate Placement Knowledge:** Uses the agent's built-in File Search containing verified placement criteria, eligibility rules, and CTC data.
- **Production-Ready Architecture:** Clean decoupled Express backend keeping all cloud credentials server-side.
- **Modern UI:** Responsive dark theme with real-time typing indicators, quick prompts, Markdown rendering, and error retry support.

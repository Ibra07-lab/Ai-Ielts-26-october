# Getting Started (PowerShell Version)

This project consists of an Encore application. Follow the steps below to get the app running locally using PowerShell.

## Prerequisites

If this is your first time using Encore, you need to install the CLI that runs the local development environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

You also need to have bun installed for package management. If you don't have bun installed, you can install it by running:

```powershell
npm install -g bun
```

## Running the Application

### Option 1: Using the Startup Script (Recommended)

Run the provided PowerShell script:

```powershell
.\start-app.ps1
```

This will automatically start both backend and frontend services in separate terminal windows.

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Start the Encore development server:
   ```powershell
   encore run
   ```

The backend will be available at the URL shown in your terminal (typically `http://localhost:4000`).

#### Frontend Setup

1. Open a new PowerShell window and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install the dependencies (if not already installed):
   ```powershell
   bun install
   ```

3. Start the development server:
   ```powershell
   bun run dev
   ```

The frontend will be available at `http://localhost:5173` (or the next available port).

### Generate Frontend Client
To generate the frontend client, run the following command in the `backend` directory:

```powershell
encore gen client --target leap
```

## PowerShell Notes

- **Don't use `&&`** - PowerShell doesn't support this bash syntax
- **Use separate commands** - Run each command on its own line
- **Use `;` for simple chaining** - `command1; command2` (runs regardless of success)
- **Use `if ($?)` for conditional chaining** - `command1; if ($?) { command2 }`

## Troubleshooting

If you encounter issues:

1. **Check if Encore is installed:**
   ```powershell
   encore version
   ```

2. **Check if Bun is installed:**
   ```powershell
   bun --version
   ```

3. **Verify dependencies are installed:**
   ```powershell
   cd frontend
   bun install
   ```

4. **Check if ports are in use:**
   ```powershell
   netstat -ano | findstr ":4000"
   netstat -ano | findstr ":5173"
   ```

## URLs

- **Backend API:** http://localhost:4000
- **Frontend App:** http://localhost:5173
- **Encore Dashboard:** http://localhost:4000/encore

## Deployment

### Self-hosting
See the [self-hosting instructions](https://encore.dev/docs/self-host/docker-build) for how to use encore build docker to create a Docker image and configure it.

### Encore Cloud Platform

#### Step 1: Login to your Encore Cloud Account

Before deploying, ensure you have authenticated the Encore CLI with your Encore account (same as your Leap account)

```powershell
encore auth login
```

#### Step 2: Set Up Git Remote

Add Encore's git remote to enable direct deployment:

```powershell
git remote add encore encore://ai-ielts-app-ybri
```

#### Step 3: Deploy Your Application

Deploy by pushing your code:

```powershell
git add -A .
git commit -m "Deploy to Encore Cloud"
git push encore
```

Monitor your deployment progress in the [Encore Cloud dashboard](https://app.encore.dev/ai-ielts-app-ybri/deploys).

## Additional Resources

- [Encore Documentation](https://encore.dev/docs)
- [Deployment Guide](https://encore.dev/docs/platform/deploy/deploying)
- [GitHub Integration](https://encore.dev/docs/platform/integrations/github)
- [Encore Cloud Dashboard](https://app.encore.dev)

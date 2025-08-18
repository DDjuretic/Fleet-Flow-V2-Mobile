# Fleet Flow V2 Mobile - Complete Setup & Collaboration Guide

This guide provides a comprehensive walkthrough for setting up the Fleet Flow V2 Mobile development environment on a new computer, creating a new project based on our "fresh start" strategy, and collaborating effectively with the team.

---

## 1. Initial Machine Setup

This section covers the one-time installation of all necessary tools and software.

### macOS Setup
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install necessary tools
brew install node@18 git gh supabase/tap/supabase
brew install --cask cursor docker
# Install Expo Application Services CLI (EAS CLI) for builds and deployments
npm install -g eas-cli
```

### Windows Setup (using winget)
```bash
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install GitHub.cli
winget install Cursor.Cursor
winget install Docker.DockerDesktop
npm install -g supabase # Install Supabase CLI via npm
npm install -g eas-cli  # Install Expo Application Services CLI (EAS CLI)
```

### Linux (Ubuntu/Debian) Setup
```bash
sudo apt update
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
# Install other tools
sudo apt install git gh docker.io docker-compose
# Install Supabase CLI
npm install -g supabase
npm install -g eas-cli  # Install Expo Application Services CLI (EAS CLI)
```

---

## 2. Git & GitHub Configuration

### Configure Git User
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Setup SSH for GitHub (Recommended)
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Follow prompts, then add the key to your ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
# Copy the public key content and add it to GitHub > Settings > SSH Keys
cat ~/.ssh/id_ed25519.pub
```

### Authenticate with GitHub CLI
```bash
gh auth login
# Follow the interactive prompts in your terminal.
```

---

## 3. Project Setup (Initial "Fresh Start" for Mobile App)

This section outlines the process for setting up the new, clean Fleet Flow V2 Mobile project.

### Create New Project
```bash
# Navigate to your desired development directory (outside any existing project folders)
cd /path/to/your/development/folder

# Create the new Expo project
npx create-expo-app Fleet-Flow-V2-Mobile --template blank-ts

# Navigate into the new project directory
cd Fleet-Flow-V2-Mobile
```

### Clone Existing Code (Optional, if using an existing repository for the new project)
*If you are reusing the existing Fleet-Flow-V2-Mobile repository but starting fresh, clone it first. Otherwise, skip this and proceed with code migration.*
```bash
# Using SSH (Recommended)
git clone git@github.com:DDjuretic/Fleet-Flow-V2-Mobile.git
cd Fleet-Flow-V2-Mobile
```

### Configure Environment Variables
The project uses `.env` files for environment-specific variables. For local development, create a `.env` file in the root directory.
```bash
# Example .env file for local Supabase
# IMPORTANT: DO NOT COMMIT THIS FILE TO GIT!
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Expo-specific public variables
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### Initialize Supabase & Apply Migrations
```bash
# Initialize Supabase local project setup
npx supabase init

# Copy existing migrations (if any) from the old project to supabase/migrations/

# Start local Supabase services (Docker must be running)
npx supabase start # This will also apply all existing database migrations automatically
```

### Install Dependencies
```bash
# Install all dependencies using Expo CLI for compatibility
npx expo install --fix
```

---

## 4. Daily Development Workflow

### Starting Your Day
```bash
# 1. Ensure you are on the main branch and pull the latest changes
git checkout main
git pull origin main

# 2. Install any new dependencies that might have been added
npx expo install --fix # Use Expo CLI to ensure compatibility

# 3. Apply any new database migrations and start local Supabase
npx supabase start 

# 4. Start the development server for the mobile app
npm start # or npx expo start
```

### Working on a Feature
```bash
# 1. Create a new feature branch from main
git checkout -b feature/your-feature-name

# 2. Work on your feature...
# (Make your code changes)

# 3. Commit your changes
git add .
git commit -m "feat(scope): Describe your new feature or fix"

# 4. Push your branch to GitHub and create a Pull Request
git push -u origin feature/your-feature-name
gh pr create --title "feat: Your Feature Title" --body "Detailed description of changes."
```

### Branching Strategy
- `main`: Production-ready, stable code. All feature branches are merged into `main`.
- `feature/<feature-name>`: Branches for developing new features or fixes.

---

## 5. Database Migration Workflow

Managing database changes is critical for team collaboration.

### Creating a New Migration
When you need to change the database schema (e.g., add a table or a column):
```bash
# 1. Make your schema changes locally using Supabase Studio
npx supabase studio

# 2. Once you are happy with the changes, create a new migration file
npx supabase db diff -f your_migration_name

# 3. This creates a new file in `supabase/migrations`.
#    Review the file to ensure it's correct.
```

### Applying Migrations
When you pull new code from `main` that includes a new migration file, simply run `npx supabase start`. The CLI will automatically detect and apply the new migration. 
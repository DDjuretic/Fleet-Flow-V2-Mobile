# Fleet Flow Next Gen - Complete Setup & Collaboration Guide

This guide provides a comprehensive walkthrough for setting up the Fleet Flow Next Gen development environment on a new computer, cloning the repository, and collaborating effectively with the team.

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
```

### Windows Setup (using winget)
```bash
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install GitHub.cli
winget install Cursor.Cursor
winget install Docker.DockerDesktop
npm install -g supabase # Install Supabase CLI via npm
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

## 3. Project Setup

### Clone the Repository
```bash
# Using SSH (Recommended)
git clone git@github.com:DDjuretic/Fleet-Flow-Next-Gen.git
cd Fleet-Flow-Next-Gen
```

### Configure Environment Variables
The project uses a central `.env` file in the root directory.
```bash
# Copy the example file
cp .env.example .env

# Open the file and fill in your Supabase credentials
nano .env
```
Your `.env` file should contain:
```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
```

### Install Dependencies & Start Services
```bash
# 1. Install all dependencies from the root
npm install --legacy-peer-deps

# 2. Start the local Supabase instance (Docker is required)
npx supabase start
```
This command will also apply all existing database migrations automatically.

---

## 4. Daily Development Workflow

### Starting Your Day
```bash
# 1. Ensure you are on the main branch and pull the latest changes
git checkout main
git pull origin main

# 2. Install any new dependencies that might have been added
npm install --legacy-peer-deps

# 3. Apply any new database migrations
npx supabase start # This will check and apply any new migrations

# 4. Start the development server for the mobile app
npm run ios # or npm run android
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
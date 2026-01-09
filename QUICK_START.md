# Quick Start: Push to GitHub and Deploy

## ⚡ Quick Steps

### 1. Install Git (if needed)
Download from: https://git-scm.com/download/win

### 2. Open Git Bash or PowerShell in your project folder

### 3. Run these commands:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment - Backend and Frontend configured"

# Create repository on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 4. Deploy on Render

**Backend:**
- New → Web Service
- Connect GitHub repo
- Build: `cd Backend && npm install`
- Start: `cd Backend && npm start`
- Add all env variables (see ENVIRONMENT_VARIABLES.md)

**Frontend:**
- New → Static Site  
- Connect GitHub repo
- Build: `cd Frontend && npm install && npm run build`
- Publish: `Frontend/dist`
- Add: `VITE_API_URL` = your backend URL

### 5. Update Backend FRONTEND_URL after frontend deploys

---

**Full detailed guide:** See `GITHUB_PUSH_GUIDE.md`

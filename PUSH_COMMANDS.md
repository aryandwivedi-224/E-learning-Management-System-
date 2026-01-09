# Push Updated Code to GitHub

Your repository: `https://github.com/aryandwivedi-224/E-learning-Management-System-.git`

## Quick Commands to Run

Open **Git Bash** or **PowerShell** in your project folder and run these commands:

```bash
# 1. Check status
git status

# 2. Add all new and modified files
git add .

# 3. Commit the changes
git commit -m "Add Render deployment configuration - Backend server, CORS setup, environment variables, and deployment guides"

# 4. Push to GitHub
git push origin master
```

**Note**: If your branch is `main` instead of `master`, use:
```bash
git push origin main
```

## If Git is Not Found

### Option 1: Use Git Bash (Recommended)
1. Right-click in your project folder
2. Select "Git Bash Here"
3. Run the commands above

### Option 2: Find Git Installation
Git might be installed but not in PATH. Common locations:
- `C:\Program Files\Git\bin\git.exe`
- `C:\Program Files (x86)\Git\bin\git.exe`

Add it to PATH or use full path:
```powershell
& "C:\Program Files\Git\bin\git.exe" status
```

### Option 3: Reinstall Git
1. Download: https://git-scm.com/download/win
2. Install with default settings
3. Restart terminal
4. Run commands above

### Option 4: Use GitHub Desktop
1. Open GitHub Desktop
2. File → Add Local Repository
3. Select this folder
4. It should detect your existing repository
5. Commit and push from the UI

## What Will Be Pushed

The following new/updated files will be pushed:
- ✅ `Backend/index.js` - Main server file
- ✅ `Backend/package.json` - Updated dependencies
- ✅ `Backend/render.yaml` - Deployment config
- ✅ `Frontend/src/axios.js` - Updated with env variable
- ✅ `Frontend/render.yaml` - Deployment config
- ✅ `Frontend/package.json` - Updated preview script
- ✅ `.gitignore` - Updated ignore rules
- ✅ `DEPLOYMENT_GUIDE.md` - Deployment instructions
- ✅ `ENVIRONMENT_VARIABLES.md` - Env vars reference
- ✅ `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- ✅ `GITHUB_PUSH_GUIDE.md` - GitHub guide
- ✅ All other updated files

## Troubleshooting

### "fatal: not a git repository"
Run: `git init` first, then add remote:
```bash
git remote add origin https://github.com/aryandwivedi-224/E-learning-Management-System-.git
```

### "Authentication failed"
Use Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Use token as password when pushing

### "Permission denied"
- Check you have write access to the repository
- Verify repository URL is correct

### "Everything up-to-date"
Your local changes are already pushed, or you need to add files first:
```bash
git add .
git commit -m "Your message"
git push
```

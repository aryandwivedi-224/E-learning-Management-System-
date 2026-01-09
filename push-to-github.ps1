# PowerShell Script to Push Code to GitHub
# Run this script after providing your GitHub details

Write-Host "=== GitHub Push Script ===" -ForegroundColor Green
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then restart your terminal and run this script again." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Please provide the following information:" -ForegroundColor Cyan
Write-Host ""

# Get GitHub username
$username = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "Username is required!" -ForegroundColor Red
    exit
}

# Get repository name
$repoName = Read-Host "Enter repository name (e.g., e-learning-management-system)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "Repository name is required!" -ForegroundColor Red
    exit
}

# Check if repository already exists
$repoExists = Read-Host "Does the repository already exist on GitHub? (y/n)"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "=== Starting Git Operations ===" -ForegroundColor Green
Write-Host ""

# Initialize git if not already done
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git already initialized" -ForegroundColor Green
}

# Add all files
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files added" -ForegroundColor Green

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    # Commit
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Ready for Render deployment - Backend and Frontend configured with CORS and environment variables"
    Write-Host "✓ Changes committed" -ForegroundColor Green
}

# Set branch to main
Write-Host "Setting branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch set to main" -ForegroundColor Green

# Add remote
Write-Host "Adding remote repository..." -ForegroundColor Yellow
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Remote already exists: $existingRemote" -ForegroundColor Yellow
    $updateRemote = Read-Host "Update remote? (y/n)"
    if ($updateRemote -eq "y") {
        git remote set-url origin $repoUrl
        Write-Host "✓ Remote updated" -ForegroundColor Green
    }
} else {
    git remote add origin $repoUrl
    Write-Host "✓ Remote added" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Ready to Push ===" -ForegroundColor Green
Write-Host ""
Write-Host "Repository URL: $repoUrl" -ForegroundColor Cyan
Write-Host ""

if ($repoExists -ne "y") {
    Write-Host "IMPORTANT: Create the repository on GitHub first!" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: $repoName" -ForegroundColor White
    Write-Host "3. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
    Write-Host "4. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Press Enter after creating the repository on GitHub"
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for GitHub credentials." -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "✓ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to Render.com and deploy your backend" -ForegroundColor White
    Write-Host "2. Deploy your frontend" -ForegroundColor White
    Write-Host "3. See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor White
} catch {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Authentication failed: Use Personal Access Token" -ForegroundColor White
    Write-Host "- Repository doesn't exist: Create it on GitHub first" -ForegroundColor White
    Write-Host "- Permission denied: Check repository access" -ForegroundColor White
    Write-Host ""
    Write-Host "Try running: git push -u origin main" -ForegroundColor Yellow
}

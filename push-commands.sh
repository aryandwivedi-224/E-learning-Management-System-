#!/bin/bash

echo "=========================================="
echo "Pushing code to GitHub"
echo "Repository: aryandwivedi-224/E-learning-Management-System-"
echo "=========================================="
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not found!"
    exit 1
fi

echo "✓ Git found"
echo ""

# Check if .git exists, if not initialize
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    echo "✓ Git initialized"
    echo ""
fi

# Add remote if not exists
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ -z "$REMOTE_URL" ]; then
    echo "Adding remote repository..."
    git remote add origin https://github.com/aryandwivedi-224/E-learning-Management-System-.git
    echo "✓ Remote added"
    echo ""
else
    echo "✓ Remote already configured: $REMOTE_URL"
    echo ""
fi

# Add all files
echo "Adding all files..."
git add .
echo "✓ Files added"
echo ""

# Commit
echo "Committing changes..."
git commit -m "Add Render deployment configuration - Backend server, CORS setup, environment variables, and deployment guides"
echo "✓ Changes committed"
echo ""

# Check current branch or set to main
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
    git checkout -b main 2>/dev/null || git branch -M main 2>/dev/null
fi
echo "Current branch: $CURRENT_BRANCH"
echo ""

# Push
echo "Pushing to GitHub (main branch)..."
echo "You may be prompted for GitHub credentials."
echo "Username: aryandwivedi-224"
echo "Password: Use Personal Access Token (not your GitHub password)"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ SUCCESS! Code pushed to GitHub!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Go to Render.com to deploy backend"
    echo "2. Deploy frontend"
    echo "3. See DEPLOYMENT_GUIDE.md for instructions"
else
    echo ""
    echo "=========================================="
    echo "ERROR: Push failed!"
    echo "=========================================="
    echo ""
    echo "Possible issues:"
    echo "1. Authentication failed - Use Personal Access Token"
    echo "2. Branch name mismatch - Try: git push origin master"
    echo "3. Repository doesn't exist or no access"
    echo ""
    echo "Get Personal Access Token:"
    echo "https://github.com/settings/tokens"
fi

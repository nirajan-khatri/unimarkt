# GitHub Branching and Merging Guidelines

## Introduction

This document outlines our team's best practices for branch creation and code merging in GitHub. Following these guidelines will help maintain code quality, prevent conflicts, and ensure a smooth collaborative workflow.

## Basic Git Operations

### Pulling Changes

Pull the latest changes from the remote repository:

```bash
# Update your current branch with remote changes
git pull origin your-branch-name

# Specifically for main branch
git checkout main
git pull origin main
```

### Pushing Changes

Push your local commits to the remote repository:

```bash
# Push changes to your branch
git push origin your-branch-name

# If it's a new branch
git push -u origin your-branch-name
```

### Common Pull/Push Workflow

```bash
# 1. Before starting work, get latest changes
git checkout main
git pull origin main

# 2. Create your branch
git checkout -b feature/your-feature

# 3. Make changes and commit
git add .
git commit -m "Descriptive commit message"

# 4. Push your branch to remote
git push -u origin feature/your-feature

# 5. Periodically update your branch with main
git checkout main
git pull origin main
git checkout feature/your-feature
git merge main
```

## Branching Strategy

### Branch Types

- **main** (or **master**): The production-ready code
- **develop**: Integration branch for ongoing development
- **feature/**: For new features (e.g., `feature/user-authentication`)
- **bugfix/**: For bug fixes (e.g., `bugfix/login-validation`)
- **hotfix/**: For urgent production fixes (e.g., `hotfix/security-patch`)
- **release/**: For preparing releases (e.g., `release/v1.2.0`)

### Branch Naming Conventions

- Use lowercase letters and hyphens
- Include a prefix indicating branch type
- Add a brief description of the work
- Include ticket/issue number when applicable

Examples:

```
feature/add-login-page-#123
bugfix/fix-broken-links-#456
hotfix/security-vulnerability-#789
```

## Working with Branches

### Creating a New Branch

```bash
# First, update your local main/develop branch
git checkout main
git pull origin main

# Create and switch to a new branch
git checkout -b feature/your-feature-name
```

### Keeping Your Branch Updated

```bash
# While on your branch
git fetch origin
git merge origin/main  # or origin/develop

# Alternative approach
git pull --rebase origin main
```

## Code Review and Merging Process

### Before Creating a Pull Request

1. Write meaningful commit messages
2. Ensure code passes all tests
3. Review your own changes
4. Rebase your branch if necessary

### Pull Request Guidelines

1. Create a descriptive title and detailed description
2. Reference related issues/tickets with keywords (Fixes #123, Relates to #456)
3. Add appropriate reviewers
4. Include testing instructions if necessary

### Code Review Expectations

- Respond to review comments promptly
- Be open to feedback
- Explain complex sections of your code
- Use the PR conversation for technical discussions

### Merging Options

1. **Merge commit**: Preserves all commits history

   ```bash
   git checkout main
   git merge --no-ff feature/your-feature
   ```

2. **Squash and merge**: Combines all branch commits into one

   ```bash
   # In GitHub UI, select "Squash and merge"
   # Or via command line:
   git checkout main
   git merge --squash feature/your-feature
   git commit -m "Feature: Add comprehensive commit message"
   ```

3. **Rebase and merge**: Applies changes and maintains linear history
   ```bash
   git checkout feature/your-feature
   git rebase main
   git checkout main
   git merge feature/your-feature
   ```

## Resolving Merge Conflicts

### Prevention

- Pull from the main branch frequently
- Communicate with team members about changes
- Break work into smaller PRs to reduce conflict surface area

### Resolution Steps

1. Identify conflicting files: `git status`
2. Open conflicted files and look for conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Edit files to resolve conflicts
4. Add resolved files: `git add <filename>`
5. Complete the merge: `git commit` or continue rebase: `git rebase --continue`

## Branch Clean-up

- Delete merged branches locally: `git branch -d feature/your-feature`
- Delete merged branches remotely: `git push origin --delete feature/your-feature`
- Periodically clean up stale branches

## Workflow Summary

1. Create a feature branch from main/develop
2. Make changes with clear commit messages
3. Keep your branch updated with main/develop
4. Create a Pull Request
5. Address review feedback
6. Merge code after approval
7. Delete the branch after merging

## Tools and Resources

### Recommended GitHub Features

- Branch protection rules
- Required status checks
- Required reviews
- Automated tests with GitHub Actions

### Useful Git Commands

```bash
# View branch history
git log --graph --oneline --all

# Compare branches
git diff branch1..branch2

# Temporarily stash changes
git stash
git stash pop

# Undo local commits (keep changes)
git reset --soft HEAD~1
```

### Learning Resources

- [GitHub Documentation](https://docs.github.com/en)
- [Git Branching Tutorial](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

# 📋 Git Workflow Guide — Cloud Team Ignite

**Dokumentasi:** Git Workflow dan Best Practices untuk ATHSNAC Project  
**Tim:** Cloud Team Ignite  

---

## 📖 Daftar Isi

1. [Branch Naming Conventions](#branch-naming-conventions)
2. [Commit Message Convention](#commit-message-convention)
3. [Pull Request Process](#pull-request-process)
4. [Code Review Guidelines](#code-review-guidelines)
5. [CODEOWNERS](#codeowners)
6. [Quick Reference](#quick-reference)

---

## 🌳 Branch Naming Conventions

Semua branch harus mengikuti konvensi naming berikut untuk konsistensi dan clarity. Ini penting agar setiap anggota bisa langsung tahu tujuan branch hanya dari namanya. Dengan nama branch yang seragam, kita bisa:
- mengenali jenis pekerjaan (fitur, bugfix, docs, dll),
- menghindari nama branch duplikat,
- dan memudahkan review serta pencarian riwayat kerja.

### Format Branch Name

```
<type>/<description>
```

### Type Branches

| Type | Penggunaan | Contoh |
|------|-----------|--------|
| `feature/` | Fitur baru | `feature/dark-mode`, `feature/item-categories` |
| `bugfix/` | Bug fixes | `bugfix/auth-token-expiry` |
| `hotfix/` | Critical production fixes | `hotfix/database-connection-pool` |
| `refactor/` | Code refactoring | `refactor/api-validation-layer` |
| `docs/` | Documentation updates | `docs/git-workflow-guide`, `docs/api-docs` |
| `test/` | Testing improvements | `test/add-integration-tests` |
| `chore/` | Dependencies, config updates | `chore/update-dependencies` |

### Branch Naming Rules

✅ **DO:**
- Gunakan kebab-case (lowercase dengan hyphen)
- Deskriptif dan jelas (2-4 kata)
- Terkait dengan task/issue yang dikerjakan
- Contoh: `feature/item-categories`, `bugfix/login-validation`

❌ **DON'T:**
- Gunakan underscore: `feature_dark_mode` ❌
- Gunakan spasi: `feature/dark mode` ❌
- Terlalu singkat: `feature/dm` ❌
- Terlalu panjang: `feature/add-dark-mode-toggle-with-localStorage-persistence` ❌

### Branch Lifecycle

```
main (production-ready)
 ↑
develop (integration branch)
 ↑
feature/* → Pull Request → Code Review → Merge → Delete
```

---

## 📝 Commit Message Convention

Kami menggunakan **Conventional Commits** untuk standardisasi commit messages. Aturan ini membuat riwayat perubahan lebih rapi dan mudah dibaca, khususnya saat mencari bug atau membuat changelog. Commit message yang konsisten membantu semua anggota tim memahami perubahan tanpa membuka detail kode.

### Format Commit Message

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type Commits

| Type | Deskripsi | Contoh |
|------|-----------|--------|
| `feat:` | Fitur baru | `feat: add dark mode toggle` |
| `fix:` | Bug fix | `fix: resolve auth token expiry issue` |
| `docs:` | Dokumentasi | `docs: update API documentation` |
| `style:` | Format, semicolons, dll | `style: format code with prettier` |
| `refactor:` | Refactoring code | `refactor: simplify validation logic` |
| `perf:` | Performance improvements | `perf: optimize database queries` |
| `test:` | Testing related | `test: add unit tests for auth service` |
| `chore:` | Dependencies, setup | `chore: update npm dependencies` |

### Commit Message Rules

#### ✅ GOOD Examples

```
feat: add health check endpoint with database status
- Detects PostgreSQL connection health
- Returns status in /health endpoint
- Useful for monitoring infrastructure

fix: resolve JWT token validation bug in protected routes
- Token expiry not properly checked
- Added refresh token logic

docs: add comprehensive setup guide
- Include Docker commands
- Troubleshooting section
```

#### ❌ BAD Examples

```
fix: stuff ❌
feat: update ❌
changes ❌
WIP ❌
fixed bugs ❌
```

### Commit Message Best Practices

```
Subject Line:
- Max 50 characters
- Imperative mood: "add", "fix", "refactor" (not "added", "fixes")
- Lowercase
- No period at the end

Body:
- Explain WHAT and WHY, not HOW
- Wrap at 72 characters
- Leave blank line after subject
- Bullet points OK

Footer:
- Reference issues: Closes #123
- Breaking changes: BREAKING CHANGE: description
```

### Examples with Body

```
feat: add item category filtering

Add category parameter to item search endpoint. This allows
customers to filter products by category (electronics, books, etc).

- New query parameter: ?category=electronics
- Updated Item model with category field
- Added category validation in schema

Closes #42
```

---

## 🔄 Pull Request Process

Pull Request (PR) adalah cara kita menggabungkan perubahan dari branch kerja ke `main`. Setiap PR harus jelas, mudah dibaca, dan sudah diuji sebelum direview. Dengan PR, reviewer bisa melihat perubahan kode satu per satu, memberi komentar, dan menyetujui sebelum merge.

### Step 1: Buat Branch Baru

```bash
# Update main branch
git checkout main
git pull origin main

# Buat feature branch
git checkout -b feature/your-feature-name
```

### Step 2: Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
# Follow Conventional Commits format
```

### Step 3: Push ke Remote

```bash
git push origin feature/your-feature-name
```

### Step 4: Buat Pull Request

**Di GitHub:**

1. ✅ Klik **"Compare & pull request"** (atau buat manual via Pull Requests tab)
2. ✅ **Title:** Sama dengan commit message subject
   ```
   feat: add dark mode toggle
   ```
3. ✅ **Description:** Gunakan template PR berikut:

   ```markdown
   ## 📝 Description
   Add dark mode toggle feature untuk meningkatkan user experience.

   ## 🎯 Changes
   - Implementasi dark mode state di Header component
   - Simpan preferensi ke localStorage
   - Styling untuk light/dark theme

   ## ✅ Testing
   - [x] Manual testing di Chrome
   - [x] localStorage persistence verified
   - [x] Toggle works without page reload

   ## 🔗 Closes
   Closes #123
   ```

4. ✅ **Assignees:** Pilih diri sendiri
5. ✅ **Reviewers:** Pilih 1 anggota lain (lihat tabel di bawah)
6. ✅ **Labels:** Pilih sesuai type (enhancement, documentation, etc)

### PR Approval Checklist

PR harus memenuhi kriteria sebelum di-merge:

- [ ] Title mengikuti Conventional Commits
- [ ] Description lengkap dan jelas
- [ ] Minimal 1 reviewer (bukan pembuat PR)
- [ ] Minimal 1 review comment dari reviewer
- [ ] All checks passing (linting, tests, builds)
- [ ] No merge conflicts
- [ ] Code reviewed dan approved

### Merge Strategy

```
Merge Condition: Squash and Merge ✅
Reason: Keep main branch history clean
Delete branch after merge: YES ✅
```

### Step 5: Merge PR

Setelah approval:

1. Klik **"Squash and merge"**
2. Confirm merge message (biasanya auto-generated dengan baik)
3. Klik **"Confirm squash and merge"**
4. Klik **"Delete branch"** untuk cleanup

### Step 6: Update Local Repository

```bash
git checkout main
git pull origin main
# Branch lama sudah ter-delete otomatis di remote
```

---

## 👥 Code Review Guidelines

Review kode adalah proses penting agar kesalahan kecil tidak masuk ke branch utama. Reviewer memastikan kode:
- aman,
- mudah dibaca,
- sesuai standar tim,
- dan tidak merusak fitur lain.

### Sebagai Reviewer

#### ✅ Hal yang Harus Dicek

**Kualitas Code:**
- [ ] Code mengikuti project style guide
- [ ] Logic mudah dipahami
- [ ] Tidak ada hardcoded values
- [ ] Error handling memadai
- [ ] No console.log atau debug code

**Functionality:**
- [ ] Feature berfungsi sesuai deskripsi
- [ ] Edge cases ditangani
- [ ] Tidak merusak fitur existing
- [ ] Performance acceptable

**Testing:**
- [ ] Ada test untuk kasus normal
- [ ] Ada test untuk error cases (jika applicable)
- [ ] Test coverage reasonable

**Documentation:**
- [ ] Code comments jelas
- [ ] API changes documented
- [ ] README updated jika perlu

#### Review Comment Types

```
✅ APPROVAL (Looks good!)
- "Looks great! The implementation is clean and well-tested."
- "Perfect, this follows our conventions perfectly."

💬 COMMENT (Observation, tidak blocking)
- "FYI: Kami biasanya handle errors ini dengan [approach X]"
- "Nice touch! Just wanted to note that..."

🤔 QUESTION (Clarity check)
- "Can you explain why we need this parameter?"
- "How does this handle concurrent requests?"

🛑 REQUEST CHANGES (Harus di-fix sebelum merge)
- "Please add error handling for this case"
- "This violates our naming convention, please update"
```

### Sebagai PR Author

#### Merespons Reviews

✅ **DO:**
- Hargai feedback reviewer
- Respons semua comments
- Update PR berdasarkan review
- Push changes baru (jangan squash sampai approved)
- Thank reviewers untuk waktu mereka

❌ **DON'T:**
- Defensive terhadap criticism
- Ignore comments
- Merge tanpa resolve semua comments
- Create many small commits (squash before merge)

#### Contoh Response

```
✅ "Good point! I've added validation for that case in commit [hash]"
✅ "I changed the approach to use [X] as you suggested"
✅ "I tested that scenario and it handles correctly. See [details]"
❌ "That's not an issue" (without explanation)
❌ "I'll leave it as is" (without reasoning)
```

---

## 🔐 CODEOWNERS

File `.github/CODEOWNERS` menentukan siapa yang harus review PR untuk file tertentu. Ini membantu GitHub menampilkan reviewer yang tepat secara otomatis ketika PR dibuat. Dengan file ini, kita memastikan orang yang tepat melihat perubahan pada area penting.

### Format CODEOWNERS

```
# Global owners
* @lead-backend @lead-frontend

# Backend files
/backend/** @lead-backend
/backend/auth.py @lead-backend @lead-security
/backend/requirements.txt @lead-devops

# Frontend files
/frontend/** @lead-frontend
/frontend/src/components/** @lead-frontend

# Infrastructure files
docker-compose.yml @lead-devops
Dockerfile* @lead-devops

# Documentation
docs/git-workflow.md @lead-qa-docs
README.md @lead-qa-docs
```

### Responsibility Matrix

| Anggota | Primary | Secondary | Scope |
|---------|---------|-----------|-------|
| Lead Backend | Backend code, API design | Database, auth logic | `/backend/**` |
| Lead Frontend | Frontend code, UI/UX | Component logic | `/frontend/src/**` |
| Lead DevOps | Docker, infra, deployment | Configuration files | `docker-compose.yml`, `Dockerfile` |
| Lead QA & Docs | Documentation, testing guides | Process documentation | `/docs/**`, `README.md` |
| Lead CI/CD | Pipeline, automation | Testing, monitoring | `.github/workflows/**` |

---

## 📋 Review Assignment Rules

Setiap PR harus di-assign ke reviewer yang berbeda dari pembuat PR.

### Pairing untuk Task 9

| PR dari | Reviewer | Reason |
|---------|----------|--------|
| Lead Backend | Lead Frontend | Cross-team review, fresh perspective |
| Lead Frontend | Lead Backend | Different tech stack insight |
| Lead DevOps | Lead QA & Docs | Infrastructure meets quality standards |
| Lead QA & Docs | Lead DevOps | Documentation clarity + deployment info |
| Lead CI/CD (5 orang) | Lead Backend atau Lead Frontend | Feature integration check |

### Review Timing

```
Expected Review Time:
- Code available: Immediately after push
- First review: Within 24 hours
- Address feedback: Within 48 hours
- Final merge: Within 72 hours (or per sprint planning)
```

---

## 🚀 Workflow Summary

### Complete Workflow in 5 Steps

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/your-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add your feature"

# 3. Push to remote
git push origin feature/your-feature

# 4. Create PR on GitHub
# - Use GitHub UI
# - Add title, description, reviewers

# 5. After approval and merge
git checkout main
git pull origin main
```

---

## 📚 Quick Reference

### Common Commands

```bash
# See all branches
git branch -a

# Create and switch to new branch
git checkout -b feature/my-feature

# Update from main
git fetch origin
git rebase origin/main

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Abort merge conflicts
git merge --abort

# Force push (use carefully!)
git push -f origin feature/branch-name
```

### Useful Aliases (Optional)

Add to `.gitconfig`:
```ini
[alias]
  feature = checkout -b
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

Then use:
```bash
git feature my-new-feature
git st
git visual
```

---

## ✅ Checklist untuk Every PR

Before submitting PR:

- [ ] Branch name follows `<type>/<description>` format
- [ ] Commit message follows Conventional Commits
- [ ] PR title is descriptive and clear
- [ ] PR description explains what and why
- [ ] Reviewer is assigned (different person)
- [ ] Related issue is referenced (#123)
- [ ] Code is tested locally
- [ ] No merge conflicts
- [ ] No debug code (console.log, etc)
- [ ] Documentation is updated if needed

After approval:

- [ ] Address all review comments
- [ ] All checks passing
- [ ] Merge using "Squash and Merge"
- [ ] Delete branch after merge
- [ ] Update local main: `git pull origin main`

---

## 🎯 Best Practices

### ✅ DO

1. **Keep PRs small** - Easier to review, faster to merge
2. **Write clear commit messages** - Future self thanks you
3. **Ask questions in reviews** - Learn from each other
4. **Review promptly** - Respect teammates' time
5. **Reference issues** - Link work to requirements
6. **Document decisions** - In commits and PR description

### ❌ DON'T

1. **Force push to main** - Never! 🚫
2. **Merge conflicting PRs** - Resolve conflicts first
3. **Ignore review feedback** - Engage in discussion
4. **Leave PRs open for weeks** - Keep momentum
5. **Squash commits before review** - Let reviewers see history
6. **Merge without tests** - Quality first

---


## 📌 Important Links

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- Our GitHub: [cc-kelompok-ignite](https://github.com/your-org/cc-kelompok-ignite)
>>> mai
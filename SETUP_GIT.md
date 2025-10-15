# Setup Git et Push vers GitHub

## Étapes à suivre

### 1. Créer le repository sur GitHub

Allez sur GitHub et créez un nouveau repository dans l'organisation `2024-devops-alt-dist` :

```
Nom: demo-playwright
Description: Tutoriel Playwright E2E en français avec Todo List React
Visibilité: Public
```

Ou utilisez la ligne de commande :

```bash
gh repo create 2024-devops-alt-dist/demo-playwright --public --description "Tutoriel Playwright E2E en français avec Todo List React"
```

### 2. Faire les commits en Conventional Commits

```bash
# Ajouter l'application Todo
git add todo-app/
git commit -m "feat(todo-app): add React Todo List with TypeScript and Vite

- Initialize Vite React TypeScript project
- Implement Todo List with useState (add, complete, delete)
- Add minimal CSS styling
- Configure Vite dev server on port 5173"

# Ajouter la configuration Playwright
git add todo-app/playwright.config.ts todo-app/tests/
git commit -m "feat(tests): add Playwright E2E test suite

- Configure Playwright with Chromium browser only
- Setup webServer to auto-start Vite dev server
- Create 10 comprehensive E2E tests for Todo List
- Test workflows: add, complete, delete, keyboard navigation"

# Ajouter les scripts npm
git add todo-app/package.json
git commit -m "feat(scripts): add E2E test scripts to package.json

- Add test:e2e for running Playwright tests
- Add test:e2e:ui for UI mode
- Add test:e2e:headed for headed mode
- Add test:e2e:debug for debug mode"

# Ajouter GitHub Actions
git add .github/
git commit -m "ci(github-actions): add Playwright CI/CD workflow

- Configure workflow for push and pull requests
- Use actions/checkout@v5 and actions/setup-node@v5
- Install dependencies with npm ci
- Run Playwright tests automatically
- Upload test reports as artifacts"

# Ajouter la documentation
git add PLAYWRIGHT.md E2E.md README.md
git commit -m "docs: add comprehensive Playwright tutorial in French

- Add PLAYWRIGHT.md with complete Playwright guide
- Add E2E.md explaining E2E vs unit vs integration tests
- Add README.md with quick start guide
- Include examples, best practices, and comparisons"

# Ajouter les fichiers de configuration
git add .gitignore package.json
git commit -m "chore: add project configuration files

- Add .gitignore for node_modules and build artifacts
- Add root package.json for project metadata"
```

### 3. Ajouter le remote et pousser

```bash
# Ajouter le remote origin
git remote add origin https://github.com/2024-devops-alt-dist/demo-playwright.git

# Pousser tous les commits
git push -u origin main
```

### 4. Vérifier sur GitHub

Allez sur `https://github.com/2024-devops-alt-dist/demo-playwright` et vérifiez :

- ✅ Tous les fichiers sont présents
- ✅ Les commits suivent la convention Conventional Commits
- ✅ Le workflow GitHub Actions est configuré
- ✅ Le README s'affiche correctement

### 5. Tester le workflow GitHub Actions

Faites un petit changement et poussez pour déclencher le workflow :

```bash
# Modifier le README
echo "\n## Test GitHub Actions\n" >> README.md

# Commit et push
git add README.md
git commit -m "docs: test GitHub Actions workflow"
git push
```

Allez dans l'onglet **Actions** sur GitHub pour voir le workflow s'exécuter.

---

## Résumé des commits

Voici les 6 commits en Conventional Commits :

1. `feat(todo-app): add React Todo List with TypeScript and Vite`
2. `feat(tests): add Playwright E2E test suite`
3. `feat(scripts): add E2E test scripts to package.json`
4. `ci(github-actions): add Playwright CI/CD workflow`
5. `docs: add comprehensive Playwright tutorial in French`
6. `chore: add project configuration files`

**Total** : 6 commits bien organisés et descriptifs ! 🚀

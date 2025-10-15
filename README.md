# Tutoriel Playwright - Todo List E2E

Ce repository contient un **tutoriel complet Playwright en français** avec une application Todo List React pour apprendre les tests end-to-end (E2E).

## 📚 Contenu

- **[PLAYWRIGHT.md](./PLAYWRIGHT.md)** - Tutoriel complet Playwright en français (style Lefthook)
- **[todo-app/](./todo-app)** - Application Todo List React + TypeScript avec Vite
- **[tests/](./todo-app/tests)** - Tests E2E Playwright
- **[.github/workflows/playwright.yml](./.github/workflows/playwright.yml)** - Configuration GitHub Actions CI

## 🚀 Démarrage rapide

### 1. Installer les dépendances

```bash
# Installer les dépendances de l'app Todo
cd todo-app
npm install
```

### 2. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

### 3. Lancer les tests Playwright

```bash
# Tests en mode headless
npx playwright test

# Tests en mode UI (interface graphique)
npx playwright test --ui

# Voir le rapport HTML
npx playwright show-report
```

## 📖 Tutoriel

Consultez **[PLAYWRIGHT.md](./PLAYWRIGHT.md)** pour apprendre :

- ✅ C'est quoi Playwright et pourquoi l'utiliser
- ✅ Installation et configuration
- ✅ Concepts de base E2E
- ✅ Locators (getByRole, getByText, etc.)
- ✅ Actions (click, fill, check)
- ✅ Assertions (toBeVisible, toHaveText, toBeChecked)
- ✅ Exemples pratiques sur la Todo List
- ✅ Commandes utiles (test, ui, codegen, show-report)
- ✅ Intégration GitHub Actions

## 🧪 Structure des tests

Les tests couvrent les scénarios suivants :

- ✅ Afficher le titre et le message vide
- ✅ Ajouter une nouvelle tâche
- ✅ Ajouter plusieurs tâches
- ✅ Compléter une tâche (checkbox)
- ✅ Décocher une tâche complétée
- ✅ Supprimer une tâche
- ✅ Workflow complet (ajouter, compléter, supprimer)
- ✅ Ne pas ajouter de tâche vide
- ✅ Ajouter avec la touche Entrée

## 🛠️ Stack technique

- **React 18+** avec **TypeScript**
- **Vite 5+** - Build tool moderne et rapide
- **Playwright** - Framework de tests E2E
- **GitHub Actions** - CI/CD automatique

## 🎯 Objectif pédagogique

Ce projet est conçu pour être **ultra-simple** et **accessible aux débutants** en tests E2E.

- Pas de sur-engineering
- Focus sur les bases de Playwright
- Code commenté et expliqué
- Style pédagogique (tutoriel Lefthook)

## 📦 Commandes utiles

```bash
# Lancer l'app en dev
npm run dev

# Lancer les tests
npx playwright test

# Mode UI (interface graphique)
npx playwright test --ui

# Mode debug
npx playwright test --debug

# Générer des tests automatiquement
npx playwright codegen http://localhost:5173

# Voir le rapport HTML
npx playwright show-report

# Lancer les tests sur un seul navigateur
npx playwright test --project=chromium
```

## 🤖 GitHub Actions

Les tests sont lancés automatiquement sur chaque push et pull request via GitHub Actions.

Configuration dans [.github/workflows/playwright.yml](./.github/workflows/playwright.yml)

## 📝 License

MIT

## 🙌 Ressources

- [Documentation Playwright officielle](https://playwright.dev)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Discord Playwright](https://aka.ms/playwright/discord)

---

**Bon test ! 🎭**

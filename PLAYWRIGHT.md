# Playwright - Framework de tests E2E

## C'est quoi Playwright ?

Playwright est un **framework de tests end-to-end (E2E)** créé par Microsoft qui permet d'**automatiser les navigateurs web**.
Il vous permet de tester votre application web comme le ferait un vrai utilisateur : cliquer sur des boutons, remplir des formulaires, vérifier que les éléments s'affichent correctement.

## Pourquoi Playwright ?

- **Multi-navigateurs** : Teste sur Chromium, Firefox et WebKit (Safari)
- **Rapide** : Tests parallèles, exécution ultra-rapide
- **Fiable** : Attend automatiquement que les éléments soient prêts
- **Moderne** : API simple et intuitive, TypeScript natif
- **Outils puissants** : Mode UI, génération automatique de tests (Codegen), traces visuelles
- **Auto-wait** : Pas besoin de `sleep()`, Playwright attend intelligemment

## Qu'est-ce qu'un test E2E ?

**E2E** = **End-to-End** = **De bout en bout**

Un test E2E simule un parcours utilisateur complet dans votre application :

1. 🖱️ **Ouvrir** le navigateur
2. 🌐 **Naviguer** vers votre application
3. ✍️ **Interagir** avec l'interface (cliquer, taper du texte)
4. ✅ **Vérifier** que le résultat est correct
5. ❌ **Signaler** si quelque chose ne fonctionne pas

**Exemple** : Tester l'ajout d'une tâche dans une Todo List
- Ouvrir l'app
- Taper "Acheter du pain" dans l'input
- Cliquer sur "Ajouter"
- Vérifier que "Acheter du pain" apparaît dans la liste

## Installation

### Dans un projet existant

```bash
npm init playwright@latest
```

Cette commande va :
- ✅ Installer `@playwright/test`
- ✅ Créer le fichier de configuration `playwright.config.ts`
- ✅ Créer un dossier `tests/` avec des exemples
- ✅ Télécharger les navigateurs nécessaires

### Répondre aux questions

```
Where to put your end-to-end tests? › tests
Add a GitHub Actions workflow? › true
```

**Astuce** : Acceptez la GitHub Actions pour avoir des tests automatiques sur chaque push !

## Configuration Playwright

Le fichier `playwright.config.ts` configure comment Playwright va lancer vos tests.

### Configuration minimale

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',                    // Dossier des tests
  fullyParallel: true,                   // Lancer les tests en parallèle
  forbidOnly: !!process.env.CI,          // Bloquer .only en CI
  retries: process.env.CI ? 2 : 0,       // Relancer 2 fois en CI si échec
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',                      // Rapport HTML des résultats

  use: {
    baseURL: 'http://localhost:5173',    // URL de base pour les tests
    trace: 'on-first-retry',             // Enregistrer les traces en cas d'échec
  },

  projects: [
    {
      name: 'chromium',                  // Tester sur Chrome
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',              // Démarrer le serveur automatiquement
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Options importantes

- **`baseURL`** : URL de base pour `page.goto('/')` → évite de répéter l'URL complète
- **`webServer`** : Lance automatiquement votre app avant les tests
- **`trace`** : Enregistre des traces visuelles pour débugger les échecs
- **`retries`** : Relance automatiquement les tests en cas d'échec (utile en CI)

## Les Locators (trouver des éléments)

Les **locators** sont la façon dont Playwright trouve les éléments dans votre page.

### Locators recommandés (par ordre de priorité)

#### 1. `getByRole()` - Le meilleur ! ✅

Trouve les éléments par leur **rôle accessible** (bon pour l'accessibilité).

```typescript
// Trouver un bouton par son texte
await page.getByRole('button', { name: 'Ajouter' });

// Trouver un titre (h1, h2, etc.)
await page.getByRole('heading', { name: 'Ma Todo List' });

// Trouver un input checkbox
await page.getByRole('checkbox');

// Trouver un lien
await page.getByRole('link', { name: 'En savoir plus' });
```

**Rôles courants** : `button`, `heading`, `textbox`, `checkbox`, `link`, `list`, `listitem`

#### 2. `getByText()` - Pour le texte visible

Trouve un élément contenant un texte spécifique.

```typescript
// Texte exact
await page.getByText('Acheter du pain');

// Texte partiel (regex)
await page.getByText(/Acheter/);
```

#### 3. `getByPlaceholder()` - Pour les inputs

Trouve un input par son attribut `placeholder`.

```typescript
await page.getByPlaceholder('Ajouter une tâche...');
```

#### 4. `getByLabel()` - Pour les formulaires

Trouve un input associé à un `<label>`.

```typescript
// HTML : <label for="email">Email</label><input id="email" />
await page.getByLabel('Email');
```

#### 5. `locator()` - Sélecteur CSS (dernier recours)

Utilise un sélecteur CSS classique.

```typescript
// Sélecteur CSS
await page.locator('.todo-item');
await page.locator('#my-button');

// Combinaisons
await page.locator('li').filter({ hasText: 'Acheter du pain' });
```

## Actions de base

### Naviguer

```typescript
// Aller à une URL
await page.goto('https://example.com');

// Avec baseURL configuré
await page.goto('/'); // → http://localhost:5173/
```

### Cliquer

```typescript
// Cliquer sur un bouton
await page.getByRole('button', { name: 'Ajouter' }).click();

// Double-clic
await page.getByRole('button', { name: 'Éditer' }).dblclick();
```

### Remplir un input

```typescript
// Remplir un champ texte
await page.getByPlaceholder('Email').fill('[email protected]');

// Effacer puis remplir
await page.getByPlaceholder('Recherche').fill('');
await page.getByPlaceholder('Recherche').fill('Nouvelle recherche');
```

### Cocher / décocher une checkbox

```typescript
// Cocher
await page.getByRole('checkbox').check();

// Décocher
await page.getByRole('checkbox').uncheck();
```

### Appuyer sur une touche

```typescript
// Appuyer sur Entrée
await page.getByPlaceholder('Recherche').press('Enter');

// Autres touches
await page.press('Escape');
await page.press('Tab');
```

## Assertions (vérifications)

Les **assertions** vérifient que votre application se comporte correctement.

### Vérifier la visibilité

```typescript
// Vérifier qu'un élément est visible
await expect(page.getByText('Bienvenue')).toBeVisible();

// Vérifier qu'un élément n'est PAS visible
await expect(page.getByText('Erreur')).not.toBeVisible();
```

### Vérifier le texte

```typescript
// Vérifier le contenu exact
await expect(page.getByRole('heading')).toHaveText('Ma Todo List');

// Vérifier que le texte contient quelque chose
await expect(page.locator('.message')).toContainText('succès');
```

### Vérifier une valeur d'input

```typescript
// Vérifier la valeur d'un input
await expect(page.getByPlaceholder('Email')).toHaveValue('[email protected]');

// Vérifier qu'un input est vide
await expect(page.getByPlaceholder('Recherche')).toHaveValue('');
```

### Vérifier une checkbox

```typescript
// Vérifier qu'une checkbox est cochée
await expect(page.getByRole('checkbox')).toBeChecked();

// Vérifier qu'elle n'est PAS cochée
await expect(page.getByRole('checkbox')).not.toBeChecked();
```

### Vérifier le nombre d'éléments

```typescript
// Vérifier qu'il y a exactement 3 tâches
await expect(page.locator('li.todo-item')).toHaveCount(3);
```

### Vérifier une classe CSS

```typescript
// Vérifier qu'un élément a une classe CSS
await expect(page.locator('li').first()).toHaveClass(/completed/);
```

## Exemple pratique : Tests d'une Todo List

Voici un exemple complet de tests E2E pour une application Todo List.

### Structure du test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo List E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers l'app avant chaque test
    await page.goto('/');
  });

  // Vos tests ici...
});
```

### Test 1 : Vérifier l'affichage initial

```typescript
test('affiche le titre de la todo list', async ({ page }) => {
  // Vérifier que le titre principal est visible
  await expect(page.getByRole('heading', { name: 'Ma Todo List' })).toBeVisible();
});

test('affiche le message vide au démarrage', async ({ page }) => {
  // Vérifier que le message "Aucune tâche" est affiché
  await expect(page.getByText('Aucune tâche pour le moment')).toBeVisible();
});
```

### Test 2 : Ajouter une tâche

```typescript
test('peut ajouter une nouvelle tâche', async ({ page }) => {
  // Trouver l'input et le bouton
  const input = page.getByPlaceholder('Ajouter une tâche...');
  const addButton = page.getByRole('button', { name: 'Ajouter' });

  // Remplir l'input avec une nouvelle tâche
  await input.fill('Acheter du pain');

  // Cliquer sur le bouton Ajouter
  await addButton.click();

  // Vérifier que la tâche apparaît dans la liste
  await expect(page.getByText('Acheter du pain')).toBeVisible();

  // Vérifier que l'input est vidé après l'ajout
  await expect(input).toHaveValue('');
});
```

### Test 3 : Compléter une tâche

```typescript
test('peut compléter une tâche', async ({ page }) => {
  const input = page.getByPlaceholder('Ajouter une tâche...');
  const addButton = page.getByRole('button', { name: 'Ajouter' });

  // Ajouter une tâche
  await input.fill('Faire les courses');
  await addButton.click();

  // Trouver la checkbox de la tâche
  const checkbox = page
    .locator('li')
    .filter({ hasText: 'Faire les courses' })
    .getByRole('checkbox');

  // Cocher la checkbox
  await checkbox.check();

  // Vérifier que la checkbox est cochée
  await expect(checkbox).toBeChecked();

  // Vérifier que le style de la tâche a changé (classe completed)
  const todoItem = page.locator('li').filter({ hasText: 'Faire les courses' });
  await expect(todoItem).toHaveClass(/completed/);
});
```

### Test 4 : Supprimer une tâche

```typescript
test('peut supprimer une tâche', async ({ page }) => {
  const input = page.getByPlaceholder('Ajouter une tâche...');
  const addButton = page.getByRole('button', { name: 'Ajouter' });

  // Ajouter une tâche
  await input.fill('Tâche à supprimer');
  await addButton.click();

  // Vérifier que la tâche est là
  await expect(page.getByText('Tâche à supprimer')).toBeVisible();

  // Trouver et cliquer sur le bouton de suppression
  const deleteButton = page
    .locator('li')
    .filter({ hasText: 'Tâche à supprimer' })
    .getByRole('button', { name: '✕' });

  await deleteButton.click();

  // Vérifier que la tâche a disparu
  await expect(page.getByText('Tâche à supprimer')).not.toBeVisible();

  // Vérifier que le message vide réapparaît
  await expect(page.getByText('Aucune tâche pour le moment')).toBeVisible();
});
```

### Test 5 : Workflow complet

```typescript
test('workflow complet: ajouter, compléter, supprimer', async ({ page }) => {
  const input = page.getByPlaceholder('Ajouter une tâche...');
  const addButton = page.getByRole('button', { name: 'Ajouter' });

  // Ajouter trois tâches
  await input.fill('Tâche 1');
  await addButton.click();

  await input.fill('Tâche 2');
  await addButton.click();

  await input.fill('Tâche 3');
  await addButton.click();

  // Compléter la deuxième tâche
  const checkbox2 = page.locator('li').filter({ hasText: 'Tâche 2' }).getByRole('checkbox');
  await checkbox2.check();
  await expect(checkbox2).toBeChecked();

  // Supprimer la première tâche
  const deleteButton1 = page.locator('li').filter({ hasText: 'Tâche 1' }).getByRole('button', { name: '✕' });
  await deleteButton1.click();

  // Vérifications finales
  await expect(page.getByText('Tâche 1')).not.toBeVisible();
  await expect(page.getByText('Tâche 2')).toBeVisible();
  await expect(page.getByText('Tâche 3')).toBeVisible();
  await expect(checkbox2).toBeChecked();
});
```

## Commandes utiles

### Lancer les tests

```bash
# Lancer tous les tests
npx playwright test

# Lancer un fichier spécifique
npx playwright test tests/todo.spec.ts

# Lancer un seul navigateur
npx playwright test --project=chromium
```

### Mode UI (interface graphique) 🎨

Le **mode UI** est un outil interactif pour débugger et explorer vos tests.

```bash
npx playwright test --ui
```

**Fonctionnalités** :
- ▶️ Lancer les tests un par un
- 🔍 Voir chaque étape en détail
- 🎯 Inspecter les locators
- ⏸️ Mettre en pause et avancer pas à pas
- 📸 Voir les captures d'écran à chaque étape

### Codegen - Génération automatique de tests 🪄

**Codegen** génère automatiquement du code de test en enregistrant vos actions dans le navigateur.

```bash
npx playwright codegen http://localhost:5173
```

**Comment ça marche** :
1. Un navigateur s'ouvre avec votre application
2. Vous cliquez, tapez du texte, naviguez normalement
3. Playwright génère le code correspondant en temps réel
4. Copiez-collez le code généré dans vos tests

**Super utile pour** :
- Apprendre la syntaxe Playwright
- Trouver les bons locators
- Prototyper rapidement un test

### Mode debug 🐛

Lance les tests en mode debug avec pause automatique.

```bash
# Debug tous les tests
npx playwright test --debug

# Debug un test spécifique
npx playwright test tests/todo.spec.ts --debug
```

### Voir le rapport HTML

Après avoir lancé les tests, ouvrez le rapport HTML :

```bash
npx playwright show-report
```

Le rapport contient :
- ✅ Tests réussis et ❌ tests échoués
- 📸 Captures d'écran des échecs
- 🎬 Traces vidéo
- ⏱️ Durée de chaque test

## GitHub Actions - Intégration Continue

Pour lancer vos tests automatiquement sur **chaque push** et **chaque pull request**, configurez GitHub Actions.

### Fichier `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v5

    - name: Setup Node.js
      uses: actions/setup-node@v5
      with:
        node-version: lts/*

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright Browsers
      run: npx playwright install --with-deps

    - name: Run Playwright tests
      run: npx playwright test

    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Que fait ce workflow ?

1. **Checkout** : Récupère le code du repository
2. **Setup Node.js** : Installe Node.js (dernière version LTS)
3. **Install dependencies** : Lance `npm ci` (installation depuis le lockfile)
4. **Install Playwright Browsers** : Télécharge Chromium, Firefox, WebKit
5. **Run tests** : Lance `npx playwright test`
6. **Upload results** : Upload les rapports même si le workflow est annulé (sauf si cancelled)

### Voir les résultats

1. Allez dans l'onglet **Actions** de votre repository GitHub
2. Cliquez sur le workflow **Playwright Tests**
3. Si des tests échouent, téléchargez les **artifacts** pour voir les captures d'écran et traces

## Bonnes pratiques

### ✅ À faire

- **Utiliser `getByRole()` en priorité** : Meilleure accessibilité
- **Attendre les éléments** : Playwright attend automatiquement, pas besoin de `sleep()`
- **Tests isolés** : Chaque test doit être indépendant
- **Noms descriptifs** : `test('peut ajouter une tâche')` plutôt que `test('test 1')`
- **`beforeEach()`** : Réinitialiser l'état avant chaque test

### ❌ À éviter

- **Éviter les `locator()` CSS** : Privilégier `getByRole()`, `getByText()`, etc.
- **Pas de `sleep()` ou `waitForTimeout()`** : Playwright attend intelligemment
- **Pas de tests dépendants** : Un test ne doit pas dépendre du résultat d'un autre
- **Éviter les sélecteurs fragiles** : `.button-123` peut changer, préférer `getByRole('button')`

## Pour aller plus loin

### Documentation officielle

- **Site officiel** : https://playwright.dev
- **Getting Started** : https://playwright.dev/docs/intro
- **API Reference** : https://playwright.dev/docs/api/class-playwright
- **Best Practices** : https://playwright.dev/docs/best-practices

### Ressources

- **Playwright GitHub** : https://github.com/microsoft/playwright
- **Discord communautaire** : https://aka.ms/playwright/discord
- **Exemples** : https://github.com/microsoft/playwright/tree/main/examples

### Sujets avancés (hors scope de ce tuto)

- **Page Object Model** : Organiser les tests avec des classes
- **Fixtures** : Réutiliser du code entre tests
- **API Testing** : Tester des API REST avec Playwright
- **Visual Regression** : Détecter les changements visuels
- **Tests parallèles** : Configuration avancée pour accélérer les tests
- **Mocking** : Simuler des réponses réseau

---

## Récapitulatif

🎯 **Playwright** = Framework de tests E2E moderne et puissant

📝 **Installation** : `npm init playwright@latest`

🔍 **Locators** : `getByRole()`, `getByText()`, `getByPlaceholder()`

🎬 **Actions** : `click()`, `fill()`, `check()`, `press()`

✅ **Assertions** : `toBeVisible()`, `toHaveText()`, `toBeChecked()`

🚀 **Commandes** : `npx playwright test`, `--ui`, `codegen`, `show-report`

🤖 **GitHub Actions** : Tests automatiques sur chaque push

**Bon test ! 🎭**

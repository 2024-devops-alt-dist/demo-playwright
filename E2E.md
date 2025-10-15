# Tests E2E - Guide Complet

## C'est quoi un test E2E ?

**E2E** = **End-to-End** = **De bout en bout**

Un test E2E simule **un utilisateur réel** qui utilise votre application du début à la fin.

### Exemple concret

Imaginez un utilisateur qui veut ajouter une tâche dans votre Todo List :

1. 🌐 Il ouvre son navigateur Chrome
2. 🔗 Il va sur `https://votre-app.com`
3. 👀 Il voit le titre "Ma Todo List"
4. ✍️ Il tape "Acheter du pain" dans l'input
5. 🖱️ Il clique sur le bouton "Ajouter"
6. ✅ Il voit "Acheter du pain" apparaître dans la liste
7. ☑️ Il coche la checkbox pour marquer la tâche comme complétée
8. ❌ Il clique sur le bouton de suppression
9. 👋 La tâche disparaît de la liste

**Un test E2E automatise EXACTEMENT ce parcours.**

## E2E vs Tests Unitaires vs Tests d'Intégration

### 🧪 Tests Unitaires (Jest, Vitest)

**Testent** : Une fonction isolée, un composant isolé

**Exemple** :
```javascript
// Tester une fonction pure
function addTodo(todos, newTodo) {
  return [...todos, newTodo];
}

test('addTodo ajoute une tâche', () => {
  const result = addTodo([], { id: 1, text: 'Test' });
  expect(result).toHaveLength(1);
});
```

**Avantages** :
- ✅ Super rapides (millisecondes)
- ✅ Faciles à débugger
- ✅ Testent la logique métier

**Inconvénients** :
- ❌ Ne testent pas l'intégration entre composants
- ❌ Ne testent pas le vrai navigateur
- ❌ Ne garantissent pas que l'app fonctionne pour l'utilisateur

### 🧩 Tests d'Intégration (React Testing Library)

**Testent** : L'interaction entre plusieurs composants, le DOM virtuel

**Exemple** :
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('peut ajouter une tâche', () => {
  render(<TodoApp />);

  const input = screen.getByPlaceholderText('Ajouter une tâche...');
  const button = screen.getByRole('button', { name: 'Ajouter' });

  fireEvent.change(input, { target: { value: 'Test' } });
  fireEvent.click(button);

  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

**Avantages** :
- ✅ Rapides (quelques secondes)
- ✅ Testent les interactions utilisateur
- ✅ Testent le rendu des composants React
- ✅ Pas besoin de vrai navigateur

**Inconvénients** :
- ❌ Utilisent un DOM virtuel (jsdom), pas un vrai navigateur
- ❌ Ne testent pas le CSS, les animations, les vraies API
- ❌ Ne détectent pas les bugs cross-browser

### 🌐 Tests E2E (Playwright, Cypress)

**Testent** : L'application complète dans un vrai navigateur

**Exemple** :
```typescript
test('peut ajouter une tâche', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.getByPlaceholder('Ajouter une tâche...').fill('Test');
  await page.getByRole('button', { name: 'Ajouter' }).click();

  await expect(page.getByText('Test')).toBeVisible();
});
```

**Avantages** :
- ✅ Testent l'expérience utilisateur réelle
- ✅ Détectent les bugs CSS, animations, API
- ✅ Testent sur plusieurs navigateurs (Chrome, Firefox, Safari)
- ✅ Capturent des screenshots et vidéos des échecs
- ✅ Confiance maximale que l'app fonctionne

**Inconvénients** :
- ❌ Plus lents (quelques secondes par test)
- ❌ Plus complexes à maintenir
- ❌ Peuvent être "flaky" (instables) si mal écrits

## Pyramide des Tests

La pyramide des tests recommande :

```
        /\
       /E2E\      ← Peu de tests E2E (critiques)
      /------\
     /Intégr.\   ← Tests d'intégration (principaux)
    /----------\
   / Unitaires \  ← Beaucoup de tests unitaires (base)
  /--------------\
```

**Pourquoi cette pyramide ?**

- **Tests unitaires** : Rapides, nombreux, testent la logique métier
- **Tests d'intégration** : Testent les interactions entre composants
- **Tests E2E** : Lents, coûteux, mais testent les parcours critiques

## Quoi tester avec E2E (Playwright) ?

### ✅ Testez les parcours utilisateurs critiques

**Parcours qui rapportent de l'argent ou sont essentiels** :
- 🛒 **E-commerce** : Ajouter au panier → Payer → Confirmation
- 🔐 **Authentification** : S'inscrire → Se connecter → Se déconnecter
- 📝 **Todo List** : Ajouter une tâche → Compléter → Supprimer
- 📊 **Dashboard** : Voir les données → Filtrer → Exporter

### ✅ Testez les interactions complexes

- **Multi-étapes** : Formulaires avec plusieurs pages
- **Drag & Drop** : Déplacer des éléments
- **Uploads** : Télécharger des fichiers
- **Modals/Popups** : Ouvrir/Fermer des fenêtres
- **Navigation** : Aller d'une page à l'autre

### ✅ Testez ce qui ne peut pas être testé autrement

- **CSS et Layout** : Vérifier qu'un élément est visible à l'écran
- **Animations** : Transitions, effets visuels
- **APIs externes** : Appels réseau réels
- **LocalStorage/Cookies** : Persistence des données
- **Cross-browser** : Chrome, Firefox, Safari

### ❌ NE testez PAS avec E2E

**Logique métier pure** :
```javascript
// ❌ Mauvais : E2E pour tester une fonction
test('addTodo ajoute une tâche', async ({ page }) => {
  // Lancer le navigateur juste pour tester une fonction...
});

// ✅ Bon : Test unitaire
test('addTodo ajoute une tâche', () => {
  expect(addTodo([], { id: 1 })).toHaveLength(1);
});
```

**Cas d'erreur de chaque composant** :
```javascript
// ❌ Mauvais : Tester tous les cas d'erreur en E2E
test('input affiche erreur si vide', async ({ page }) => {
  // Trop spécifique pour E2E
});

// ✅ Bon : Test d'intégration (React Testing Library)
test('input affiche erreur si vide', () => {
  render(<TodoInput />);
  fireEvent.submit(screen.getByRole('button'));
  expect(screen.getByText('Champ requis')).toBeInTheDocument();
});
```

**Edge cases et validations** :
- Validation de formulaire (champs requis, format email, etc.)
- Gestion d'erreur de chaque composant
- États de chargement de chaque composant

**Testez ces cas avec des tests unitaires/intégration !**

## Playwright vs React Testing Library

### 🎭 Playwright (E2E)

**Utiliser pour** :
- Tester les **parcours utilisateurs complets**
- Vérifier que l'**application fonctionne de bout en bout**
- Tester sur **plusieurs navigateurs**
- Tester les **intégrations avec des APIs réelles**
- Garantir que **l'utilisateur peut accomplir sa tâche**

**Exemples de tests Playwright** :
- ✅ Un utilisateur peut s'inscrire, se connecter, et publier un article
- ✅ Un utilisateur peut ajouter 3 tâches, en compléter une, et en supprimer une
- ✅ Un utilisateur peut filtrer les produits et ajouter au panier
- ✅ Un utilisateur peut uploader une image et voir la prévisualisation

### ⚛️ React Testing Library (Intégration)

**Utiliser pour** :
- Tester le **comportement d'un composant React**
- Vérifier les **interactions utilisateur simples**
- Tester le **rendu conditionnel**
- Vérifier les **props et états** des composants
- Tests **rapides** pendant le développement

**Exemples de tests React Testing Library** :
- ✅ Le composant TodoItem affiche le texte passé en props
- ✅ Cliquer sur la checkbox appelle la fonction onToggle
- ✅ Le bouton de suppression affiche une confirmation
- ✅ Le composant affiche un loader pendant le chargement
- ✅ Le formulaire affiche une erreur si les champs sont vides

## Tableau comparatif

| Critère | Tests Unitaires | React Testing Library | Playwright (E2E) |
|---------|----------------|----------------------|-----------------|
| **Vitesse** | ⚡⚡⚡ Millisecondes | ⚡⚡ Secondes | ⚡ Quelques secondes |
| **Environnement** | Node.js | jsdom (DOM virtuel) | Vrai navigateur |
| **Scope** | Une fonction | Un/plusieurs composants | Application complète |
| **Confiance** | 🔵 Faible | 🟡 Moyenne | 🟢 Élevée |
| **Maintenance** | ✅ Facile | ✅ Facile | ⚠️ Plus complexe |
| **Quand lancer** | À chaque sauvegarde | Avant commit | Avant deploy / En CI |
| **Combien ?** | 100-1000+ tests | 50-200 tests | 10-50 tests |

## Stratégie de tests pour une Todo List

### Tests Unitaires (Jest/Vitest)

```javascript
// Tester la logique métier pure
describe('Todo utils', () => {
  test('addTodo ajoute une tâche', () => {
    const todos = [];
    const result = addTodo(todos, { id: 1, text: 'Test' });
    expect(result).toHaveLength(1);
  });

  test('toggleTodo change le statut', () => {
    const todos = [{ id: 1, text: 'Test', completed: false }];
    const result = toggleTodo(todos, 1);
    expect(result[0].completed).toBe(true);
  });

  test('deleteTodo supprime une tâche', () => {
    const todos = [{ id: 1, text: 'Test' }];
    const result = deleteTodo(todos, 1);
    expect(result).toHaveLength(0);
  });
});
```

**Combien ?** 10-20 tests unitaires

### Tests d'Intégration (React Testing Library)

```javascript
// Tester le comportement des composants React
describe('TodoApp', () => {
  test('affiche la liste vide au démarrage', () => {
    render(<TodoApp />);
    expect(screen.getByText('Aucune tâche')).toBeInTheDocument();
  });

  test('affiche une erreur si input vide', () => {
    render(<TodoApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    expect(screen.getByText('Champ requis')).toBeInTheDocument();
  });

  test('peut ajouter une tâche', () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText('Ajouter une tâche...');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

**Combien ?** 5-10 tests d'intégration

### Tests E2E (Playwright)

```typescript
// Tester les parcours utilisateurs complets
test.describe('Todo List E2E', () => {
  test('workflow complet: ajouter, compléter, supprimer', async ({ page }) => {
    await page.goto('/');

    // Ajouter 3 tâches
    await page.getByPlaceholder('Ajouter une tâche...').fill('Tâche 1');
    await page.getByRole('button', { name: 'Ajouter' }).click();

    await page.getByPlaceholder('Ajouter une tâche...').fill('Tâche 2');
    await page.getByRole('button', { name: 'Ajouter' }).click();

    await page.getByPlaceholder('Ajouter une tâche...').fill('Tâche 3');
    await page.getByRole('button', { name: 'Ajouter' }).click();

    // Compléter la 2ème tâche
    const checkbox = page.locator('li').filter({ hasText: 'Tâche 2' }).getByRole('checkbox');
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Supprimer la 1ère tâche
    await page.locator('li').filter({ hasText: 'Tâche 1' }).getByRole('button', { name: '✕' }).click();

    // Vérifications finales
    await expect(page.getByText('Tâche 1')).not.toBeVisible();
    await expect(page.getByText('Tâche 2')).toBeVisible();
    await expect(page.getByText('Tâche 3')).toBeVisible();
  });
});
```

**Combien ?** 3-5 tests E2E (parcours critiques uniquement)

## Règles d'or pour décider

### Utilisez des tests unitaires si...

- ✅ Vous testez une **fonction pure** (pas d'effets de bord)
- ✅ Vous testez de la **logique métier**
- ✅ Vous voulez des tests **ultra-rapides**
- ✅ Vous testez des **calculs, transformations, validations**

**Exemples** : `calculateTotal()`, `formatDate()`, `validateEmail()`

### Utilisez React Testing Library si...

- ✅ Vous testez le **rendu d'un composant React**
- ✅ Vous testez les **interactions simples** (click, change)
- ✅ Vous testez les **props et états** d'un composant
- ✅ Vous voulez des tests **rapides** pendant le développement
- ✅ Vous testez le **rendu conditionnel**

**Exemples** : `TodoItem`, `TodoInput`, `TodoList`, `Button`

### Utilisez Playwright (E2E) si...

- ✅ Vous testez un **parcours utilisateur complet**
- ✅ Vous testez l'**intégration avec des APIs réelles**
- ✅ Vous testez sur **plusieurs navigateurs**
- ✅ Vous testez des **fonctionnalités critiques** pour le business
- ✅ Vous voulez garantir que **l'utilisateur final peut accomplir sa tâche**

**Exemples** : Workflow d'inscription, Processus de paiement, Parcours Todo complet

## Exemple concret : "Ajouter une tâche"

### ❌ Mauvais : Tout tester en E2E

```typescript
// Ne faites PAS ça ! Trop de tests E2E
test('input vide affiche erreur', async ({ page }) => { ... }); // ❌ RTL
test('input avec espaces est refusé', async ({ page }) => { ... }); // ❌ RTL
test('input > 100 caractères est refusé', async ({ page }) => { ... }); // ❌ Unitaire
test('peut ajouter une tâche', async ({ page }) => { ... }); // ✅ E2E
test('peut ajouter 10 tâches', async ({ page }) => { ... }); // ❌ Unitaire
test('peut ajouter avec Entrée', async ({ page }) => { ... }); // ✅ E2E
```

### ✅ Bon : Répartir intelligemment

**Tests unitaires** (rapides, nombreux) :
```javascript
test('validateTodoText rejette texte vide');
test('validateTodoText rejette texte > 100 caractères');
test('validateTodoText accepte texte valide');
```

**Tests d'intégration RTL** (composants React) :
```javascript
test('TodoInput affiche erreur si vide');
test('TodoInput appelle onAdd avec le texte');
test('TodoInput vide le champ après ajout');
```

**Tests E2E Playwright** (parcours utilisateur) :
```typescript
test('peut ajouter une tâche et la voir dans la liste');
test('peut ajouter avec la touche Entrée');
```

## Résumé

🎯 **Tests unitaires** → Logique métier pure, fonctions isolées
⚛️ **React Testing Library** → Comportement des composants React
🎭 **Playwright** → Parcours utilisateurs complets

**La bonne stratégie** :
- 80% de tests unitaires (rapides, nombreux)
- 15% de tests d'intégration (composants React)
- 5% de tests E2E (parcours critiques)

**Ne testez pas tout en E2E !** C'est lent, coûteux, et difficile à maintenir.

**Testez intelligemment** : Chaque type de test a son rôle ! 🚀

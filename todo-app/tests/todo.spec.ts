import { test, expect } from '@playwright/test';

test.describe('Todo List E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers l'application avant chaque test
    await page.goto('/');
  });

  test('affiche le titre de la todo list', async ({ page }) => {
    // Vérifier que le titre principal est visible
    await expect(page.getByRole('heading', { name: 'Ma Todo List' })).toBeVisible();
  });

  test('affiche le message vide au démarrage', async ({ page }) => {
    // Vérifier que le message "Aucune tâche" est affiché
    await expect(page.getByText('Aucune tâche pour le moment')).toBeVisible();
  });

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

  test('peut ajouter plusieurs tâches', async ({ page }) => {
    const input = page.getByPlaceholder('Ajouter une tâche...');
    const addButton = page.getByRole('button', { name: 'Ajouter' });

    // Ajouter première tâche
    await input.fill('Tâche 1');
    await addButton.click();

    // Ajouter deuxième tâche
    await input.fill('Tâche 2');
    await addButton.click();

    // Ajouter troisième tâche
    await input.fill('Tâche 3');
    await addButton.click();

    // Vérifier que toutes les tâches sont visibles
    await expect(page.getByText('Tâche 1')).toBeVisible();
    await expect(page.getByText('Tâche 2')).toBeVisible();
    await expect(page.getByText('Tâche 3')).toBeVisible();
  });

  test('peut compléter une tâche', async ({ page }) => {
    const input = page.getByPlaceholder('Ajouter une tâche...');
    const addButton = page.getByRole('button', { name: 'Ajouter' });

    // Ajouter une tâche
    await input.fill('Faire les courses');
    await addButton.click();

    // Trouver la checkbox de la tâche
    const checkbox = page.locator('li').filter({ hasText: 'Faire les courses' }).getByRole('checkbox');

    // Cocher la checkbox
    await checkbox.check();

    // Vérifier que la checkbox est cochée
    await expect(checkbox).toBeChecked();

    // Vérifier que le style de la tâche a changé (classe completed)
    const todoItem = page.locator('li').filter({ hasText: 'Faire les courses' });
    await expect(todoItem).toHaveClass(/completed/);
  });

  test('peut décocher une tâche complétée', async ({ page }) => {
    const input = page.getByPlaceholder('Ajouter une tâche...');
    const addButton = page.getByRole('button', { name: 'Ajouter' });

    // Ajouter et compléter une tâche
    await input.fill('Nettoyer la maison');
    await addButton.click();

    const checkbox = page.locator('li').filter({ hasText: 'Nettoyer la maison' }).getByRole('checkbox');
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Décocher la tâche
    await checkbox.uncheck();

    // Vérifier que la checkbox n'est plus cochée
    await expect(checkbox).not.toBeChecked();
  });

  test('peut supprimer une tâche', async ({ page }) => {
    const input = page.getByPlaceholder('Ajouter une tâche...');
    const addButton = page.getByRole('button', { name: 'Ajouter' });

    // Ajouter une tâche
    await input.fill('Tâche à supprimer');
    await addButton.click();

    // Vérifier que la tâche est là
    await expect(page.getByText('Tâche à supprimer')).toBeVisible();

    // Trouver et cliquer sur le bouton de suppression
    const deleteButton = page.locator('li').filter({ hasText: 'Tâche à supprimer' }).getByRole('button', { name: '✕' });
    await deleteButton.click();

    // Vérifier que la tâche a disparu
    await expect(page.getByText('Tâche à supprimer')).not.toBeVisible();

    // Vérifier que le message vide réapparaît
    await expect(page.getByText('Aucune tâche pour le moment')).toBeVisible();
  });

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

  test('ne peut pas ajouter une tâche vide', async ({ page }) => {
    const input = page.getByPlaceholder('Ajouter une tâche...');
    const addButton = page.getByRole('button', { name: 'Ajouter' });

    // Essayer d'ajouter une tâche vide
    await input.fill('');
    await addButton.click();

    // Vérifier que le message vide est toujours là
    await expect(page.getByText('Aucune tâche pour le moment')).toBeVisible();
  });

  test('peut ajouter une tâche avec la touche Entrée', async ({ page }) => {
    const input = page.getByPlaceholder('Ajouter une tâche...');

    // Remplir et appuyer sur Entrée
    await input.fill('Tâche ajoutée avec Entrée');
    await input.press('Enter');

    // Vérifier que la tâche apparaît
    await expect(page.getByText('Tâche ajoutée avec Entrée')).toBeVisible();
  });
});

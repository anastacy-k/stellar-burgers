import { test, expect, Page } from '@playwright/test';
import path from 'path';

// Моковые данные для ответа на запрос данных пользователя
const mockUserResponse = {
  success: true,
  user: { email: 'test@test.com', name: 'Test User' }
};

// Моковые данные для ответа на запрос создания заказа
const mockOrderNumber = 12345;
const mockOrderResponse = {
  success: true,
  name: 'Флюоресцентный метеоритный бургер',
  order: {
    _id: 'order-id-mock-123',
    status: 'done',
    name: 'Флюоресцентный метеоритный бургер',
    owner: {
      name: 'Test User',
      email: 'test@test.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: mockOrderNumber,
    price: 4498
  }
};

// Моковые токены авторизации
const MOCK_ACCESS_TOKEN = 'Bearer test-access-token-mock';
const MOCK_REFRESH_TOKEN = 'test-refresh-token-mock';

// Путь до HAR-файла с моковыми ингредиентами
const ingredientsHarPath = path.join(__dirname, 'hars', 'ingredients.har');

// Хелпер: устанавливает куку accessToken и localStorage refreshToken
async function setAuthTokens(page: Page) {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: MOCK_ACCESS_TOKEN,
      domain: 'localhost',
      path: '/'
    }
  ]);
  await page.evaluate(
    (token) => localStorage.setItem('refreshToken', token),
    MOCK_REFRESH_TOKEN
  );
}

// Хелпер: добавляет в конструктор первую булку из списка
async function addFirstBun(page: Page) {
  const bunHeading = page.getByRole('heading', { name: 'Булки' });
  const bunSection = bunHeading.locator('~ ul');
  await bunSection.getByText('Добавить').first().click();
}

// Хелпер: добавляет в конструктор первую начинку из списка
async function addFirstFilling(page: Page) {
  const mainHeading = page.getByRole('heading', { name: 'Начинки' });
  const mainSection = mainHeading.locator('~ ul');
  await mainSection.getByText('Добавить').first().click();
}

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Перехватываем запрос ингредиентов — отвечаем данными из HAR-файла
    await page.routeFromHAR(ingredientsHarPath, {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    // Ждём, пока загрузятся ингредиенты
    await page.waitForSelector('text=Краторная булка N-200i');
  });

  test.describe('Добавление ингредиентов в конструктор', () => {
    test('добавляет булку в конструктор', async ({ page }) => {
      await expect(page.getByText('Выберите булки').first()).toBeVisible();

      await addFirstBun(page);

      await expect(
        page.getByText('Краторная булка N-200i (верх)')
      ).toBeVisible();
      await expect(
        page.getByText('Краторная булка N-200i (низ)')
      ).toBeVisible();
    });

    test('добавляет начинку в конструктор', async ({ page }) => {
      await expect(page.getByText('Выберите начинку')).toBeVisible();

      await addFirstFilling(page);

      // Начинка должна появиться в конструкторе
      const constructorSection = page.locator('section').filter({
        has: page.getByText('Выберите булки')
      });
      await expect(
        constructorSection.getByText('Говяжий метеорит (отбивная)')
      ).toBeVisible();
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    test('открывается при клике на ингредиент', async ({ page }) => {
      // Кликаем на изображение первого ингредиента в списке (ссылку на детали)
      await page.getByAltText('картинка ингредиента.').first().click();

      await expect(page.getByText('Детали ингредиента')).toBeVisible();
    });

    test('закрывается по клику на крестик', async ({ page }) => {
      await page.getByAltText('картинка ингредиента.').first().click();
      await expect(page.getByText('Детали ингредиента')).toBeVisible();

      // Кнопка закрытия — единственная кнопка в портале #modals
      await page.locator('#modals button').click();

      await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
    });

    test('отображает данные именно того ингредиента, по которому произошел клик', async ({
      page
    }) => {
      // Кликаем на второй ингредиент в списке (Флюоресцентная булка R2-D3)
      await page.getByAltText('картинка ингредиента.').nth(1).click();

      await expect(page.locator('#modals')).toContainText(
        'Флюоресцентная булка R2-D3'
      );
      // Убеждаемся, что данные первого ингредиента не отображаются
      await expect(page.locator('#modals')).not.toContainText(
        'Краторная булка N-200i'
      );
    });

    test('закрывается по клику на оверлей', async ({ page }) => {
      await page.getByAltText('картинка ингредиента.').first().click();
      await expect(page.getByText('Детали ингредиента')).toBeVisible();

      // Оверлей — последний дочерний div в #modals (после div модального окна)
      await page.locator('#modals > div:last-child').click({
        position: { x: 10, y: 10 }
      });

      await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
    });
  });

  test.describe('Создание заказа', () => {
    test.afterEach(async ({ page }) => {
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.removeItem('refreshToken'));
    });

    test.beforeEach(async ({ page }) => {
      // Мокаем запрос данных пользователя
      await page.route('**/api/auth/user', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUserResponse)
        })
      );

      // Мокаем запрос создания заказа
      await page.route('**/api/orders', (route) => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockOrderResponse)
          });
        } else {
          route.continue();
        }
      });

      // Подставляем моковые токены авторизации
      await setAuthTokens(page);

      // Перезагружаем страницу, чтобы приложение подхватило токены
      await page.reload();
      await page.waitForSelector('text=Краторная булка N-200i');
    });

    test('создаёт заказ и показывает корректный номер в модальном окне, затем очищает конструктор', async ({
      page
    }) => {
      // Собираем бургер
      await addFirstBun(page);
      await addFirstFilling(page);

      // Нажимаем «Оформить заказ»
      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      // Проверяем, что модальное окно открылось и показывает правильный номер
      await expect(page.locator('#modals')).toContainText(
        String(mockOrderNumber)
      );

      // Проверяем, что конструктор пуст
      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(page.getByText('Выберите начинку')).toBeVisible();

      // Закрываем модальное окно
      await page.locator('#modals button').click();

      // Проверяем, что модальное окно закрылось
      await expect(
        page.locator('#modals').filter({ hasText: String(mockOrderNumber) })
      ).not.toBeVisible();
    });
  });
});

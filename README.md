# PetStore

**PetStore** - це веб-застосунок для онлайн-магазину товарів для тварин, що дозволяє користувачам переглядати та купувати продукти для своїх улюбленців. Система включає інтерфейс для адміністратора, де можна керувати товарами, замовленнями, користувачами та іншими аспектами магазину.

## Функціональні можливості

### Для користувачів:
- Перегляд списку товарів для тварин
- Оформлення замовлення
- Додавання товарів до кошика
- Керування кошиком
- Додавання товарів у обране
- Керування списком обраних товарів
- Оцінка та додавання відгуків до товарів
- Пошук товарів за назвою
- Сортування товарів за ціною та назвою
- Фільтр товарів за критеріями
- Реєстрація та авторизація користувачів

### Для адміністратора:
- Додавання, редагування та видалення товарів
- Перегляд та обробка замовлень
- Управління користувачами

## Технології

### Backend:
- **Node.js** (Express.js) для створення серверної частини
- **MySQL** для зберігання даних
- **JWT** для авторизації та автентифікації користувачів
- **Bcrypt.js** для хешування паролів

### Frontend:
- **React** для побудови інтерфейсу користувача
- **CSS** для стилізації
- **Axios** для роботи з API


## Необхідні інструменти

Перед початком необхідно встановити наступні інструменти:

- [Node.js (версія 18+)] (https://nodejs.org/uk)
- [npm] (https://www.npmjs.com/)
- [MySQL Server (v8+)] (https://dev.mysql.com/downloads/mysql/)
- [Git] (https://git-scm.com/)
- Рекомендовано [VS Code] (https://code.visualstudio.com/)

## Налаштування середовища розробки

Після встановлення необхідних інструментів, потрібно налаштувати середовище розробки:

### Клонування репозиторію 

Для клонування репозиторію в терміналі необіхдно ввести:

*git clone https://github.com/katya-tsepelieva/PetStore*

*cd PetStore*

У репозиторії мають бути дві папки:
- /backend
- /frontend

## Встановлення та конфігурація залежностей

### Frontend:

1. Перейдіть у директорію /frontend:
*cd frontend*

2. Встановіть всі необхідні залежності:
*npm install*

### Backend:

1. Перейдіть у директорію /backend:
*cd backend*

2. Встановіть залежності:
*npm install*

## Створення та налаштування бази даних:

Кроки для налаштування MySQL:

### Крок 1. Встановлення MySQL:
Перейдіть та встановіть MySQL на свою систему, якщо це не було зроблено.

### Крок 2. Створення бази даних:
Після встановлення MySQL потрібно створити базу даних для проекту. Відкрийте MySQL через командний рядок або через phpMyAdmin чи MySQL Workbench.
Виконайте наступну команду для створення бази даних:

*CREATE DATABASE pet_store;*

### Крок 3. Налаштування з'єднання з базою даних:
У файлі .env бекенду додайте наступні змінні для налаштування з'єднання з MySQL:

DB_HOST=localhost

DB_PORT=3306

DB_USER=root

DB_PASSWORD=your_password

DB_NAME=pet_store

### Крок 4. Перевірка з'єднання:
Переконайтесь, що з'єднання з базою даних працює, запустивши сервер. Якщо є помилки при підключенні, перевірте налаштування MySQL і змінні середовища. 

### Крок 5. Створення таблиць:
Скопіювати скрипт з **backend/sql_script.txt**. 

## Запуск проекту у режимі розробки

### Запуск бекенду:

1. Перейдіть в директорію бекенду:
*cd backend*

2. Запустіть сервер у режимі розробки
*npm run dev*

Сервер буде доступний на порту http://localhost:5000.

### Запуск фронтенду:

1. Перейдіть в директорію фронтенду:
*cd frontend*

2. Запустіть React-додаток:
*npm start*

Додаток буде доступний на порту http://localhost:3000.

## Базові команди та операції

### Запуск фронтенду: 

*npm start* - запустить React-додаток на http://localhost:3000.

### Запуск бекенду у режимі розробки:

*npm run dev* - запустить сервер на порту http://localhost:5000.

## Стандарти документації

Для документування коду в проекті використовуємо **JSDoc**. Ось основні правила:
1. Кожна функція, клас, метод повинні бути документовані за допомогою JSDoc.
2. Коментарі повинні починатися з `/**` і завершуватися `*/`.
3. Для функцій обов'язково вказувати типи параметрів та значення, яке функція повертає.
4. Для класів та методів надавати опис того, що вони роблять.

### Приклад документації для функцій:
```js
/**
 * Опис функції.
 * @param {type} paramName - Опис параметра.
 * @returns {type} Опис повернутого значення.
 */
function functionName(paramName) {
  // Тіло функції
}


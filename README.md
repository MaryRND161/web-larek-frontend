# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Оглавление

- [Запуск](#запуск)
- [Сборка](#сборка)
- [Описание](#структура)
- [Описание](#описание)
- [Документация](#документация)
- [Источник](#источник)

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

## Запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Структура

.
├── src/ [Исходные файлы проекта]
│   ├── common.blocks/ [Стили компонент верстки]
│   ├── components/ [Реализация]
│   │   ├── base/ [Базовый код]
│   │   │   ├── api.ts [Базовый класс для работы с API]
│   │   │   ├── Component.ts [Базовый класс View]
│   │   │   ├── events.ts [Брокер, обработчик, слушатели событий]
│   │   │   ├── Model.ts [Базовый класс модели]
│   │   ├── common/ [Отображения: переиспользуемые компоненты]
│   │   │   ├── Basket.ts [View-класс корзины]
│   │   │   ├── Form.ts [View-класс формы]
│   │   │   ├── Modal.ts [View-класс модального окна]
│   │   │   ├── Success.ts [View-класс финальной страницы заказа]
│   │   │   ├── Contacts.ts [View-класс формы с контактной информацией]
│   │   │   ├── Order.ts [Класс модели заказа]
│   │   ├── AppData.ts [Класс модели приложения]
│   │   ├── BasketItem.ts [View-класс карточки в корзине]
│   │   ├── Card.ts [View-класс карточки]
│   │   ├── Page.ts [View-класс основной страницы]
│   ├── pages/
│   │   ├── index.html [Основная страница и шаблоны компонент]
│   ├── types/ [Типизация]
│   │   ├── index.ts [Интерфейс, описывающий поля товара, заказа и внутреннее состояние приложения]
│   ├── utils/
│   │   ├── constants.ts [Настройки проекта]
│   │   ├── utils.ts [Утилиты для работы с DOM]
│   ── index.ts [Базовый код]
├── api.yaml [Спецификация API]

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Описание

Проект "Web-ларёк!" реализует простой интернет-магазин с товарами для веб-разработчиков. В нём пользователь может просматривать каталог товаров, добавлять товары в корзину и делать заказ. Проект реализован на TypeScript и представляет собой SPA (Single Page Application) с использованием API для получения данных о товарах и их стоимости.

Особенности реализации:
— содержит каталог товаров;
— при нажатии на карточку товара открывается модальное окно с детальной информацией о товаре;
— ри нажатии на кнопку «Купить» товар добавляется в корзину, если не был добавлен в корзину раньше;
— при оформлении заказа выбирается способ доставки и вводится адрес доставки, если адрес доставки не введён, появляется сообщение об ошибке;
— кнопка перехода к следующему шагу становится доступна только после выполнения действий на текущей странице (выбора товара, способа оплаты, заполнения данных о покупателе);
— модальные окна закрываются: по клику вне модального окна, по клику на иконку «Закрыть» (крестик).

## Документация

### Типы данных

```TypeScript
/*
    Тип описывающий все возможные категории товара
*/
type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

/*
    Тип, описывающий ошибки валидации форм
*/
type FormErrors = Partial<Record<keyof IOrderForm, string>>;

/*
  * Интерфейс, описывающий карточку товара
  * */
interface IProduct {
  // уникальный ID
  id: string;

  // описание товара
  description: string;

  // ссылка на изображение
  image: string;

  // название
  title: string;

  // категория товара
  category: CategoryType;

  // цена товара, м.б. null
  price: number | null;

  // флаг - был данный товар добавлен в корзину или нет
  selected: boolean;
}

/*
  * Интерфейс, описывающий внутреннее состояние приложения:
    -  используется для хранения карточек, корзины, заказа пользователя, ошибок
       при валидации форм;
    - имеет методы для работы с карточками и корзиной
  * */
interface IAppState {
  // Корзина с товарами
  basket: Product[];

  // Массив карточек товара
  catalog: Product[];

  // Информация о заказе
  order: IOrder;

  // Ошибки при заполнении форм
  formErrors: FormErrors;

  // Метод для добавления товара в корзину
  addToBasket(value: Product): void;

  // Метод для удаления товара из корзины
  deleteFromBasket(id: string): void;

  // Метод для полной очистки корзины
  clearBasket(): void;

  // Метод для получения количества товаров в корзине
  getBasketAmount(): number;

  // Метод для получения общей стоимости товаров в корзине
  getTotalBasketPrice(): number;

  // Метод для добавления ID товаров в корзине в поле items для order
  setItems(): void;

  // Метод для заполнения полей email, phone, address, payment в order
  setOrderField(field: keyof IOrderForm, value: string): void;

  // Валидация формы заказа (1-й шаг оформления товара: выбор способа оплаты и ввод адреса доставки)
  validateOrder(): boolean;

  // Валидация формы заказа (2-й шаг оформления товара: ввод почты и телефона покупателя)
  validateContacts(): boolean;

  // Очистить order после покупки товаров
  refreshOrder(): boolean;

  // Метод для преобразования данных, полученых с сервера, к формату, в котором они будут отображаться
  setStore(items: IProduct[]): void;

  // Метод для обновления поля selected во всех товарах после совершения покупки
  resetSelected(): void;
}

/*
  * Интерфейс, описывающий поля заказа товара
  * */
interface IOrder {
  // Массив ID купленных товаров
  items: string[];

  // Способ оплаты
  payment: string;

  // Сумма заказа
  total: number;

  // Адрес доставки
  address: string;

  // Электронная почта покупателя
  email: string;

  // Телефон покупателя
  phone: string;
}

/*
  * Интерфейс, описывающий карточку товара
* */
interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}

/*
  * Интерфейс, описывающий главную страницу
  * */
interface IPage {
  // Счётчик товаров в корзине
  counter: number;

  // Массив карточек с товарами
  catalog: HTMLElement[];

  // Переключатель для блокировки
  // Отключает прокрутку страницы
  locked: boolean;
}

/*
  * Интерфейс, описывающий корзину товаров
  * */
interface IBasket {
  // Массив элементов li с товаром
  list: HTMLElement[];

  // Общая стоимость товаров
  price: number;
}

/*
  * Интерфейс, описывающий 1-й шаг оформления товара: выбор способа оплаты и ввод адреса доставки
  * */
interface IOrder {
  // Адрес
  address: string;

  // Способ оплаты
  payment: string;
}

/*
  * Интерфейс, описывающий 2-й шаг оформления товара: ввод почты и телефона покупателя
  * */
interface IContacts {
  // Телефон
  phone: string;

  // Электронная почта
  email: string;
}
```

### Модели данных

```TypeScript
/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
abstract class Model<T> {
  // Принимает данные для хранения, эвент эмиттер
  constructor(data: Partial<T>, protected events: IEvents) {}

  // Вызывает эвент
  emitChanges(event: string, payload?: object) {}
}

/*
  * Класс, описывающий состояние приложения
  * */
class AppState extends Model<IAppState> {
  // Корзина с товарами
  basket: Product[] = [];

  // Массив со всеми товарами
  catalog: Product[];

  // Объект заказа клиента
  order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  };

  // Объект с ошибками форм
  formErrors: FormErrors = {};

  // Метод для добавления товара в корзину
  addToBasket(value: Product): void;

  // Метод для удаления товара из корзины
  deleteFromBasket(id: string): void;

  // Метод для полной очистки корзины
  clearBasket(): void;

  // Метод для получения количества товаров в корзине
  getBasketAmount(): number;

  // Метод для получения общей стоимости товаров в корзине
  getTotalBasketPrice(): number;

  // Метод для добавления ID товаров в корзине в поле items для order
  setItems(): void;

  // Метод для заполнения полей email, phone, address, payment в order
  setOrderField(field: keyof IOrderForm, value: string): void;

  // Валидация форм для окошка "контакты"
  validateContacts(): boolean;

  // Валидация форм для окошка "заказ"
  validateOrder(): boolean;

  // Очистить order после покупки товаров
  refreshOrder(): boolean;

  // Метод для превращения данных, полученых с сервера в тип данных приложения
  setStore(items: IProduct[]): void;

  // Метод для обновления поля selected во всех товарах после совершения покупки
  resetSelected(): void;
}
```

### Классы представления

```TypeScript
/**
 * Базовый компонент
 */
abstract class Component<T> {
  // Конструктор принимает родительский элемент
  protected constructor(protected readonly container: HTMLElement);

  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: string): void;

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean): void;

  // Скрыть
  protected setHidden(element: HTMLElement): void;

  // Показать
  protected setVisible(element: HTMLElement): void;

  // Установить изображение с альтернативным текстом
  protected setImage(el: HTMLImageElement, src: string, alt?: string): void;

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement;
}

/*
  * Класс, описывающий главную страницу
  * */
class Page extends Component<IPage> {
  // Ссылки на внутренние элементы
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLElement, protected events: IEvents);

  // Сеттер для счётчика товаров в корзине
  set counter(value: number);

  // Сеттер для карточек товаров на странице
  set catalog(items: HTMLElement[]);

  // Сеттер для блока прокрутки
  set locked(value: boolean);
}

/*
    Класс, описывающий карточку товара
*/
class Card extends Component<ICard> {
  // Ссылки на внутренние элементы карточки
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский контейнер
  // и объект с колбэк функциями
  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions);

  // Сеттер и геттер для уникального ID
  set id(value: string);
  get id(): string;

  // Сеттер и гетер для названия
  set title(value: string);
  get title(): string;

  // Сеттер для изображения
  set image(value: string);

  // Сеттер для флага - выбран товар или нет
  set selected(value: boolean);

  // Сеттер для цены
  set price(value: number | null);

  // Сеттер для категории
  set category(value: CategoryType);
}

/*
  * Класс, описывающий корзину товаров
  * */
class Basket extends Component<IBasket> {
  // Ссылки на внутренние элементы
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents);

  // Сеттер для общей стоимости
  set price(price: number);

  // Сеттер для списка товаров
  set list(items: HTMLElement[]);

  // Метод, отключающий кнопку "Оформить"
  disableButton(): void;

  // Метод для обновления индексов таблички при удалении товара из корзины
  refreshIndices(): void;
}

/*
  * Класс, описывающий 1-й шаг оформления товара: выбор способа оплаты и ввод адреса доставки
  * */
class Order extends Form<IOrder> {
  // Сссылки на внутренние элементы
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents);

  // Метод, отключающий подсвечивание кнопок
  disableButtons(): void;
}

/*
  * Класс, описывающий 2-й шаг оформления товара: ввод почты и телефона покупателя
  * */
class Contacts extends Form<IContacts> {
  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLFormElement, events: IEvents);
}
```

### Дополнительные классы

```TypeScript
/**
 * Класс для работы с Api
 */
class Api {
  // Базовый URL для Api
  readonly baseUrl: string;

  // Опции для fetch
  protected options: RequestInit;

  // Конструктор принимает базовый URL и опции
  constructor(baseUrl: string, options: RequestInit = {});

  // Обрабатывает запрос и возвращает промис с данными
  protected async handleResponse(response: Response): Promise<Partial<object>>;

  // Get запрос
  async get(uri: string);

  // Post запрос
  async post(uri: string, data: object);
}

/**
 * Обработчик событий
 */
class EventEmitter implements IEvents {
  // Map состоящий из событий и подписчиков
  _events: Map<EventName, Set<Subscriber>>;

  constructor() {}

  // Позволяет подписаться на событие
  on<T extends object>(eventName: EventName, callback: (event: T) => void) {}

  // Убирает колбэк с события
  off(eventName: EventName, callback: Subscriber) {}

  // Вызывает событие
  emit<T extends object>(eventName: string, data?: T) {}
}
```

### Описание событий

```TypeScript
/*
    Инициируется при изменении списка товаров и вызывает перерисовку
    списка товаров на странице
*/
'items:changed'

/*
    Инициируется при клике на карточку товара в классе CatalogItem и приводит
    к открытию модального окна с детальной информацией о товаре
*/
'card:select'

/*
    Инициируется при клике на кнопку "В корзину" на карточке CatalogItemView
    В AppState добавляет товар в корзину, обновляет счётчик на корзине
    в классе Page
    Делает поле selected на товаре true для отключения кнопки, чтобы больше
    товар добавить было нельзя
*/
'card:toBasket'

/*
    Инициируется при клике на кнопку "Корзина" и открывает модальное окно
    с классом Basket, где отображаются товары, добавленные в корзину
*/
'basket:open'

/*
    Инициируется при клике на кнопку удаления товара в корзине
    Удаляет товар из массива basket в классе AppData
    Обновляет счётчик корзины на странице
    Обновляет поле selected на товаре, делая его false
    Обновляет сумму заказа в корзине
    Обвновляет порядковые номера в списке корзины
*/
'basket:delete'

/*
    Инициируется при клике на кнопку "Оформить" в корзине
    Открывает окно с формой заказа для выбора способа оплаты
    и ввода адреса доставки (1-й шаг оформления товара)
    Используемый класс Order
*/
'basket:order'

/*
    Инициируется при нажатии на кнопку "Далее", при выбранном способе оплаты
    и введенном адресе доставки, в окне с формой заказа (на 1-м шаге оформления)
*/
'order:submit'

/*
    Инициируется при нажатии на кнопку "Оплатить", при заполненных полях с данными
    почты и телефона покупателя, в окне с формой заказа (на 2-м шаге оформления)
*/
'contacts:submit'

/*
    Инициируется при вводе данных в форму заказа (1-й и 2-й шаг оформления)
    Начинает процесс валидации формы
*/
'orderInput:change'

/*
    Инициируется при вводе данных в форму заказа (на 1-м шаге оформления) и совершает
    процесс валидации формы, возвращает ошибки валидации формы
*/
'orderFormErrors:change'

/*
    Инициируется при вводе данных в форму (на 2-м шаге оформления) и совершает
    процесс валидации формы, возвращает ошибки валидации формы
*/
'contactsFormErrors:change'

/*
    Инициируется при успешном ответе сервера при оплате товара
    Открывает модальное окно, сообщающее об успешной оплате
*/
'order:success'

/*
    Инициируется при клике на кнопку закрытия модального окна
    или при клике на свободное место вокруг модального окна
*/
'modal:close'
```

## Источник

Был использован набор инструментов и знаний 🔥, предоставленных ![**YANDEX-PRAKTIKUM**](https://user-images.githubusercontent.com/99074177/235997371-83c300d3-a976-47f7-b927-3b1381963c3a.png)

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Структура проекта

.
├── src/ [Исходные файлы проекта]
│   ├── common.blocks/ [Стили компонент верстки]
│   ├── components/ [Папка с JS компонентами]
│   │   ├── base/ [Папка с базовым кодом]
│   │   │   ├── api.ts [Базовый класс для работы с API]
│   │   │   ├── component.ts [Базовый класс View]
│   │   │   ├── events.ts [Брокер, обработчик, слушатели событий]
│   │   │   ├── model.ts [Базовый класс модели]
│   │   ├── common/ [Отображения: общие компоненты, не зависящие от доменной области проекта]
│   │   │   ├── Form.ts [View-класс формы]
│   │   │   ├── Modal.ts [View-класс модального окна]
│   │   │── Basket.ts [View-класс корзины]
│   │   ├── Card.ts [View-класс карточки]
│   │   ├── Order.ts [Класс модели заказа]
│   │   ├── Page.ts [View-класс основной страницы]
│   │   ├── ProductApi.ts [Класс для работы с сервером]
│   │   ├── ProductModel.ts [Класс модели приложения]
│   │   │── Success.ts [View-класс финальной страницы заказа]
│   ├── pages/
│   │   ├── index.html [HTML-файл главной страницы]
│   ├── types/ [Типизация]
│   │   ├── index.ts [Файл с типами]
│   ├── utils/
│   │   ├── constants.ts [Файл с константами]
│   │   ├── utils.ts [Файл с утилитами]
│   ── index.ts [Точка входа приложения]
├── api.yaml [Спецификация API]

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

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

## Описание

Проект "Web-ларёк!" реализует простой интернет-магазин с товарами для веб-разработчиков. В нём пользователь может просматривать каталог товаров, добавлять товары в корзину и делать заказ. Проект реализован на TypeScript и представляет собой SPA (Single Page Application) с использованием API для получения данных о товарах и их стоимости.

Особенности реализации:
— содержит каталог товаров;
— при нажатии на карточку товара открывается модальное окно с детальной информацией о товаре;
— при нажатии на кнопку «Купить» товар добавляется в корзину, если не был добавлен в корзину раньше;
— при оформлении заказа выбирается способ доставки и вводится адрес доставки, если адрес доставки не введён, появляется сообщение об ошибке;
— кнопка перехода к следующему шагу становится доступна только после выполнения действий на текущей странице (выбора товара, способа оплаты, заполнения данных о покупателе);
— модальные окна закрываются: по клику вне модального окна, по клику на иконку «Закрыть» (крестик).

## Архитектура проекта (MVC)

Архитектура проекта разработана с использованием паттерна MVP, в котором основными слоями являются: Model - модель данных, которая отвечает за работу с данными, View - компоненты представления, отвечающие за отображение данных на экране, Presenter - презентер, обеспечивающий взаимодействием между слоями данных (Model, View). Код презентера не выделен в отдельный класс, а содержится в основном скрипте `index.ts`.
Реализована единая модель данных приложения в файле `src/components/ProductModel.ts`, содержащая всю логику работы с данными и возможные действия над ними. Все изменения данных происходят через методы модели, а она в свою очередь уведомляет об изменениях через брокер событий `EventEmitter`.

При обработке событий, возникающих в `EventEmitter`, производится обновление данных в компонентах представления. Экраны это фактически крупные сборки инкапсулирующие детали реализации интерфейса и принимающие из вне только обработчики событий и необходимые данные. Экраны внутри составлены из более мелких отображений, которые инициализируют с помощью глобальных настроек проекта и распределяют данные между вложенными отображениями через свойства и метод `render()`.

Общую цепочку взаимодействия можно представить следующим образом:

```typescript

const events = new EventEmitter(); // Создаем экземпляр класса слушателя событий, у которого есть методы:
                                    // "on" - позволяет становить обработчик на событие,
                                    // "emit" - инициировать событие с данными,
                                    // "onAll" - слушать все события (для отладки)

const api = new ProductApi(CDN_URL, API_URL); // Инициализация API (получение списка товаров с сервера)
const productModel =  new ProductModel({}, events); // Инициализация модели данных приложения и событий
const view = new View( // Инициализация экранов
    // экран ждет объект с обработчиками событий, например { onClick: () => void }
 )

events.on('change:value', () => {
// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно
});

```

И таким образом соединяем между собой все компоненты приложения.

### Отображения

Каждое отображение в проекте (кроме `Order`) устроено следующим образом:

```typescript

class View extends Component<Тип_данных> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        // Используем метод жизненного цикла, для инициализация компонента
        // Здесь вешаем события
    }

    set value(value: number) {
        // Устанавливаем поле данных "value" в верстке
    }

    render(data: Partial<Тип_данных>): HTMLElement {
        // Отрисовка компонента
        // Переопределяем только по необходимости
        return this.container;
    }
}

```

### Модель (работа с данными)

Модель в проекте представлена классом `ProductModel`, который отвечает за хранение массива карточек и работу с массивом.
Для этого в нем есть поле класса `item`, в нем хранится массив объектов типа `IProductItem[]`. У класса есть конструктор (не принимает параметров).

```typescript

// Базовая модель
abstract class Model<T> {
 constructor(data: Partial<T>, protected events: IEvents) {}

 // Сообщить всем: модель поменялась
 emitChanges(event: string, payload?: object) {}
}

// Класс, описывающий состояние приложения
class ProductModel extends Model<IProductItem> {
 items: IProductItem[];
 basket: IProductItem[] = [];
 order: IOrder = {
  items: [],
  total: null,
  payment: '',
  address: '',
  email: '',
  phone: '',
 };
 formErrors: FormErrors = {};
 preview: string | null;
 idCounter: number;
 isError = false;

 protected settings: AppStateSettings;

 // возвращает число - порядковый номер товара в корзине
 makeId() {}

 // получает массив всех товаров
 getItems(): IProductItem[] {}

 // получает товар по индексу
 getItem(id: string): IProductItem {}

 // отмечает товар, выбранный для помещения в корзину
 selectedItem(id: string) {}

 // добавляет выбранный товар в корзину
 addItemToCart(item: IProductItem) {}

 // удаляет выбранный товар из корзины по индексу
 deleteItemFromCart(id: string) {}

 // возвращает число - количество элементов в корзине
 getTotalNumberCart() {}

 // возвращает число - общую стоимость товаров в корзине
 getTotalAmountCart(): number {}

 // переключает флаг(isIncluded) наличия товара в заказе
 availabilityInOrder(id: string, isIncluded: boolean) {}

 // удаляет все товары из корзины
 clearCart() {}

  // проверяет, что товар находится в корзине
 isProductInBasket(item: IProductItem): boolean {}

  // возвращает информацию о выбранном способе оплаты
 getPaymentMethod(): string {}

  // заполняет поля формы заказа
 setOrderField(field: keyof IOrderForm, value: string) {}

  // удаляет признак выбранного для корзины товара со всех товаров каталога
 resetSelectedAll() {}

  // добавляет в заказ товары из корзины
 setGoods() {}

  // проверяет на наличие данных в полях формы заказа (все поля должны быть заполнены)
 validateOrder() {}

  // удаляет данные о товарах из заказа
 clearOrder() {}
}

```

Модель частично реализует паттерн "Наблюдатель", и уведомляет об изменениях через метод `onChange(changes: AppStateChanges)`.
Для удобства работы с данными в модели реализованы методы для изменения данных, которые в свою очередь вызывают метод `onChange()`.

## Документация

### Типы данных

```typescript

// Доступные категории карточек
type ICardCategory =
 | 'софт-скил'
 | 'другое'
 | 'дополнительное'
 | 'кнопка'
 | 'хард-скил';

// Типизация настроек,
// какие настройки есть и какие значения они могут принимать.
interface ISettings {
 modalTemplate: string;
 modalSettings: {
  close: string;
  content: string;
  activeClass: string;
 };
}

// Какие изменения состояния приложения могут происходить
enum AppStateChanges {
 items = 'items:changed',
 modal = 'modal:changed',
 selectedCard = 'card:selected',
 basketAdd = 'card:addToBasket',
 basketDel = 'card:deleteFromBasket',
 basketView = 'basket:open',
 orderPyament = 'order:paymentMethod',
 orderMaking = 'order:making',
 formInput = 'input:changed',
 formErrors = 'formErrors:change',
 orderReady = 'order:submit',
 contactsReady = 'contacts:submit',
 order = 'change:order',
}

// Настройки модели данных
interface AppStateSettings {
 formatCurrency: (value: number) => string;
 storageKey: string;

 // функция, которая будет вызываться при изменении состояния
 onChange: (changed: AppStateChanges) => void;
}

// Модель данных приложения
// Интерфейс, описывающий товар (загружаемые с сервера данные)
interface IProductItem {

 // уникальный индекс
 id: string;

 // описание
 description?: string;

 // ссылка на изображение
 image: string;

 // название товара
 title: string;

 // категория товара
 category: ICardCategory;

 // цена товара
 price: number | null;

 // признак того, что товар был добавлен в корзину
 selected: boolean;
}

// Состояние интерфейса
interface ICardActions {
 onClick: (event: MouseEvent) => void;
}

// Интерфейс, описывающий главную страницу
interface IPage {

  // галерея карточек
 cardContainer: HTMLElement[];

// количество товаров в корзине
 basketTotal: number;

  // состояние блокировки прокрутки страницы
 locked: boolean;
}

// Интерфейс, описывающий элемент корзины
type IBasketItem = Pick<
 IProductItem,
 'id' | 'title' | 'price' | 'selected'
>;

// Интерфейс, описывающий корзину
interface IBasket extends IBasketItem {
 // общая стоимость товаров в корзине
 totalBasketPrice: number | null;

 // список элементов корзины
 listBasket: HTMLElement[];

 // порядковый номер элемента корзины
 indexBasket: number | null;
}

// Интерфейс, описывающий поля формы заказа
interface IOrderForm {

 // способ оплаты (онлайн / при получении)
 payment: string;

 // адрес доставки
 address: string;

 // электронная почта покупателя
 email: string;

 // телефон покупателя
 phone: string;
}

// Интерфейс, описывающий заказ
interface IOrder extends IOrderForm {

 // массив индексов купленных товаров
 items: string[];

 // сумма заказа
 total: number;
}

interface IOrderResult {
 id: string;
 total: number;
}

interface ISuccess {
 description: number;
}

export interface ISuccessActions {
 onClick: () => void;
}

// Тип, описывающий ошибки валидации форм
type FormErrors = Partial<Record<keyof IOrderForm, string>>;

```

### Классы представления

```TypeScript

// Базовый компонент
abstract class Component<T> {

  // Конструктор принимает родительский контейнер
 protected constructor(protected readonly container: HTMLElement);

 // Переключить класс
 toggleClass(element: HTMLElement, className: string, force?: boolean): void;

 // Установить текстовое содержимое
 protected setText(element: HTMLElement, value: unknown): void;

 // Сменить статус блокировки
 setDisabled(element: HTMLElement, state: boolean): void;

 // Скрыть
 protected setHidden(element: HTMLElement): void;

 // Показать
 protected setVisible(element: HTMLElement): void;

 // Установить изображение с альтернативным текстом
 protected setImage(element: HTMLImageElement, src: string, alt?: string): void;

 // Вернуть корневой DOM-элемент
 render(data?: Partial<T>): HTMLElement;
}

// Класс, описывающий главную страницу
class Page extends Component<IPage> {

  // Внутренние элементы главной страницы
 protected cardContainer: HTMLElement;
 protected basketTotal: HTMLElement;
 protected wrapper: HTMLElement;
 protected basket: HTMLElement;

// Конструктор принимает родительский контейнер и обработчик событий
 constructor(container: HTMLElement, protected events: IEvents);

 // каталог товаров на главной странице
 set gallery(items: HTMLElement[]): void;

 // количество товаров в корзине
 set basketCounter(value: number): void;

 // установка, снятие блокировки страницы
 set locked(value: boolean): void;
}

// Класс, описывающий карточку товара
export class Card extends Component<IProductItem> {

  // Внутренние элементы карточки
 protected cardImage: HTMLImageElement;
 protected cardCategory: HTMLElement;
 protected cardTitle: HTMLElement;
 protected cardText?: HTMLElement;
 protected cardPrice: HTMLElement;
 protected cardButton: HTMLButtonElement;
 protected cardId: string;

// Конструктор принимает родительский контейнер и объект с колбэк функциями
 constructor(container: HTMLElement, actions?: ICardActions);

 // Изображение товара
 set image(value: string): void;

 // Категория товара
 set category(value: ICardCategory): void;

 // Название товара
 set title(value: string): void;

 // Описание товара
 set text(value: string): void;

 // Цена товара
 set price(value: number | null): void;

 // ID товара
 set id(value: string): void;

 get id(): string;

 get title(): string;

 render(data: Partial<IProductItem>): HTMLElement;

 set active(value: boolean): void;

 // Сеттер для флага - уже выбирали товар или нет (выбранный товар нельзя добавить в корзину повторно)
 set selected(value: boolean): void;
}

// Класс, описывающий элемент корзины
class BasketItem extends Component<IBasket> {

  // Внутренние элементы карточки, находящейся в корзине
 protected cardTitle: HTMLElement;
 protected cardPrice: HTMLElement;
 protected cardButton: HTMLButtonElement;
 protected cardId: string;
 protected basketItemIndex: HTMLElement;

// Конструктор принимает родительский контейнер и объект с колбэк функциями
 constructor(container: HTMLElement, actions?: ICardActions);

 // Название товара
 set title(value: string): void;

 // Цена товара
 set price(value: number): void;

 // ID товара
 set id(value: string): void;

 // Порядковый номер товара в корзине
 set indexBasket(value: number): void;
}

// Класс, описывающий корзину
export class Basket extends Component<IBasket> {

  // Внутренние элементы корзины
 protected basketPrice: HTMLElement;
 protected basketList: HTMLElement;
 protected basketButton: HTMLButtonElement;

// Конструктор принимает родительский контейнер и объект с колбэк функциями
 constructor(container: HTMLElement, actions?: ICardActions);

 // Метод перенумерации элементов корзины при изменении списка товаров
 updateBasketIndex(): void;

 // Список товаров
 set listBasket(items: HTMLElement[]): void;

 // Общая стоимость товаров в корзине
 set totalBasketPrice(value: number): void;

 // Метод, отключающий кнопку "Оформить"
 disableButton(): void;
}

// Класс, описывающий форму заказа
class Order extends Form<IOrderForm> {

// Внутренние элементы формы заказа
 protected _buttonCard: HTMLButtonElement;
 protected _buttonCash: HTMLButtonElement;
 protected _formErrors: FormErrors = {};

// Конструктор принимает родительский контейнер, обработчик событий и объект с колбэк функциями
 constructor(
  container: HTMLFormElement,
  events: IEvents,
  actions?: ICardActions
 );

 // выбор способа оплаты
 set paymentMethod(payment: string): void;

 // отменить выбранный способ оплаты
 clearPayment(): void;

 // адрес покупателя
 set address(value: string): void;

 // электронная почта покупателя
 set email(value: string): void;

 // телефон покупателя
 set phone(value: string): void;
}

// Класс, описывающий финальную страницу заказа
class Success extends Component<ISuccess> {

  // Внутренние элементы финальной страницы
 protected _close: HTMLElement;
 protected _description: HTMLElement;

// Конструктор принимает родительский контейнер и объект с колбэк функциями
 constructor(container: HTMLElement, actions?: ISuccessActions);

// Сообщение об успешном оформлении заказа
 set description(value: number): void;
}

// Класс для работы с сервером
class ProductApi extends Api {

  // Внутренний URL для Api
 readonly cdn: string;

// Конструктор принимает внутренний, базовый URL и опции
 constructor(cdn: string, baseUrl: string, options?: RequestInit) {
  super(baseUrl, options);
  this.cdn = cdn;
 }

 // получение данных о товарах с сервера
 getProductList(): Promise<IProductItem[]>;

 // получение данных о товаре по индексу
 getProductItem(id: string): Promise<IProductItem>;

 // добавление данных о заказе на сервер
 postProductOrder(order: IOrder): Promise<IOrderResult>;
}

```

## Источник

Был использован набор инструментов и знаний 🔥, предоставленных ![**YANDEX-PRAKTIKUM**](https://user-images.githubusercontent.com/99074177/235997371-83c300d3-a976-47f7-b927-3b1381963c3a.png)

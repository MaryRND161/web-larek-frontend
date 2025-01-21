// Доступные категории карточек
export type ICardCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Типизация настроек, чтобы не забыть,
// какие настройки есть и какие значения они могут принимать.
export interface ISettings {
	modalTemplate: string;
	modalSettings: {
		close: string;
		content: string;
		activeClass: string;
	};
}

// Какие изменения состояния приложения могут происходить
export enum AppStateChanges {
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
export interface AppStateSettings {
	formatCurrency: (value: number) => string;
	storageKey: string;
	// функция, которая будет вызываться при изменении состояния
	onChange: (changed: AppStateChanges) => void;
}

// Модель данных приложения
// Интерфейс, описывающий товар (загружаемые с сервера данные)
export interface IProductItem {
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
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Интерфейс, описывающий главную страницу
export interface IPage {
	cardContainer: HTMLElement[];
	basketTotal: number;
	locked: boolean;
}

// Интерфейс, описывающий элемент корзины
export type IBasketItem = Pick<
	IProductItem,
	'id' | 'title' | 'price' | 'selected'
>;

// Интерфейс, описывающий корзину
export interface IBasket extends IBasketItem {
	// общая стоимость товаров в корзине
	totalBasketPrice: number | null;
	// список элементов корзины
	listBasket: HTMLElement[];
	// порядковый номер элемента корзины
	indexBasket: number | null;
}

// Интерфейс, описывающий поля формы заказа
export interface IOrderForm {
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
export interface IOrder extends IOrderForm {
	// массив индексов купленных товаров
	items: string[];
	//сумма заказа
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ISuccess {
	description: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

// Тип, описывающий ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

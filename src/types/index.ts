import { Product } from '../components/AppData';

/*
    Тип описывающий все возможные категории товара
*/
export type CategoryType =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type CategoryMapping = {
	[Key in CategoryType]: string;
};

/*
    Тип, описывающий ошибки валидации форм
*/
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface ApiResponse {
	items: IProduct[];
}

/*
 * Интерфейс, описывающий карточку товара
 * */
export interface IProduct {
	// уникальный ID
	id: string;

  	// название
	title: string;

	// категория товара
	category: CategoryType;

	// ссылка на изображение
	image: string;

	// цена твара
	price: number | null;

	// описание товара
	description: string;

	// флаг - был данный товар добавлен в корзину или нет
	selected: boolean;
}

/*
  * Интерфейс, описывающий внутренне состояние приложении:
    -  используется для хранения карточек, корзины, заказа пользователя, ошибок
       при валидации форм;
    - имеет методы для работы с карточками и корзиной
  * */
export interface IAppState {
	// Корзина с товарами
	basket: Product[];
	// Массив карточек товара
	catalog: Product[];
	// Информация о заказе при покупке товара
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
export interface IOrder {
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

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

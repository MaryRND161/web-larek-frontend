import {
	IProductItem,
	IOrder,
	IOrderForm,
	FormErrors,
	AppStateChanges,
	AppStateSettings,
} from '../types';
import { Model } from './base/model';
import _ from 'lodash';

export type CatalogChangeEvent = {
	catalog: ProductModel[];
};

export class ProductModel extends Model<IProductItem> {
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
	makeId() {
		return this.idCounter++;
	}
	// помещает товары в каталог
	setItems(items: IProductItem[]) {
		this.items = items;
		this.emitChanges(AppStateChanges.items, { items: this.items });
	}

	// получает массив всех товаров
	getItems(): IProductItem[] {
		return this.items;
	}

	// получает товар по индексу
	getItem(id: string): IProductItem {
		return this.items.find((item) => item.id === id);
	}

	// отмечает товар, выбранный для помещения в корзину
	selectedItem(id: string) {
		const item = this.getItem(id);
		item.selected = !item.selected;
		this.events.emit(AppStateChanges.items);
	}

	// добавляет выбранный товар в корзину
	addItemToCart(item: IProductItem) {
		this.basket.push(item);
		this.selectedItem(item.id);
		this.idCounter = this.makeId();
		this.events.emit(AppStateChanges.items);
	}

	// удаляет выбранный товар из корзины по индексу
	deleteItemFromCart(id: string) {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.events.emit(AppStateChanges.items);
	}

	// возвращает число - количество элементов в корзине
	getTotalNumberCart() {
		return this.basket.length;
	}

	// возвращает число - общую стоимость товаров в корзине
	getTotalAmountCart(): number {
		return this.basket.reduce((sum, next) => sum + next.price, 0);
	}

	// переключает флаг(isIncluded) наличия товара в заказе
	availabilityInOrder(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}
	// удаляет все товары из корзины
	clearCart() {
		this.order.items.forEach((id) => {
			this.availabilityInOrder(id, false);
		});
		this.resetSelectedAll();
		this.basket.length = 0;
		this.events.emit(AppStateChanges.items);
	}

	// проверяет, что товар находится в корзине
	isProductInBasket(item: IProductItem): boolean {
		return item.selected;
	}

	// возвращает информацию о выбранном способе оплаты
	getPaymentMethod(): string {
		return this.order.payment;
	}

	// заполняет поля формы заказа
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit(AppStateChanges.formInput, this.order);
		}
	}

	// удаляет признак выбранного для корзины товара со всех товаров каталога
	resetSelectedAll() {
		this.items.forEach((item) => (item.selected = false));
		this.events.emit(AppStateChanges.items);
	}

	// добавляет в заказ товары из корзины
	setGoods() {
		this.order.items = this.basket.map((item) => item.id);
	}

	// проверяет на наличие данных в полях формы заказа (все поля должны быть заполнены)
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit(AppStateChanges.formErrors, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// удаляет данные о товарах из заказа
	clearOrder() {
		this.order = {
			items: [],
			total: null,
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}
}

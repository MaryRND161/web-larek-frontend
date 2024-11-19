import { Page } from './components/Page';
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { CatalogItem, CatalogItemView } from './components/Card';
import { AppState, Product } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ApiResponse, IOrderForm, IProduct } from './types';
import { API_URL } from './utils/constants';
import './scss/styles.scss';
import { Basket, CatalogItemBasket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const api = new Api(API_URL);
const events = new EventEmitter();

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.close();
	},
});

// Получение списка товаров с сервера
api
	.get('/product')
	.then((res: ApiResponse) => {
		appData.setStore(res.items as IProduct[]);
	})
	.catch((err) => {
		console.error(err);
	});

// Изменение элементов каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const product = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открытие карточки с детальной информацией о товаре
events.on('card:select', (item: Product) => {
	page.locked = true;
	const product = new CatalogItemView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toBasket', item);
		},
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			selected: item.selected,
		}),
	});
});

// Добавление товара в корзину
events.on('card:toBasket', (item: Product) => {
	item.selected = true;
	appData.addToBasket(item);
	page.counter = appData.getBasketAmount();
	modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
	page.locked = true;
	const basketItems = appData.basket.map((item, index) => {
		const catalogItem = new CatalogItemBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:delete', item),
			}
		);
		return catalogItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			list: basketItems,
			price: appData.getTotalBasketPrice(),
		}),
	});
});

// Удаление товара из корзины
events.on('basket:delete', (item: Product) => {
	appData.deleteFromBasket(item.id);
	item.selected = false;
	basket.price = appData.getTotalBasketPrice();
	page.counter = appData.getBasketAmount();
	basket.refreshIndices();
	if (!appData.basket.length) {
		basket.disableButton();
	}
});

// Оформление заказа
events.on('basket:order', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменение состояния валидации формы заказа (1-й шаг оформления товара: выбор способа оплаты и ввод адреса доставки)
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменение состояния валидации формы заказа (2-й шаг оформления товара: ввод почты и телефона покупателя)
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменение введенных данных заказа
events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Заполнение информации заказа (1-й шаг оформления товара: выбор способа оплаты и ввод адреса доставки), переход ко 2-му шагу
events.on('order:submit', () => {
	appData.order.total = appData.getTotalBasketPrice();
	appData.setItems();
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// Заполнение информации заказа (2-й шаг оформления товара: ввод почты и телефона покупателя), отправка заказа на сервер
events.on('contacts:submit', () => {
	api
		.post('/order', appData.order)
		.then((res) => {
			events.emit('order:success', res);
			appData.clearBasket();
			appData.refreshOrder();
			order.disableButtons();
			page.counter = 0;
			appData.resetSelected();
		})
		.catch((err) => {
			console.log(err);
		});
});

// Сообщение об успешной оплате
events.on('order:success', (res: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			description: res.total,
		}),
	});
});

// Закрытие модального окна
events.on('modal:close', () => {
	page.locked = false;
	appData.refreshOrder();
});

import './scss/styles.scss';
import { ProductModel, CatalogChangeEvent } from './components/ProductModel';
import { SETTINGS } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ProductApi } from './components/ProductApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Card } from './components/Card';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { AppStateChanges, IOrderForm } from './types';
import { Basket, BasketItem } from './components/Basket';
import { Success } from './components/Success';

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter(); // Создаем экземпляр класса слушателя событий

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Получение списка товаров с сервера
const api = new ProductApi(CDN_URL, API_URL);
api
	.getProductList()
	.then((data) => {
		productModel.setItems(data);
		console.log(productModel);
	})
	.catch((err) => console.log(err));

// Модель данных приложения
const productModel = new ProductModel({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	events,
	{ ...SETTINGS.modalSettings }
);
const modalActive = new Modal(
	ensureElement<HTMLElement>('.modal_active'),
	events,
	{ ...SETTINGS.modalSettings }
);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), {
	onClick: () => events.emit(AppStateChanges.orderMaking, events),
});
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>(AppStateChanges.items, () => {
	page.gallery = productModel.items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(AppStateChanges.selectedCard, item),
		});

		return card.render({
			image: item.image,
			category: item.category,
			title: item.title,
			price: item.price,
			selected: item.selected,
		});
	});
	modalActive.isActive = false;
	page.basketCounter = productModel.getTotalNumberCart();
});

// Открыли модалку карточки
events.on(AppStateChanges.selectedCard, (item: Card) => {
	// Отображаем результат
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit(AppStateChanges.basketAdd, item),
	});
	modal.render({
		content: card.render({
			image: item.image,
			category: item.category,
			title: item.title,
			description: item.text,
			price: item.price,
			selected: item.price ? item.selected : true,
		}),
		isActive: true,
	});
});

// Добавление товара в корзину
events.on(AppStateChanges.basketAdd, (item: Card) => {
	productModel.addItemToCart(item);
	page.basketCounter = productModel.getTotalNumberCart();
	modal.close();
});

// Открытие корзины
events.on(AppStateChanges.basketView, () => {
	const basketCatalog = productModel.basket.map((item, index) => {
		const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit(AppStateChanges.basketDel, item),
		});

		return basketItem.render({
			title: item.title,
			price: item.price,
			indexBasket: index + 1,
		});
	});

	modal.render({
		content: basket.render({
			listBasket: basketCatalog,
			totalBasketPrice: productModel.getTotalAmountCart(),
		}),
		isActive: true,
	});
});

// Удаление товара из корзины
events.on(AppStateChanges.basketDel, (item: Card) => {
	productModel.deleteItemFromCart(item.id);
	item.selected = false;
	basket.totalBasketPrice = productModel.getTotalAmountCart();
	page.basketCounter = productModel.getTotalNumberCart();
	basket.updateBasketIndex();
	if (!productModel.basket.length) {
		basket.disableButton();
	}
});

// Открытие формы заказа
events.on(AppStateChanges.orderMaking, () => {
	events.emit(AppStateChanges.formInput);
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
		isActive: true,
	});
	events.emit(AppStateChanges.formInput);
});

// Изменилось состояние валидации формы
events.on(AppStateChanges.formErrors, (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;

	order.valid = !payment && !address;

	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей формы заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		productModel.setOrderField(data.field, data.value);
	}
);

// Изменилось одно из полей формы с контактными данными
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		productModel.setOrderField(data.field, data.value);
	}
);

// Открытие формы с контактными данными
events.on(AppStateChanges.orderReady, () => {
	productModel.order.total = productModel.getTotalAmountCart();
	productModel.setGoods();

	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
		isActive: true,
	});
});

// Заполнение формы с контактными данными
events.on(AppStateChanges.contactsReady, () => {
	api
		.postProductOrder(productModel.order)
		.then((result) => {
			productModel.clearOrder();
			productModel.clearCart();
			order.clearPayment();
			modal.render({
				content: success.render({
					description: result.total,
				}),
				isActive: true,
			});
		})
		.catch((err) => console.log(err));
});

// Блокировка прокрутки страницы, когда модальное окно открыто
events.on('modal:open', () => {
	page.locked = true;
});

// Снятие блокировки с прокрутки страницы, когда модальное окно закрыто
events.on('modal:close', () => {
	page.locked = false;
});

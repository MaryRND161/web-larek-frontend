import { IBasket, ICardActions } from '../types';
import { ensureElement, formatPrice } from '../utils/utils';
import { Component } from './base/component';

export class BasketItem extends Component<IBasket> {
	protected cardTitle: HTMLElement;
	protected cardPrice: HTMLElement;
	protected cardButton: HTMLButtonElement;
	protected cardId: string;
	protected basketItemIndex: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		// Используемые элементы у карточки товара в корзине
		this.cardTitle = ensureElement('.card__title', this.container);
		this.cardPrice = ensureElement('.card__price', this.container);
		this.cardButton = ensureElement(
			'.basket__item-delete',
			this.container
		) as HTMLButtonElement;
		this.basketItemIndex = this.container.querySelector('.basket__item-index');

		// Прослушиваем событие: нажали на кнопку в карточке товара "Удалить товар из корзины"
		if (this.cardButton) {
			this.cardButton.addEventListener('click', (event: MouseEvent) => {
				this.container.remove();
				actions?.onClick(event);
			});
		}
	}

	// Название товара
	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	// Цена товара
	set price(value: number) {
		this.setText(this.cardPrice, formatPrice(value));
	}

	// ID товара
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Порядковый номер товара в корзине
	set indexBasket(value: number) {
		this.setText(this.basketItemIndex, (value++).toString());
	}
}

export class Basket extends Component<IBasket> {
	protected basketPrice: HTMLElement;
	protected basketList: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		// Используемые элементы у объекта, содержащего массив карточек с товарами, в корзине
		this.basketPrice = ensureElement('.basket__price', this.container);
		this.basketButton = ensureElement(
			'.button',
			this.container
		) as HTMLButtonElement;
		this.basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);

		// Прослушиваем событие: нажали на кнопку в корзине "Оформить заказ"
		this.basketButton.addEventListener('click', (event: MouseEvent) => {
			actions.onClick?.(event);
		});

		// Инициализация массива с карточками товаров в корзине
		this.listBasket = [];
	}

	// Метод перенумерации элементов корзины при изменении списка товаров
	updateBasketIndex() {
		Array.from(this.basketList.children).forEach(
			(item, index) =>
				(item.querySelector(`.basket__item-index`)!.textContent = (
					index + 1
				).toString())
		);
	}

	// Список товаров
	set listBasket(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
			this.setDisabled(this.basketButton, false);
		} else {
			this.basketList.replaceChildren('');
			this.setDisabled(this.basketButton, true);
		}
	}

	// Общая стоимость товаров в корзине
	set totalBasketPrice(value: number) {
		this.setText(this.basketPrice, formatPrice(value));
	}

	// Метод, отключающий кнопку "Оформить"
	disableButton() {
		this.setDisabled(this.basketButton, true);
	}
}

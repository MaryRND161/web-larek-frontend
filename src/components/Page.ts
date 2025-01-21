import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IPage } from '../types';

export class Page extends Component<IPage> {
	protected cardContainer: HTMLElement;
	protected basketTotal: HTMLElement;
	protected wrapper: HTMLElement;
	protected basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.cardContainer = ensureElement('.gallery', this.container);
		this.basketTotal = ensureElement('.header__basket-counter', this.container);
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this.basket = ensureElement<HTMLElement>('.header__basket');

		this.basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// каталог товаров на главной странице
	set gallery(items: HTMLElement[]) {
		this.cardContainer.replaceChildren(...items);
	}

	// количество товаров в корзине
	set basketCounter(value: number) {
		this.setText(this.basketTotal, value);
	}

	// установка, снятие блокировки страницы
	set locked(value: boolean) {
		if (value) {
			this.wrapper.classList.add('page__wrapper_locked');
		} else {
			this.wrapper.classList.remove('page__wrapper_locked');
		}
	}
}

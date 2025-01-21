import { IProductItem, ICardActions } from '../types';
import { ensureElement, formatPrice } from '../utils/utils';
import { Component } from './base/component';
import { ICardCategory } from './../types';
import { CATEGORY_CARD } from './../utils/constants';

export class Card extends Component<IProductItem> {
	protected cardImage: HTMLImageElement;
	protected cardCategory: HTMLElement;
	protected cardTitle: HTMLElement;
	protected cardText?: HTMLElement;
	protected cardPrice: HTMLElement;
	protected cardButton: HTMLButtonElement;
	protected cardId: string;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this.cardImage = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;
		this.cardCategory = ensureElement('.card__category', this.container);
		this.cardTitle = ensureElement('.card__title', this.container);
		this.cardText = this.container.querySelector('.card__text');
		this.cardPrice = ensureElement('.card__price', this.container);
		this.cardButton = this.container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this.cardButton) {
				this.cardButton.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Изображение товара
	set image(value: string) {
		this.setImage(this.cardImage, value, this.title);
	}

	// Категория товара
	set category(value: ICardCategory) {
		this.setText(this.cardCategory, value);
		this.cardCategory.className = '';
		const specifiedClass = 'card__category';
		const optionallyClass = CATEGORY_CARD[value];
		this.cardCategory.classList.add(
			specifiedClass,
			`${specifiedClass}_${optionallyClass}`
		);
	}

	// Название товара
	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	// Описание товара
	set text(value: string) {
		this.setText(this.cardText, value);
	}

	// Цена товара
	set price(value: number | null) {
		this.setText(this.cardPrice, value ? formatPrice(value) : 'Бесценно');
	}

	// ID товара
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	get title(): string {
		return this.cardTitle.textContent || '';
	}

	render(data: Partial<IProductItem>): HTMLElement {
		Object.assign(this as object, data);
		return this.container;
	}

	set active(value: boolean) {
		this.toggleClass(this.container, 'modal_active', value);
	}

	// Сеттер для флага - уже выбирали товар или нет (выбранный товар нельзя добавить в корзину повторно)
	set selected(value: boolean) {
		this.setDisabled(this.cardButton, value ? true : false);
	}
}

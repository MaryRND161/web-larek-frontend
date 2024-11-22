import { IProduct } from '../../types';
import { ensureElement, createElement, cloneTemplate, handlePrice, formatSinaps } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents, EventEmitter } from '../base/events';

/*
 * Интерфейс, описывающий корзину товаров
 * */
export interface IBasketView {
	// Массив элементов li с товаром
	list: HTMLElement[];

	// Общая стоимость товаров
	price: number;
  selected: string[];
}

/*
 * Класс, описывающий корзину товаров
 * */
export class Basket extends Component<IBasketView> {
	// Ссылки на внутренние элементы
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;

	// Конструктор принимает имя блока, родительский элемент и обработчик событий
	constructor(
		//protected blockName: string,
		container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

    this._list = ensureElement<HTMLElement>('.basket__list',this.container);
    this._price = ensureElement<HTMLElement>('.basket__price',this.container);
		this._button = ensureElement<HTMLElement>('.basket__button',this.container);



		if (this._button) {
			this._button.addEventListener('click', () =>
				events.emit('basket:order')
			);
		}
    	// Инициализируем контейнер корзины
    this.list=[];
	}

	// Сеттер для списка товаров
	set list(items: HTMLElement[]) {
if (items.length) {
	this._list.replaceChildren(...items);
}else{
  this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {textContent:'Корзина пуста'}));
}

this.selected;

//this._button.disabled = items.length ? false : true;
	}



	// Метод, отключающий кнопку "Оформить"
  set selected(items: string[]) {
    if (items.length) {
        this.setDisabled(this._button, false);
    } else {
        this.setDisabled(this._button, true);
    }
}


	// Сеттер для общей стоимости
	set price(price: number) {
		this.setText(this._price, formatSinaps(price));
	}

	// Метод для обновления индексов таблички при удалении товара из корзины
	refreshIndices() {
		Array.from(this._list.children).forEach(
			(item, index) =>
				(item.querySelector(`.basket__item-index`)!.textContent = (
					index + 1
				).toString())
		);
	}
}


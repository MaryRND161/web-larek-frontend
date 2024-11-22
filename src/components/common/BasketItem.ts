import { IProduct } from '../../types';
import { ensureElement, createElement, cloneTemplate, handlePrice, formatSinaps } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents, EventEmitter } from '../base/events';

export interface IProductBasket extends IProduct {
	id: string;
	index: number;
}


interface ICatalogItemBasketActions {
	onClick: () => void;
}


export class CatalogItemBasket extends Component<IProductBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;

	constructor(
		//protected blockName: string,
		container: HTMLElement,
		actions?: ICatalogItemBasketActions
    //protected events: EventEmitter
	) {
		super(container);

    this._index = ensureElement<HTMLElement>('.basket__item-index',this.container);
    this._title = ensureElement<HTMLElement>('.card__title',this.container);
		this._price = ensureElement<HTMLElement>('.card__price',this.container);
		this._button = ensureElement<HTMLElement>('.basket__item-delete',this.container);


		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
        //events.onClick;
				actions?.onClick;
			});
		}
	}


	set index(value: number) {
		this._index.textContent = value.toString();
	}

	set title(value: string) {
		this._title.textContent = value;
	}


	set price(value: number) {
    this.setText(this._price, formatSinaps(value));
	}
}

import { ISuccess, ISuccessActions } from '../types';
import { ensureElement, formatPrice } from '../utils/utils';
import { Component } from './base/component';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			if (this._close) {
				this._close.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: number) {
		this.setText(this._description, `Списано ${formatPrice(value)}`);
	}
}

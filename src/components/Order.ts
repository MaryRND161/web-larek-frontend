import { Form } from './common/Form';
import { IOrderForm, ICardActions, FormErrors } from '../types';
import { IEvents } from './base/events';

export class Order extends Form<IOrderForm> {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;
	protected _formErrors: FormErrors = {};

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(container, events);

		this._buttonCard = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._buttonCash = container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		// прослушиваем событие: нажали на одну из кнопок выбора способа оплаты

		if (this._buttonCard) {
			this._buttonCard.addEventListener('click', (event: MouseEvent) => {
				this.paymentMethod = 'card';
				actions?.onClick(event);
			});
		}

		if (this._buttonCash) {
			this._buttonCash.addEventListener('click', (event: MouseEvent) => {
				this.paymentMethod = 'cash';
			});
		}
	}

	// выбор способа оплаты
	set paymentMethod(payment: string) {
		this.onInputChange('payment', payment);
		this.toggleClass(this._buttonCard, 'button_alt-active', payment === 'card');
		this.toggleClass(this._buttonCash, 'button_alt-active', payment === 'cash');
	}

	// отменить выбранный способ оплаты
	clearPayment() {
		this.onInputChange('payment', '');
		this._buttonCard.classList.remove('button_alt-active');
		this._buttonCash.classList.remove('button_alt-active');
	}

	// адрес покупателя
	set address(value: string) {
		this.onInputChange('address', value);
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	// электронная почта покупателя
	set email(value: string) {
		this.onInputChange('email', value);

		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	// телефон покупателя
	set phone(value: string) {
		this.onInputChange('phone', value);
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}

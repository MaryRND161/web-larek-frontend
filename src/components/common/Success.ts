import { ensureElement, formatSinaps} from '../../utils/utils';
import { Component } from '../base/Component';

export interface ISuccess {
	description: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(
		container: HTMLElement,
		actions?: ISuccessActions
	) {
		super(container);

		this._close =  ensureElement<HTMLElement>('.order-success__close', this.container);
		this._description = ensureElement<HTMLElement>('.order-success__description', this.container);

		if (actions?.onClick) {
			if (this._close) {
				this._close.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: number) {
      this.setText(this._description, `Списано ${formatSinaps(value)}`);
	}


}
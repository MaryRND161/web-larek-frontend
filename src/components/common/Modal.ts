import { Component } from '../base/component';
import { ensureElement, isSelector } from '../../utils/utils';
import { IEvents } from '../base/events';

type SelectorElement<T> = T | string;

export interface IModalData {
	content: HTMLElement;
	message?: string;
	isActive: boolean;
	isError?: boolean;
}

export interface IModalSettings {
	close: string;
	content: string;
	activeClass: string;
	onOpen?: () => void;
	onClose?: () => void;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _activeClass?: string;
	// модальное окно, которое сейчас открыто, оно всегда одно
	protected static _openedModal: Modal | null;
	// введем кеш чтобы не пересоздавать и не искать повторно элементы
	protected cache: Record<string, HTMLElement> = {};

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		protected settings: IModalSettings
	) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// закрываем модальное кликом по кнопке Закрыть
		this._closeButton.addEventListener('click', this.close.bind(this));
		// клик по оверлею тоже закрывает модальное окно
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	protected init() {
		// слушаем клик по иконке закрыть
		this.ensure(this.settings.close).addEventListener(
			'click',
			this.onCloseHandler.bind(this)
		);
		// клик по оверлею тоже закрывает модальное окно
		this.container.addEventListener('click', this.onCloseHandler.bind(this));
	}

	// Обернем метод проверки элемента из утилит в кеш, чтобы повторно не искать по DOM
	protected ensure<T extends HTMLElement>(
		query?: SelectorElement<T>,
		root: HTMLElement = this.container
	): T {
		if (!isSelector(query)) {
			return ensureElement(query);
		} else {
			if (!this.cache[query]) {
				this.cache[query] = ensureElement(query, root);
			}
			return this.cache[query] as T;
		}
	}
	// замена элемента на другой или его обновлённую версию
	// с проверкой существования обоих
	protected setElement<T extends HTMLElement>(
		query: SelectorElement<T>,
		value: HTMLElement
	) {
		const el = this.ensure(query);
		el.replaceWith(value);
	}

	protected onCloseHandler(event?: MouseEvent) {
		if (
			event &&
			// при повторном вызове ensure возвращает элемент из кеша
			![this.ensure(this.settings.close), this.container].includes(
				event.target as HTMLElement
			)
		)
			return;
		this.container.remove();
		this.container.classList.remove(this.settings.activeClass);
		if (event) {
			this.settings.onClose?.();
		}
		if (Modal._openedModal === this) {
			// если закрывается текущее модальное окно, то обнуляем статическое поле
			Modal._openedModal = null;
		}
	}

	protected onOpenHandler() {
		if (Modal._openedModal) {
			Modal._openedModal.isActive = false;
		}
		Modal._openedModal = this;
		this.container.classList.add(this.settings.activeClass);
		document.body.append(this.container);
		this.settings.onOpen?.();
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}

	set isActive(state: boolean) {
		if (state) {
			this.container.classList.add(this.settings.activeClass);
			this.onOpenHandler();
		} else {
			this.container.classList.remove(this.settings.activeClass);
			this.onCloseHandler();
		}
	}
}

import { IEvents } from '../base/events';
import { Form } from './Form';

/*
 * Интерфейс, описывающий 2-й шаг оформления товара: ввод почты и телефона покупателя
 * */
export interface IContacts {
	// Телефон
	phone: string;

	// Электронная почта
	email: string;
}

/*
 * Класс, описывающий 2-й шаг оформления товара: ввод почты и телефона покупателя
 * */
export class Contacts extends Form<IContacts> {
	// Конструктор принимает родительский элемент и обработчик событий
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
}

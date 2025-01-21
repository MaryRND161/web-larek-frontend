import { ICardCategory, ISettings } from '../types';
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const SETTINGS: ISettings = {
	modalTemplate: '#modal',
	modalSettings: {
		close: '.modal__close',
		content: '.modal__content',
		activeClass: '.modal_active',
	},
};

export const CATEGORY_CARD: Record<ICardCategory, string> = {
	'софт-скил': 'soft',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
	'хард-скил': 'hard',
};

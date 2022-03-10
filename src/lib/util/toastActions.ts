import { toast } from '@zerodevx/svelte-toast';

const toastTheme = {
	'--toastBorderRadius': '4px',
	'--toastColor': 'var(--nord-6)',
	'--toastBarBackground': 'var(--nord-4)'
};

export const toastError = (message: string) => {
	toast.push(message, {
		theme: {
			'--toastBackground': 'var(--nord-11)',
			...toastTheme
		}
	});
};

export const toastSuccess = (message: string) => {
	toast.push(message, {
		theme: {
			'--toastBackground': 'var(--nord-14)',
			...toastTheme
		}
	});
};

export const toastClear = () => {
	toast.pop(0);
}

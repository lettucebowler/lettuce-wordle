import { toast } from '@zerodevx/svelte-toast';

const toastTheme = {
	'--toastBorderRadius': '4px',
	'--toastColor': 'var(--nord-6)',
	'--toastBarBackground': 'var(--nord-4)'
};

const toastError = (message: string) => {
	toast.push(message, {
		theme: {
			'--toastBackground': 'var(--nord-11)',
			...toastTheme
		}
	});
};

const toastSuccess = (message: string) => {
	toast.push(message, {
		theme: {
			'--toastBackground': 'var(--nord-14)',
			...toastTheme
		}
	});
};

export { toastError, toastSuccess };

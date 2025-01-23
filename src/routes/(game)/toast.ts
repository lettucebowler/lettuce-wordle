import toast from 'svelte-french-toast';

const baseToastStyles =
	'border-radius: 0.5rem; color: var(--color-snow-300); background: var(--color-charade-800); padding: 1rem 1.5rem; font-size: 18px;';

export function toastError(message: string, opts?: { id: string | undefined }) {
	toast.error(message, {
		style: baseToastStyles,
		id: opts ? opts.id : undefined,
		iconTheme: {
			primary: 'var(--color-contessa-500)',
			secondary: 'var(--color-snow-300)'
		}
	});
}

export function toastSuccess(message: string, opts?: { id: string | undefined }) {
	toast.success(message, {
		style: baseToastStyles,
		id: opts ? opts.id : undefined,
		iconTheme: {
			primary: 'var(--color-swamp-green-500)',
			secondary: 'var(--color-snow-300)'
		}
	});
}

export function toastLoading(message: string, opts?: { id: string | undefined } | undefined) {
	return toast.loading(message, {
		style: baseToastStyles,
		id: opts ? opts.id : undefined,
		iconTheme: {
			primary: 'var(--snow-300)',
			secondary: 'var(--color-charade-300)'
		}
	});
}

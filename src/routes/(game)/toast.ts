import toast from 'svelte-french-toast';

const baseToastStyles = 'border-radius: 0.5rem; color: var(--snow-300); background: var(--charade-700); padding: 1rem 1.5rem; font-size: 18px;';

export function toastError(message: string, opts?: { id: string | undefined }) {
    const g = toast.error(message, {
        style: baseToastStyles,
        id: opts ? opts.id : undefined,
        iconTheme: {
            primary: 'var(--aurora-100)',
            secondary: 'var(--snow-300)'
        }
    });
}

export function toastSuccess(message: string, opts?: { id: string | undefined }) {
    toast.error(message, {
        style: baseToastStyles,
        id: opts ? opts.id : undefined,
        iconTheme: {
            primary: 'var(--aurora-400)',
            secondary: 'var(--snow-300)'
        }
    });
}

export function toastLoading(message: string, opts?: { id: string | undefined } | undefined) {
    return toast.loading(message, {
        style: baseToastStyles,
        id: opts ? opts.id : undefined,
        iconTheme: {
            primary: 'var(--snow-300)',
            secondary: 'var(--charade-300)'
        }
    });
}
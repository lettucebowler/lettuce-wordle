import type { ActionReturn } from 'svelte/action';

interface Attributes {
	'on:clickoutside'?: (e: CustomEvent<void>) => void;
}

type Callback = () => unknown;

export function clickOutsideAction(
	node: HTMLElement,
	callback?: Callback
): ActionReturn<void, Attributes> {
	const handleClick = (event: Event) => {
		if (event.target !== null && !node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('clickoutside'));
			callback?.();
		}
	};

	document.addEventListener('click', handleClick, true);
	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

type FocusAbleElement =
	| HTMLButtonElement
	| HTMLAnchorElement
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement;

export function trapFocus(node: HTMLElement) {
	const previous = document.activeElement;

	function focusable() {
		return Array.from(
			node.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const current = document.activeElement;

		const elements: FocusAbleElement[] = focusable() as FocusAbleElement[];
		const first = elements.at(0);
		const last = elements.at(-1);

		if (event.shiftKey && current === first && last) {
			last.focus();
			event.preventDefault();
		}

		if (!event.shiftKey && current === last && first) {
			first.focus();
			event.preventDefault();
		}
	}

	(focusable() as FocusAbleElement[])[0]?.focus();

	node.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			node.removeEventListener('keydown', handleKeydown);
			(previous as FocusAbleElement)?.focus();
		}
	};
}

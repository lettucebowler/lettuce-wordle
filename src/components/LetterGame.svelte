<script lang="ts">
    import { SvelteToast } from '@zerodevx/svelte-toast'
    import { toastError, toastSuccess } from '../util/toastActions';
    import LetterGrid from '../components/LetterGrid.svelte';
    import { getDailyWord, isValidWord } from '../util/words';


    export let answer = getDailyWord();
    
    let success = false;
    let attempt = 0;
    let words = [
        {
            complete: false,
            word: '',
        },       
        {
            complete: false,
            word: '',
        },
        {
            complete: false,
            word: '',
        },
        {
            complete: false,
            word: '',
        },
        {
            complete: false,
            word: '',
        },
        {
            complete: false,
            word: '',
        }
    ];

    const containsLetter = (letter: string, index: number, guess: string, answer: string) => {
        const guessLocations = guess.split('').map((l: string, i: number) => ({letter: l, index: i})).filter((slot) => slot.letter === letter).map((slot) => slot.index);
        const answerLocations = answer.split('').map((l: string, i: number) => ({letter: l, index: i})).filter((slot) => slot.letter === letter).map((slot) => slot.index).filter((index) => !guessLocations.includes(index));
        return !!answerLocations.length;
    }

    const getLetterStatus = (letter, i, word, answer, complete) => {
        const none = !complete || letter === '';
        const contains = containsLetter(letter, i, word, answer);
        const correct = answer.split('')[i] === letter;

        if (none) {
            return 'none';
        }

        if (correct) {
            return 'correct';
        }

        if (contains) {
            return 'contains';
        }

        return ('incorrect');
    }

    $: data = words.map((word, i) => {
        const statuses = word.word.padEnd(5).split('').map((l, i) => {
            return {letter: l, status: getLetterStatus(l, i, word.word, answer, word.complete)}
        });
        const win = statuses.filter((s) => {
            return s.status === 'correct'
        }).length === 5;
        if (win) {
            success = true;
        }
        return {
            complete: word.complete,
            word: statuses,
        }
    });

    $: attempt === 6 && !success && toastError('You lose.');

    $: success && toastSuccess('Yay you win!');

    const processEnterKey = () => {
        const guess = words[attempt].word;
        const valid = isValidWord(guess);
        const long = guess.length === 5;

        if (!long) {
            return toastError('Not enough letters.');
        } else if (!valid) {
            return toastError('Not in word list.');
        } else if (attempt > 5) {
            return toastError('No more attempts remaining.');
        }

        words[attempt].complete = true;
        attempt++;
    }

    const processBackspaceKey = () => {
        const complete = words.filter((word) => word.complete);
        if (complete.length >= 6) {
            return;
        }
        const incomplete = words.filter((word) => !word.complete);
        let [word, ...rest] = incomplete;
        if (word) {
            let w = word.word.split('');
            w.pop();
            word.word = w.join('');
        }
        words = complete.concat([word]).concat(rest);
    };

    const processLetterKey = (letter) => {
        const complete = words.filter((word) => word.complete);
        const incomplete = words.filter((word) => !word.complete);
        let [current, ...rest] = incomplete;
        if (!current) {
            return;
        }
        let {word} = current;
        if (word?.length < 5) {
            word = `${word}${letter}`;
        }
        current = {...current, word};
        words = complete.concat([current]).concat(rest);
    }

    const handleKeyPress = (event: { key: string }) => {
		const { key } = event;

        if (success) {
            return;
        }

        key === 'Enter' && processEnterKey();
        key === 'Backspace' && processBackspaceKey();
        key.match(/[a-z]/i) && key.length === 1 && processLetterKey(key);
	};

</script>

<svelte:window on:keydown={handleKeyPress} />
<div class="spacing" />
<LetterGrid data={data}/>
<SvelteToast />
{#if attempt > 5 && !success}
    <div class="answer">{answer}</div>
{/if}

<style>
    .spacing {
		padding: 16px 0 16px 0;
	}

    .answer {
        color: var(--nord-6);
        font-size: 2rem;
    }
</style>
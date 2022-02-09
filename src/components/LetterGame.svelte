<script lang="ts">
    import LetterGrid from '../components/LetterGrid.svelte';
    export let answer = 'guide';
    let success = false;
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

    const getLetterStatus = (letter, i, word, complete) => {
        const none = !complete || letter === '';
        const contains = word.split('').includes(letter);
        const correct = word.split('')[i] === letter;

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
            return {letter: l, status: getLetterStatus(l, i, answer, word.complete)}
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

    $: console.log(data);

    $: console.log(success);

    const handleKeyPress = (event: { key: string }) => {
		const { key } = event;

        if (success) {
            return;
        }

        if (key === 'Enter') {
            const complete = words.filter((word) => word.complete);
            const incomplete = words.filter((word) => !word.complete);
            const [word] = incomplete;
            if (word) {
                if (word.word.length === 5) {
                    word.complete = true;
                }
            }
            words = complete.concat(incomplete);
        } else if (key === 'Backspace') {
            const complete = words.filter((word) => word.complete);
            const incomplete = words.filter((word) => !word.complete);
            let [word, ...rest] = incomplete;
            if (word) {
                let w = word.word.split('');
                w.pop();
                word.word = w.join('');
            }
            words = complete.concat([word]).concat(rest);
        }

        else if (key.match(/[a-z]/i)) {
            const complete = words.filter((word) => word.complete);
            const incomplete = words.filter((word) => !word.complete);
            let [current, ...rest] = incomplete;
            if (!current) {
                return;
            }
            let {word} = current;
            if (word?.length < 5) {
                word = `${word}${key}`;
            }
            current = {...current, word};
            words = complete.concat([current]).concat(rest);
        }
        console.log(key);
	};

</script>

<svelte:window on:keydown={handleKeyPress} />
<div class="spacing" />
<LetterGrid data={data}/>

<style>
    .spacing {
		padding: 16px 0 16px 0;
	}
</style>
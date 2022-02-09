<script lang="typescript">
    import LetterGrid from '../components/LetterGrid.svelte';
    const answer = 'frame';
    const words = [
        {
            complete: false,
            word: 'frame',
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
        return {
            complete: word.complete,
            word: statuses,
        }
    });

    const handleKeyPress = (event: { key: string }) => {
		const actions = {
			0() {
				boardList = doMove(board, selectedRow, selectedCol, 0);
			},
			1() {
				boardList = doMove(board, selectedRow, selectedCol, 1);
			},
			2() {
				boardList = doMove(board, selectedRow, selectedCol, 2);
			},
			3() {
				boardList = doMove(board, selectedRow, selectedCol, 3);
			},
			4() {
				boardList = doMove(board, selectedRow, selectedCol, 4);
			},
			5() {
				boardList = doMove(board, selectedRow, selectedCol, 5);
			},
			6() {
				boardList = doMove(board, selectedRow, selectedCol, 6);
			},
			7() {
				boardList = doMove(board, selectedRow, selectedCol, 7);
			},
			8() {
				boardList = doMove(board, selectedRow, selectedCol, 8);
			},
			9() {
				boardList = doMove(board, selectedRow, selectedCol, 9);
			},
			ArrowUp() {
				moveSelection(-1, 0);
			},
			ArrowDown() {
				moveSelection(1, 0);
			},
			ArrowLeft() {
				moveSelection(0, -1);
			},
			ArrowRight() {
				moveSelection(0, 1);
			}
		};
		const { key } = event;
        console.log(key);
		actions[key] && actions[key]();
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
import { getRandomWord } from '../util/words';

export async function get({ params }) {
    const answer = getRandomWord();
    return {
        body: {answer},
    };
}
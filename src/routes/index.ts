import { getDailyWord } from '../util/words';

export async function get() {
    const answer = getDailyWord();
    return {
        body: { answer },
    };
}
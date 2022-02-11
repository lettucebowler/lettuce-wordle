import wordList from '../util/words';
import gen from 'random-seed';

const getDailyWord = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const seed = date.getTime();
    var random = gen(seed);
    const index = random(wordList.length);
    return wordList[index];
};

const getRandomWord = () => {
    var random = gen();
    const index = random(wordList.length);
    return wordList[index];
}

export { getDailyWord, getRandomWord };

export default getDailyWord;
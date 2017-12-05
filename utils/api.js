import { AsyncStorage } from 'react-native';
import { formatResults } from './helpers';
import { Notifications, Permissions } from 'expo';

const DECKS_STORAGE_KEY = 'UdaciCards:decks';

export function fetchAllDecks() {
	return AsyncStorage.getItem(DECKS_STORAGE_KEY)
		.then(formatResults)
}

export function submitNewQuestion(cardKey, question, answer) {
	AsyncStorage.getItem(DECKS_STORAGE_KEY, (err, result) => {
		const decks = JSON.parse(result);
		let cardChosen = decks[cardKey];
		cardChosen.questions.push({
			question: question,
			answer: answer
		});

		decks[cardKey] = cardChosen;

		AsyncStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks), () => {
			AsyncStorage.getItem(DECKS_STORAGE_KEY)
		})
	})
}

export function submitNewDeck(key, deck) {
	AsyncStorage.mergeItem(DECKS_STORAGE_KEY, JSON.stringify({[key]: deck}), () => {
		AsyncStorage.getItem(DECKS_STORAGE_KEY)
	})
}
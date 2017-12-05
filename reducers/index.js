import { RECEIVE_DECKS, ADD_DECK, ADD_QUESTION } from '../actions';

function decks(state = {}, action) {
	switch(action.type) {
		case RECEIVE_DECKS:
			return {
				...state,
				...action.decks
			};
		case ADD_DECK:
			return {
				...state,
				...action.deck
			};
		case ADD_QUESTION:
			const question = action.question;
			const cardTitle = question.cardTitle;
			const result = {
				...state,
				[cardTitle]: {
					...state[cardTitle],
					questions: [
						...state[cardTitle].questions,
						{
							question: question.question,
							answer: question.answer
						}
					]
				}
			}
			return result;
		default:
			return state;
	}
}

export default decks;
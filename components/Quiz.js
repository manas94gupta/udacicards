import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { white, black, green, red, grey, darkGrey } from '../utils/colors';
import { clearLocalNotification, setLocalNotification } from '../utils/helpers';

// Create a local `CorrectButton` component.
function CorrectBtn({ onPress }) {
  return (
    <TouchableOpacity
    	style={styles.correctBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>Correct</Text>
    </TouchableOpacity>
  );
}

// Create a local `IncorrectButton` component.
function IncorrectBtn({ onPress }) {
  return (
    <TouchableOpacity
    	style={styles.incorrectBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>Incorrect</Text>
    </TouchableOpacity>
  );
}

// Create a local `AddCardButton` component.
function BackToDeckBtn({ onPress }) {
  return (
    <TouchableOpacity
    	style={styles.backToDeckBtn}
      onPress={onPress}
    >
      <Text style={styles.backToDeckBtnText}>Back to Deck</Text>
    </TouchableOpacity>
  );
}

// Create a local `StartQuizButton` component.
function RestartQuizBtn({ onPress }) {
  return (
    <TouchableOpacity
    	style={styles.restartQuizBtn}
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>Restart Quiz</Text>
    </TouchableOpacity>
  );
}

function Card({ textDisplayed, linkToFlip, flipFunc }) {
	return (
		<View style={styles.card}>
			<Text style={styles.mainText}>
				{textDisplayed}
			</Text>
			<Text
				onPress={() => flipFunc()}
				style={styles.secondaryText}
			>
				{linkToFlip}
			</Text>
		</View>
	);
}

class Quiz extends Component {
	state = {
		currentQuestion: 0,
		numberOfQuestions: 0,
		correctAnswers: 0,
		incorrectAnswers: 0,
		front: true
	}

	componentDidMount() {
		const deckTitle = this.props.navigation.state.params.title;
		const questions = this.props.decks[deckTitle].questions;
		const numberOfQuestions = questions.length;
		this.setState({
			numberOfQuestions
		});
	}

	submitCorrect = (() => {
		const currentQuestion = this.state.currentQuestion;
		const numberOfQuestions = this.state.numberOfQuestions;
		// Check if this is the last answer to get.
		if (currentQuestion <= numberOfQuestions - 1) {
			this.setState((prevState) => ({
				correctAnswers : prevState.correctAnswers + 1
			}))
		}
		// Check if there are still questions to display.
		if (currentQuestion < numberOfQuestions - 1) {
			this.setState((prevState) => ({
				currentQuestion: prevState.currentQuestion + 1,
				// Display the front side in the next card.
				front: true
			}))
		}
	})

	submitIncorrect = (() => {
		const currentQuestion = this.state.currentQuestion;
		const numberOfQuestions = this.state.numberOfQuestions;
		if (currentQuestion <= numberOfQuestions - 1) {
			this.setState((prevState) => ({
				incorrectAnswers : prevState.incorrectAnswers + 1
			}))
		}
		// Check if there are still questions to display.
		if (currentQuestion < numberOfQuestions - 1) {
			this.setState((prevState) => ({
				currentQuestion: prevState.currentQuestion + 1,
				front: true
			}))
		}
	})

	flipCard = (() => {
		this.setState((prevState) => ({
			// Flip the card.
			front: !prevState.front
		}))
	})

	displayCard = ((question, answer, flipCard) => {
		const currentSide = this.state.front;
		const correctAnswers = this.state.correctAnswers;
		const incorrectAnswers = this.state.incorrectAnswers;
		const totalAnswers = correctAnswers + incorrectAnswers;
		const numberOfQuestions = this.state.numberOfQuestions;
		const deckTitle = this.props.navigation.state.params.title;
		let text;
		let link;
		// Check if all questions have been answered.
		if (totalAnswers === numberOfQuestions) {
			text = 'You answered correctly to ' + (correctAnswers * 100 / totalAnswers) + '% of the questions.';
			/*
			 * If the user has completed at least one quiz for the day,
			 * clear the push notification and set it for the next day.
			 */
			clearLocalNotification()
			 .then(setLocalNotification)
			return (
				<View>
					<Card
						textDisplayed={text}
					/>
					<BackToDeckBtn
						onPress={() => this.props.navigation.navigate(
							'DeckDetail',
							{
								title: deckTitle
							}
						)}
					/>
					<RestartQuizBtn
						onPress={() => this.props.navigation.navigate(
							'Quiz',
							{
								title: deckTitle
							}
						)}
					/>
				</View>
			);
		// Otherwise, display the normal card and check its visible side.
		} else {
			if (currentSide === true) {
				text = question;
				link = 'Answer';
			} else {
				text = answer;
				link = 'Question';
			}
		}

		return (
			<View>
				<Card
					textDisplayed={text}
					linkToFlip={link}
					flipFunc={flipCard}
				/>
				<View>
					<CorrectBtn
						onPress={this.submitCorrect}
					/>
					<IncorrectBtn
						onPress={this.submitIncorrect}
					/>
				</View>
			</View>

		);
	})

	render() {
		const deckTitle = this.props.navigation.state.params.title;
		const questions = this.props.decks[deckTitle].questions;
		const question = questions[this.state.currentQuestion].question;
		const answer = questions[this.state.currentQuestion].answer;
		const correctAnswers = this.state.correctAnswers;
		const incorrectAnswers = this.state.incorrectAnswers;
		const totalAnswers = correctAnswers + incorrectAnswers;
		const numberOfQuestions = this.state.numberOfQuestions;

		return (
			<View style={styles.container}>
				<Text style={styles.counter}>
					{
						totalAnswers + ' / ' + numberOfQuestions
					}
				</Text>
				{
					/*
					 * Display the card or visualize the score.
					 */
				}
				{ this.displayCard(question, answer, this.flipCard) }
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		backgroundColor: white
	},
	correctBtn: {
		backgroundColor: green,
		padding: 10,
		height: 45,
		marginLeft: 100,
		marginRight: 100,
		marginTop: 10,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center'
	},
	incorrectBtn: {
		backgroundColor: red,
		padding: 10,
		height: 45,
		marginLeft: 100,
		marginRight: 100,
		marginTop: 10,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center'
	},
	submitBtnText: {
		color: white,
		fontSize: 22,
		textAlign: 'center'
	},
	backToDeckBtn: {
		backgroundColor: white,
		padding: 10,
		height: 45,
		marginLeft: 100,
		marginRight: 100,
		marginTop: 10,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: grey,
		justifyContent: 'center',
		alignItems: 'center'
	},
	backToDeckBtnText: {
		color: black,
		fontSize: 22,
		textAlign: 'center'
	},
	restartQuizBtn: {
		backgroundColor: black,
		padding: 10,
		height: 45,
		marginLeft: 100,
		marginRight: 100,
		marginTop: 10,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center'
	},
	mainText: {
		color: darkGrey,
		fontSize: 34,
		textAlign: 'center'
	},
	secondaryText: {
		color: red,
		fontSize: 14,
		textAlign: 'center'
	},
	counter: {
		color: darkGrey,
		marginLeft: 10,
		marginTop: 10,
		fontSize: 16,
	},
	card: {
		marginTop: 140,
		marginBottom: 80
	}
});


function mapStateToProps(decks) {
	return {
		decks
	};
}

export default connect(
	mapStateToProps
)(Quiz);
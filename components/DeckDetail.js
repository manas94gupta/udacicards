import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import { white, black, grey, darkGrey } from '../utils/colors';

// Create a local `AddCardButton` component.
function AddCardBtn({ onPress }) {
  return (
    <TouchableOpacity
    	style={styles.addCardBtn}
      onPress={onPress}>
      <Text style={styles.addCardBtnText}>Add Card</Text>
    </TouchableOpacity>
  );
}

// Create a local `StartQuizButton` component.
function StartQuizBtn({ onPress }) {
  return (
    <TouchableOpacity
    	style={styles.startQuizBtn}
      onPress={onPress}>
      <Text style={styles.startQuizBtnText}>Start Quiz</Text>
    </TouchableOpacity>
  );
}

class DeckDetail extends Component {
	startQuiz = (() => {
		const deckTitle = this.props.navigation.state.params.title;
		const questions = this.props.decks[deckTitle].questions;
		/*
		 * Visualize the `start quiz` button only if there are questions
		 * inside this deck.
		 */
		if (questions.length) {
			return (
				<StartQuizBtn
					onPress={() => this.props.navigation.navigate(
						'Quiz',
						{
							title: deckTitle
						}
					)}
				/>
			);
		}
	})

	render() {
		const decks = this.props.decks;
		const deckTitle = this.props.navigation.state.params.title;
		const questionsNumber = decks[deckTitle].questions.length;
		return (
			<View style={styles.container}>
				{
					/*
					 * Text container
					 */
				}
				<View style={styles.textContainer}>
					<Text style={styles.deckTitle}>
						{deckTitle}
					</Text>
					<Text	style={styles.cardsNumber}>
						{questionsNumber + ' cards'}
					</Text>
				</View>
				{
					/*
					 * Buttons container
					 */
				}
				<View>
					<AddCardBtn
						onPress={() => this.props.navigation.navigate(
							'NewQuestion',
							{
								title: deckTitle
							}
						)}
					/>
					{this.startQuiz()}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: white
	},
	addCardBtn: {
		backgroundColor: white,
		padding: 10,
		height: 45,
		width: 200,
		marginLeft: 100,
		marginRight: 100,
		marginTop: 10,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: grey,
		justifyContent: 'center',
		alignItems: 'center'
	},
	addCardBtnText: {
		color: black,
		fontSize: 16,
		textAlign: 'center'
	},
	startQuizBtn: {
		backgroundColor: black,
		padding: 10,
		height: 45,
		width: 200,
		marginLeft: 100,
		marginRight: 100,
		marginTop: 10,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center'
	},
	startQuizBtnText: {
		color: white,
		fontSize: 16,
		textAlign: 'center'
	},
	deckTitle: {
		color: darkGrey,
		fontSize: 32,
		textAlign: 'center'
	},
	cardsNumber: {
		color: grey,
		fontSize: 22,
		textAlign: 'center'
	},
	textContainer: {
		marginTop: 120,
		marginBottom: 120
	}
});

function mapStateToProps(decks) {
	return {
		decks
	};
}

export default connect(
	mapStateToProps
)(DeckDetail);
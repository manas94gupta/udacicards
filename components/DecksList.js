import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { receiveDecks } from '../actions';
import { fetchAllDecks } from '../utils/api';
import { white, black, grey, darkGrey } from '../utils/colors';

function Deck({ title, questions, navigation }) {
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate(
				'DeckDetail',
				{
					title: title
				}
			)}
			style={styles.deck}
			key={title}
		>
			<Text style={styles.title}>
				{title}
			</Text>
			<Text	style={styles.cardsNumber}>
				{questions.length + ' cards'}
			</Text>
		</TouchableOpacity>
	);
}

class DecksList extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
		// Fetch all decks from AsyncStorage.
		fetchAllDecks()
		.then((decks) => {
			// Dispatch an action to receive the retrieved decks.
			dispatch(receiveDecks(decks))
		})
	}

	// Render each deck inside the FlatList Component.
	renderItem = ({ item }) => {
		return <Deck {...item} navigation={this.props.navigation} />
	}

	/*
	 * Pass the index of the item in the array as key to the item.
	 * Solution suggested by the project reviewer at Udacity.
	 */
	keyExtract = ({ item }, index) => index

	render() {
		const decks = this.props.decks;
		const decksArray = [];
		/*
		 * Get the `decks` object from props and build an array to pass
		 * to the FlatList.
		 */
		Object.keys(decks).map((title) => (
			decksArray.push(decks[title])
		))
		return (
			<View style={styles.container}>
				<FlatList
					data={decksArray}
					extraData={this.props}
					keyExtractor={this.keyExtract}
					renderItem={this.renderItem}
				/>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		backgroundColor: white
	},
	deck: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 150,
		borderBottomColor: grey,
		borderBottomWidth: 0.8
	},
	title: {
		color: darkGrey,
		fontSize: 22
	},
	cardsNumber: {
		color: grey,
		fontSize: 16
	}
});

function mapStateToProps(decks) {
	return {
		decks
	};
}

export default connect(
	mapStateToProps
)(DecksList);
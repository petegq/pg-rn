import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	SafeAreaView,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import * as Contacts from 'expo-contacts';

const App = () => {
	const [loading, setLoading] = useState(false);
	const [contacts, setContacts] = useState([]);
	const [inMemoryContacts, setInMemoryContacts] = useState([]);

	useEffect(() => {
		const getContacts = async () => {
			const { status } = await Contacts.requestPermissionsAsync();
			if (status === 'granted') {
				const { data } = await Contacts.getContactsAsync();

				if (data) {
					// console.log(
					// 	'All contact data retrieved: >>>>>>>>>>>>>>>>>\n',
					// 	data,
					// );
					setLoading(false);
					setContacts(data);
					setInMemoryContacts(data);
				}
			}
		};
		getContacts().catch(e => console.log('Error getting contacts: ', e));
	}, []);

	const renderItem = ({ item }) => (
		<View style={styles.listItem}>
			<Text style={styles.contactName}>
				{`${item.firstName} ${item.lastName}`}
			</Text>
			<Text style={styles.contactTel}>{item.phoneNumbers[0].digits}</Text>
		</View>
	);

	const searchContacts = value => {
		const filteredContacts = inMemoryContacts.filter(contact => {
			let contactLowercase = `${contact.firstName} ${contact.lastName}`.toLowerCase();

			let searchTermLowercase = value.toLowerCase();

			return contactLowercase.indexOf(searchTermLowercase) > -1;
		});
		setContacts([...filteredContacts]);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea} />
			<TextInput
				placeholder='Search'
				placeholderTextColor='#ddd'
				style={styles.searchInput}
				onChangeText={value => searchContacts(value)}
			/>
			<View style={styles.listContainer}>
				{loading ? (
					<View
						style={{
							...StyleSheet.absoluteFill,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<ActivityIndicator size='large' color='violet' />
					</View>
				) : (
					<FlatList
						data={contacts}
						renderItem={renderItem}
						ListEmptyComponent={() => (
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyText}>
									No Contacts Found
								</Text>
							</View>
						)}
					/>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: { backgroundColor: '#2f363c' },
	searchInput: {
		backgroundColor: '#2f363c',
		height: 50,
		fontSize: 36,
		padding: 10,
		color: 'white',
		borderBottomWidth: 0.5,
		borderBottomColor: '#7d90a0',
	},
	listContainer: {
		flex: 1,
		backgroundColor: '#2f363c',
	},
	listItem: { minHeight: 70, padding: 5 },
	contactName: {
		color: 'violet',
		fontWeight: 'bold',
		fontSize: 25,
	},
	contactTel: { color: 'white', fontWeight: 'bold' },
	emptyList: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 50,
	},
	emptyText: { color: 'violet' },
});

export default App;

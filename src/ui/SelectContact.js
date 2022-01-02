import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity, BackHandler, Image, TextInput, ActivityIndicator} from 'react-native';
import Contacts from 'react-native-contacts';


export const ContactsContent = (item, navigation, route) => {
	const onContactPress = () => {
		route.params.onReturn(item.phoneNumbers[0].number.replace(/\D/g, '').slice(-10));
		navigation.goBack();
	}

    return (
		<TouchableOpacity onPress={() => onContactPress()} style={{ padding: 15, borderBottomWidth: 1 }}>
		  <View style={{flexDirection:'row', alignItems:'center'}}>
			 <Image style={{ width: 15, height: 15 }} source={require('../images/user.png')} />
			 <Text style={{color:'#000', paddingLeft:5}}>{item.displayName}</Text>
		  </View>
		  <View style={{ flexDirection: 'row', marginTop:5, alignItems:'center' }}>
		    <Image style={{ width: 15, height: 15 }} source={require('../images/mobile.png')} />	
			<Text style={{color:'#000', paddingLeft:5}}>{item.phoneNumbers.length && item.phoneNumbers[0].number && item.phoneNumbers[0].number.replace(/\D/g, '').slice(-10)}</Text>
		  </View>	
		</TouchableOpacity>	
    )
  }

export const SelectContact = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [searchText, setSearchText] = useState(null);
  
 useEffect(() => {
	 Contacts.getAll()
		.then((contacts) => {
			// console.log(JSON.stringify(contacts))
			setContacts(contacts)
			setContactsList(contacts)
			setLoading(false)
		})
		.catch((e) => {
			console.log(e)
			setLoading(false)
		})
   }, [])

   useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
   }, []);
	

const searchFilterFunction = text => {
	setSearchText(text)
	if (contactsList.length && text) {
		const newData = contactsList.filter(item => {
			const itemData = `${item.displayName}`;
			return itemData.indexOf(text) > -1;
		});
		if (newData.length) {
			setContacts(newData)
		}
	} else {
		setContacts(contactsList)
	}
};


  return (
	  <View style={styles.container}>
		    <TextInput
				placeholder="Search..."
				returnKeyType="done"
				value={searchText}
				onChangeText={(text) => searchFilterFunction(text)}
				style={{ ...styles.textInput }}
		  />
		  {loading ? (
			  <ActivityIndicator size="large" color="red" style={{marginTop:'60%' }} />
		  ) : (
			  <FlatList
				  data={contacts}
				  renderItem={({ item }) => ContactsContent(item, navigation, route)}
				  keyExtractor={(item, index) => index.toString()}
			  />)
		  }
				  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textInput: {
    height: 40,
    width: "90%",
    borderWidth: 1,
    alignSelf: "center",
    fontSize: 16,
	paddingLeft: 5,
	marginTop:10
  },
})

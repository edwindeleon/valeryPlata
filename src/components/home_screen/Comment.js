import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native'


const AVATAR_SIZE = 32

const Comment = (props) => 
  <View style={styles.comment}>
    {
      props.userType ==1 ?
        <Image style={styles.avatar} source={require('../../assets/images/valery_user_icon.png')} /> :
        <Image style={styles.avatar} source={require('../../assets/images/user_icon.png')} /> 
    }
    <Text style={styles.text}>{props.text}</Text>
    <Text style={styles.text}>{props.userType}</Text>
  </View>

const styles = StyleSheet.create({
  comment: {
    backgroundColor: '#ecf0f1',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginLeft: 10,
    fontSize: 16
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2
  }
})

export default Comment
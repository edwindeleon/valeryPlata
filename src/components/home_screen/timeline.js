import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ListView,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  Image,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Share from 'react-native-share'
import { Actions } from 'react-native-mobx'
import _ from 'lodash'
import moment from 'moment'
import { observer,inject } from 'mobx-react/native'
import { getColor } from '../config'
import { firebaseApp } from '../../firebase'


const screenWidth = Dimensions.get('window').width

@inject("appStore") @observer
export default class Timeline extends Component {
  constructor(props) {
    super(props)
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      counter: 1,
      isLoading: true,
      isEmpty: false,
      isFinished: false,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    }
  }

  componentDidMount() {
    console.log("--------- TIMELINE --------- " + this.state.counter)
    firebaseApp.database().ref('posts').orderByChild('createdAt').limitToLast(this.state.counter).on('value',
    (snapshot) => {
      console.log("---- TIMELINE POST RETRIEVED ---- "+ this.state.counter +" - "+ _.toArray(snapshot.val()).length)
      if (snapshot.val()) {
        this.setState({ isEmpty: false })
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(_.reverse(_.toArray(snapshot.val()))) })
      }
      else {
        this.setState({ isEmpty: true })
      }
      this.setState({ isLoading: false })
    })
  }

  componentDidUpdate() {
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.titleTop}>{'OFERTAS ESPECIALES'}</Text>
        <ListView
          automaticallyAdjustContentInsets={false}
          initialListSize={1}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={1}
        />
      </View>
    )
  }

  _renderRow = (data) => {
    //console.log("TIMELINE :::: _renderRow " + data.title)
    const timeString = moment(data.createdAt).fromNow()
    const height = screenWidth*data.imageHeight/data.imageWidth
    const shareOptions = {
      title: data.title + " Valery Plata",
      url: "http://myapp.shop/post/" + data.puid,
      subject: "Instala la app de Valery Plata y disfruta de numerosas ofertas"
    }
    const BuyButton = (data.status === 'disponible') ?
            <TouchableOpacity style={styles.button} >
              <Icon name='md-heart' size={30} color='#eee'/>
            </TouchableOpacity>
          : null
    const Status = (data.status === 'disponible') ? <Text style={{fontWeight:'bold',color:"green"}}>{data.status.toUpperCase()}</Text> : <Text style={{fontWeight:'bold',color:"red"}}>{data.status.toUpperCase()}</Text>
    return (
      <View style={styles.card}>
        <View style={styles.postInfo}>
          <Text style={styles.title}>{ data.title }</Text>
        </View>
        
        <View style={styles.postInfo}>
          
          
          { data.text ? <Text style={styles.info}>{ data.text }</Text> : null }
          <Text style={styles.info}><Text style={styles.bold}>RD$: {data.price}</Text></Text>
          
        </View>
        <TouchableOpacity style={styles.postImage} onPress={() => this._openChat(data)}>
          <Image
            source={{ uri:data.image }}
            resizeMode='contain'
            style={{
              height: height,
              width: screenWidth,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
        <View style={styles.postButtons}>
          { BuyButton }
          
          <TouchableOpacity style={styles.button} onPress={()=>{ Share.open(shareOptions) }}>
            <Icon name='md-share' size={30} color='#eee'/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _flagPost = (postData) => {
    console.log("--------> FLAG !!!!!!")
    console.log(postData)
    Alert.alert(
      'Flag Confirmation',
      'Are you sure you want to flag this item? If yes, a moderator will decide within 24 hours if this item should be removed.',
      [
        { text: 'No', onPress: () => {}, style: 'cancel' },
        { text: 'Yes', onPress: () => {

          fetch('https://onesignal.com/api/v1/notifications',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': this.props.appStore.onesignal_api_key,
            },
            body: JSON.stringify(
            {
              app_id: this.props.appStore.onesignal_app_id,
              included_segments: ["All"],
              headings: {"en": "🏴🏴🏴🏴 Item flaged! 🏴🏴🏴🏴"},
              android_sound: "fishing",
              data: postData,
              big_picture: postData.image,
              ios_sound: "fishing.caf",
              contents: {"en": this.props.appStore.user.displayName + " just flaged: " + postData.title + " for " + postData.price},
              filters: [{"field":"tag","key":"username","relation":"=","value":"Herve f"}],
            })
          })
          .then((responseData) => {
            console.log("Push POST:" + JSON.stringify(responseData));
          })
          .done()

         } },
      ]
    )
  }

  _openChat = (postData) => {
    console.log(" *************** Opening CHAT ROOM *************** " + postData.puid);
    Actions.chat({ title:postData.title, puid:postData.puid })
  }

  _BuyNow = (postData) => {
    Actions.chat({ title:postData.title, puid:postData.puid, wantToBuy:true })
  }

  _onEndReached = () => {
    //console.log("TIMELINE ----> _onEndReached :+++:");
    if (!this.state.isEmpty && !this.state.isFinished && !this.state.isLoading) {
      this.setState({ counter: this.state.counter + 1 })
      this.setState({ isLoading: true })
      firebaseApp.database().ref('posts').off()
      firebaseApp.database().ref('posts').orderByChild('createdAt').limitToLast(this.state.counter+1).on('value',
      (snapshot) => {
        this.setState({ isFinished: false })
        console.log("---- TIMELINE POST ON END RETRIEVED ---- "+ this.state.counter +" - "+ _.toArray(snapshot.val()).length)
        if (_.toArray(snapshot.val()).length < this.state.counter) {
          console.log("---- TIMELINE POST FINISHED ----");
          this.setState({ isFinished: true })
        }
        if (snapshot.val()) {
          this.setState({ isEmpty: false })
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(_.reverse(_.toArray(snapshot.val()))),
          })
        }
        this.setState({ isLoading: false })
      })
    }
  }

  _renderFooter = () => {
    if (this.state.isLoading) {
      return (
        <View style={styles.waitView}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }
    if (this.state.isEmpty) {
      return (
        <View style={styles.waitView}>
          <Text>Nothing there yet.</Text>
        </View>
      )
    }
  }

  componentWillUnmount() {
    console.log("---- TIMELINE UNMOUNT ---")
    firebaseApp.database().ref('posts').off()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  waitView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  card: {
    flex: 1,
    margin:10,
    borderWidth: 1,
    borderColor: '#fe6dcd',
    borderBottomWidth: 1,
    shadowColor: '#fe6dcd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#666',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:10,



  },
  titleTop: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    color: getColor()
  },
  postImage: {
    backgroundColor: '#eee',
  },
  postInfo: {
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  postButtons: {
    padding: 5,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  button: {
    flex: 3,
    padding: 5,
    margin: 6,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#fe6dcd',
    alignItems: 'center',
    backgroundColor: '#ff7fd4',
  },
  info: {
    fontSize: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
})
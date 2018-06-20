import { observable, autorun } from 'mobx'
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge'

class AppStore {
  @observable username = ''
  @observable user = {}
  @observable post_count = 0
  @observable order_count = 0
  @observable chat_count = 0
  @observable user_type = 0
  @observable new_messages = 0
  @observable current_page = ''
  @observable current_puid = ''
  @observable tracker = new GoogleAnalyticsTracker('UA-xxxx-x')
  @observable onesignal_app_id = "bec1c7be-a4d4-43b6-90a6-328cd5fa7016"
  @observable onesignal_api_key = "Basic YjEzNmNmNmUtNjFkYS00YTgxLWIyMzQtMDY2MDRkNWQzMTdk"
}

const appStore = new AppStore()

/*
autorun(() => {
  console.log(appStore)
})
*/

export default appStore

// web client ID 720301084900-af1vqpdq77c5tqj8trdi09la2nbue7ib.apps.googleusercontent.com
// ios client ID 720301084900-qckddicfk7l2ojhspnudhmp21qs7pdsl.apps.googleusercontent.com
// android client ID 720301084900-hug6cauuam1kdfs75d86rbrc56ov69tg.apps.googleusercontent.com


import React from 'react'
import MainAppScreen from './MainAppScreen'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducers from '../client/Reducers';
// import 'expo-dev-client';
import * as DevClient from 'expo-dev-client';


const store = createStore(allReducers)

const App = () => {  


  return (
    <Provider store={store}>
      <MainAppScreen/>
    </Provider>
  )
}

export default App
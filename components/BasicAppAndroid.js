import React,{ Component } from 'react';
import {View, Text, ToolbarAndroid, StatusBar} from 'react-native';

export default class BasicAppAndroid extends Component {

  render() {

    return(
      <View style={{flex: 1}}>
        <StatusBar backgroundColor='#4CAF50' />
        <ToolbarAndroid style={{backgroundColor: "#4CAF50", height: 56}} titleColor="#FFFFFF" title="Todo App"/>
      </View>
    )

  }

}

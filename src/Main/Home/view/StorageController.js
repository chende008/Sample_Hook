import React, { useState } from 'react';

import { Clipboard, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, CommonStyles } from '../../Common/storage/Const';
import { dateFormat } from '../../Common/utils/DateUtils';
import { RNStorage } from '../../Common/storage/AppStorage';
import { NavigationBar } from '../../Common/widgets/WidgetNavigation';
import { RNItem, RNLine } from '../../Common/widgets/WidgetDefault';
import { showToast } from '../../Common/widgets/Loading';
import { XText, XView } from 'react-native-easy-app';
import DeviceInfo from 'react-native-device-info';
import { toStr } from '../../Common/utils/Utils';

function StorageController() {

  const jsonObj = {
    age: 25,
    name: 'Tom',
    gender: 'male',
    time: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
  };
  const [text, setText] = useState('');
  const [dataChangedCount, setDataChangedCount] = useState(0);

  return <View style={[CommonStyles.container, { marginTop: INSETS.top }]}>
    <NavigationBar title='数据存储'/>
    <XView>
      <XView style={{ flexDirection: 'row' }}>
        <RNItem text='设置字符串' style={{ flex: 1 }} onPress={() => RNStorage.str = 'this is a string '}/>
        <RNItem text='获取字符串' style={{ flex: 1 }}
                onPress={() => setText(RNStorage.str + dateFormat(new Date(), 'yyyy-MM-dd hh:mm'))}/>
      </XView>
      <XView style={{ flexDirection: 'row' }}>
        <RNItem text='设置Json' style={{ flex: 1 }} onPress={() => RNStorage.json = jsonObj}/>
        <RNItem text='获取Json' style={{ flex: 1 }} onPress={() => setText(JSON.stringify(RNStorage.json))}/>
      </XView>
      <RNItem text='随机字符串' onPress={() => {
        RNStorage[DeviceInfo.getBundleId()] = '随机数据value：' + new Date().valueOf();
        setDataChangedCount(dataChangedCount + 1)
      }}/>
    </XView>
    <ScrollView>{
      Object.keys(RNStorage).map((key) => <XView key={key} style={{
        backgroundColor: Colors.split_line,
        marginBottom: 1,
        padding: 10
      }}>
        <XText style={{ fontSize: 15, color: Colors.text, fontWeight: 'bold' }} text={key + '-> '}/>
        {RNStorage[key] &&
        <XText style={{ fontSize: 13, color: Colors.text_light, marginTop: 10 }} text={toStr(RNStorage[key])}
               onPress={() => {
                 Clipboard.setString(toStr(RNStorage[key]));
                 showToast('已复制【' + toStr(RNStorage[key]) + '】到粘贴板');
               }}/>}
      </XView>)}
    </ScrollView>
    <RNLine/>
    <XText style={[styles.text, { marginBottom: INSETS.bottom }]} text={'文本内容：' + text}/>
  </View>
}

export default StorageController

const styles = StyleSheet.create({
  text: {
    padding: 10,
    fontSize: 14,
    color: Colors.red,
  },
});

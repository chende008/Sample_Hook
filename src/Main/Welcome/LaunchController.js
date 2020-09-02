import React from 'react';
import {LogBox, View} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage';
import {RNStorage} from '../Common/storage/AppStorage';
import {XStorage} from 'react-native-easy-app';
import XLog from "../Common/utils/RFLog";

function LaunchController(props) {

    const initSync = async () => {
        let result = await XStorage.initStorageSync(RNStorage, AsyncStorage, printLog);
        result && navigation.replace('Main')
    };

    const printLog = (data) => {
        data.map(([keyStr, value]) => {
            let [, key] = keyStr.split('#');
            XLog.log('持久化数据变更:', key, '<###>', value);
        })
    };

    const initAsync = () => {
        XStorage.initStorage(RNStorage, AsyncStorage, () => {
            navigation.replace('Main')
        }, printLog);
    };

    LogBox.ignoreAllLogs();
    global.navigation = props.navigation;

    // this.initSync(); 两种初始化方式二选一( Choose one of two initialization methods )
    initAsync();

    return <View/>
}


export default LaunchController

import React, {useEffect, useRef, useState} from 'react';

import {StyleSheet, View} from 'react-native';
import WebUtils from "../../Common/utils/WebUtils";
import {Notify} from "../../Common/events/Notify";
import {NavigationBar} from "../../Common/widgets/WidgetNavigation";
import ProgressBar from "../../Common/widgets/ProgressBar";
import WebView from "react-native-webview";
import {CommonStyles} from "../../Common/storage/Const";
import {DebugManager} from "react-native-debug-tool";

function WebViewController() {

    const defData = {
        title: '',
        loading: true,
        canGoBack: false,
        url: 'https://www.baidu.com'
    };

    const progressBar = useRef();
    const webView = useRef();
    const [loadData, setLoadData] = useState(defData);
    const {title, loading, url, canGoBack} = loadData;
    console.log('XXX', JSON.stringify(loadData));

    useEffect(() => {
        progressBar.current.showAnimal();
        Notify.H5_RELOAD_URL.register(reloadPage);
        return () => Notify.H5_RELOAD_URL.unRegister(reloadPage)
    });

    const reloadPage = ({pageName, url}) => {
        if ('WebViewController'.equals(pageName) && url) {
            setLoadData({...loadData, url});
        }
    };

    return <View style={[CommonStyles.container, {marginTop: INSETS.top}]}>
        <NavigationBar title={title} onBack={() => canGoBack ? webView.current.goBack() : navigation.pop()}/>
        <View style={{flex: 1}}>
            <WebView ref={webView}
                     source={{uri: url}}
                     domStorageEnabled={true}
                     javaScriptEnabled={true}
                     injectedJavaScript={WebUtils.initInjectJs()}
                     onMessage={({nativeEvent}) => {
                         let postMsgData = JSON.parse(nativeEvent.data);
                         if (postMsgData.hasOwnProperty('TitleEvent')) {
                             setLoadData({...nativeEvent, ...postMsgData});
                         } else {
                             WebUtils.msgFromH5(postMsgData, webView.current)
                         }
                     }}
                     onNavigationStateChange={params => {
                         let {url, ...other} = params;
                         setLoadData({...other, url});
                         DebugManager.appendWebViewLogs(url);
                     }}
                     onLoadProgress={({nativeEvent}) => {
                         if (nativeEvent.progress < 1) {
                             progressBar.current.showAnimal()
                         } else {
                             progressBar.current.markToFinished()
                         }
                     }}
            />
            <ProgressBar loading={loading} style={{position: 'absolute', top: 0}} ref={progressBar}/>
        </View>
    </View>;
}

export default WebViewController

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

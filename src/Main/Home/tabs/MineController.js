import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { XHttp, XText, XView } from 'react-native-easy-app';
import { Colors, CommonStyles } from "../../Common/storage/Const";
import { showLoading, showToast } from "../../Common/widgets/Loading";
import { RNItem } from "../../Common/widgets/WidgetDefault";
import { Api } from "../http/Api";

/**
 * 其它接口请求，接口返回的非json数据结构（纯文本&XML数据）
 */
function MineController() {

  const [content, setContent] = useState();

  const moviesList = () => {// 返回标准的json的http请求
    XHttp().url(Api.moviesList).loadingFunc((loading) => showLoading('请求中，请稍候...', loading)).get((success, json, msg, code) => {
      if (success) {
        showToast('请求成功');
        setContent(JSON.stringify(json));
      } else {
        showToast(msg);
      }
    });
  };

  const animalImageList = () => { // 返回标准的json的http请求
    XHttp().url(Api.filmsList).loadingFunc((loading) => showLoading('请求中，请稍候...', loading)).get((success, json, msg, code) => {
      if (success) {
        showToast('请求成功');
        setContent(JSON.stringify(json));
      } else {
        showToast(msg);
      }
    });
  };

  const queryMemberList = async () => {// 同步请求数据
    let { success, json, message, status } = await XHttp().url(Api.queryMembers).execute('GET');

    success ? setContent(JSON.stringify(json)) : showToast(message);

    /* 或者得使用标准的promise方式解析数据（异步promise）
    RFHttp().url(Api.queryMembers).execute('GET').then(({success, json, message, status}) => {
        if (success) {
            showToast('请求成功');
            this.content = JSON.stringify(json)
        } else {
            showToast(message);
        }
    }).catch(({message}) => {
        showToast(message);
    })
    */
  };

  const getCityList = () => { //查询各城市Mobile服务数量
    XHttp().url(Api.queryCitiesAmount)
      .contentType('text/xml; charset=utf-8')
      .loadingFunc((loading) => showLoading('请求中，请稍候...', loading))
      .pureText().get((success, data, msg, code) => {
      if (success) {
        showToast('请求成功');
        setContent(JSON.stringify(data));
      } else {
        showToast(msg);
      }
    });
  };

  return <View style={[CommonStyles.container, { marginTop: INSETS.top }]}>
    <RNItem text='简单数据：标准的json' onPress={() => moviesList()}/>
    <RNItem text='获取图片列表：标准的json' onPress={() => animalImageList()}/>
    <RNItem text='同步请求成员列表：标准的json' onPress={() => queryMemberList()}/>
    <RNItem text='省份、城市记录数量：返回 XML' onPress={() => getCityList()}/>
    <XView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <XText text='跳转到首页' style={styles.btn} onPress={() => tabNavigator.navigate('Home')}/>
      <XText text='数据存储管理' style={styles.btn} onPress={() => navigation.push('Storage')}/>
      <XText text='打开H5页面' style={styles.btn} onPress={() => navigation.push('WebView')}/>
    </XView>
    <ScrollView>
      <XText style={{ fontSize: 12, color: Colors.text_lighter, padding: 10 }} text={content}/>
    </ScrollView>
  </View>

}

export default MineController

const styles = StyleSheet.create({
  btn: {
    margin: 10,
    padding: 10,
    fontSize: 14,
    borderRadius: 5,
    textAlign: 'center',
    color: Colors.white,
    backgroundColor: Colors.text_disable,
  },
});


import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Api} from '../http/Api';
import {showToast} from '../../Common/widgets/Loading';
import {Colors, CommonStyles, Const} from '../../Common/storage/Const';
import {XFlatList, XHttp, XImage, XText, XView} from 'react-native-easy-app';
import {isEmpty, netWorkException} from "../../Common/utils/Utils";

const headerText = '分页列表支持：无网络，加载中，无数据，加载错误，加载更多等一系列状态展示';

function RefreshController() {

    let pageIndex = 1;//页码
    const refreshRef = useRef();
    const [dataList, setDataList] = useState([]);

    const queryDataList = (isPullDown) => {
        const refreshList = refreshRef.current;
        if (isEmpty(refreshList)) return;

        pageIndex = isPullDown ? 1 : pageIndex + 1;
        refreshList.refreshPreLoad(isPullDown);
        let params = {page: isPullDown ? 1 : pageIndex};

        XHttp().url(Api.queryAnimations).param(params).get((success, {results, last_page}, msg, code) => {
            refreshList.refreshLoaded(success, isPullDown, params.page >= last_page, netWorkException(code));
            if (success) {
                setDataList(isPullDown ? results : [...dataList, ...results])
            } else {
                showToast(msg);
            }
        });
    };

    const renderItem = (item, index) => {
        let {title, image_url, type, score, synopsis, members} = item;
        return <XView key={index} style={styles.itemParent}>
            <XImage style={{width: 120, height: 120, margin: 5}} resizeMode='contain' icon={image_url}/>
            <XView style={{flex: 1}}>
                <XText style={{fontSize: 14, fontWeight: 'bold', color: Colors.text, paddingRight: 5}} text={'名称：' + title}/>
                <XText style={styles.itemDesc} numberOfLines={4} text={synopsis}/>
                <XText style={{fontSize: 12, color: Colors.text}} text={'评分：' + score + '    参与人数：' + members}/>
            </XView>
        </XView>;
    };

    useEffect(() => queryDataList(true), []);

    return <View style={[CommonStyles.container, {marginTop: INSETS.top}]}>
        <XFlatList data={dataList}
                   ref={refreshRef}
                   onRefresh={() => queryDataList(true)}
                   onLoadMore={() => queryDataList(false)}
                   refreshStatus={{RefreshingData: {text: '刷新中，请稍候...'},}}
                   ListHeaderComponent={() => <XText style={styles.header} text={headerText}/>}
                   renderItem={({item, index}) => renderItem(item, index)}/>
    </View>;
}

export default RefreshController

const styles = StyleSheet.create({
    header: {
        paddingTop: 10,
        paddingHorizontal: 10,
        fontSize: 13,
        lineHeight: 16,
        color: Colors.red,
    },
    itemParent: {
        marginTop: 10,
        paddingTop: 5,
        paddingBottom: 10,
        flexDirection: 'row',
        borderBottomWidth: Const.onePixel,
        borderBottomColor: Colors.split_line,
        backgroundColor: Colors.white
    },
    itemDesc: {
        flex: 1,
        fontSize: 13,
        lineHeight: 16,
        paddingRight: 8,
        paddingVertical: 5,
        color: Colors.text_lighter,
    },
});

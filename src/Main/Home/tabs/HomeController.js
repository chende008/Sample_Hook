import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {XText} from 'react-native-easy-app';
import {Colors, CommonStyles} from "../../Common/storage/Const";

export default function HomeController() {
    const [randomList, setRandomList] = useState([3.14159265358979323846]);

    return <View style={[CommonStyles.container, {marginTop: INSETS.top}]}>
        <XText text={'条目数量：' + randomList.length} style={styles.tip}/>
        <XText text='添加随机数' style={styles.btn} onPress={() => {
            randomList.push(Math.random() * 1000000);
            setRandomList([...randomList])
        }}/>
        <ScrollView>{
            randomList && randomList.map((item, index) => {
                return <XText key={index}
                              icon='close'
                              iconSize={16}
                              textExtend={true}
                              iconPosition='right'
                              text={'随机数：' + item}
                              style={styles.itemText}
                              onPress={() => {
                                  randomList.splice(index, 1);
                                  setRandomList([...randomList])
                              }}/>;
            })}
        </ScrollView>
    </View>
}


const styles = StyleSheet.create({
    tip: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.yellow,
        paddingLeft: 15,
        paddingTop: 15
    },
    btn: {
        margin: 10,
        padding: 10,
        fontSize: 14,
        borderRadius: 5,
        textAlign: 'center',
        color: Colors.white,
        backgroundColor: Colors.text_disable,
    },
    itemText: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderBottomColor: Colors.split_line,
        borderBottomWidth: 0.3,
    },
});

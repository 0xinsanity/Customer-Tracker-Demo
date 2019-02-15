import React, {Component} from 'react';
import {Picker, Modal, Alert, View, Image, StyleSheet, Text, Button, processColor, AsyncStorage, ScrollView, SafeAreaView} from 'react-native';
import update from 'immutability-helper';
import MainButton from '../components/MainButton';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MainChart from '../components/MainChart';
import {convertToFullTime, convertToMilitaryTime, convertToRegularTime, convertToDate} from '../convertTime';
import {
    Table,
    TableWrapper,
    Row,
    Col,
    Cell
} from 'react-native-table-component';

const config = require('../config');
const styles = config.main_styles;
const height = config.height;

export default class Compare extends Component {
    static navigationOptions = {
        title: 'Compare',
        tabBarIcon: ({tintColor}) => (<Image
            source={require('../img/compare_icon.png')}
            style={[
            styles.icon, {
                tintColor: tintColor
            }
        ]}/>)
    };

    state = {
        date1: '',
        date2: '',
        date1OrNot: true,
        isDateTimePickerVisible: false,
        weekPicker: false,
        x_vals: [],
        startingTime: '8:30 AM',
        endingTime: '8:30 PM'
    };

    componentWillMount() {
        const now = new Date();
        const now_date = now.getDate();
        const now_month = now.getMonth();
        const now_year = now.getFullYear();

        this.setState({
            date2: `${now_month+1}/${now_date}/${now_year-2000}`,
            date1: `${now_month+1}/${now_date-1}/${now_year-2000}`,
        }, ()=> this.retrieveData());
    }
    
    componentDidMount() {
        AsyncStorage.getItem(`startingTime`).then((start) => {
                if (start !== null) 
                    this.setState({startingTime: start});
                }
            );

        AsyncStorage.getItem(`endingTime`).then((end) => {
                if (end !== null) 
                    this.setState({endingTime: end});
                }
            );

        this.setState(
            update(this.state, {
              data: {
                $set: {
                  dataSets: [{
                    values: this.state.y_vals,
                    label: 'Day 1',
                    config: {
                      lineWidth: 2,
                      drawCircles: false,
                      color: processColor('white'),
                      fillAlpha: 0,
                      valueTextSize: 0,
                      valueFormatter: "##.000",
                    }
                  }, 
                  {
                    values: this.state.y_vals2,
                    label: 'Day 2',
                    config: {
                      lineWidth: 2,
                      drawCircles: false,
                      color: processColor('#D8D8D8'),
                      fillAlpha: 0,
                      valueTextSize: 0,
                      valueFormatter: "##.000",
                    }
                  }],
                }
              },
              xAxis: {
                $set: {
                  valueFormatter: [],
                  textColor: processColor('white'),
                  position:'BOTTOM',
                  fontFamily: 'ProximaNova-Regular',
                  fontSize:10,
                  drawGridLines:false,
                  labelCount:10,
                  labelRotationAngle:90
                }
              }
            })
          );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.screenProps.currentScreen === "Compare" && this.props.screenProps.currentScreen !== "Compare") {
            AsyncStorage.getItem(`startingTime`).then((start) => {
                if (start !== null) 
                    this.setState({startingTime: start});
                }
            );
        
            AsyncStorage.getItem(`endingTime`).then((end) => {
                if (end !== null) 
                    this.setState({endingTime: end});
                }
            );
            this.retrieveData();
        }
    }

    _handleDatePicked(date) {
        if (this.state.date1OrNot) {
            this.setState({date1: `${date.getMonth()+1}/${date.getDate()}/${date.getYear()-100}`, isDateTimePickerVisible: false}, ()=> {this.retrieveData()});
        } else {
            this.setState({date2: `${date.getMonth()+1}/${date.getDate()}/${date.getYear()-100}`, isDateTimePickerVisible: false}, ()=> {this.retrieveData()});
        }
    }

    chooseWeekOrDay(truefalse) {
        this.setState({isDateTimePickerVisible: false}, ()=> Alert.alert(
            'Would you like to choose a Week or Day to Compare?','',
            [
            {text: 'Week', onPress: () => this.setState({date1OrNot: truefalse, weekPicker: true})},
            {text: 'Day', onPress: () => this.setState({date1OrNot: truefalse, isDateTimePickerVisible: true})},
            {text: 'Cancel', onPress: () => console.log('cancelled'), style: 'cancel'},
            ],
            { cancelable: false }
        ));
        
    }

    render() {
        const date1 = this.state.date1.substring(0,1) === 'W' ? this.state.date1.substring(8) : this.state.date1;
        const date2 = this.state.date2.substring(0,1) === 'W' ? this.state.date2.substring(8) : this.state.date2;
        const tableHead = ['Time', date1, date2];
        var x_axis = [];
        var y_axis = [];
        var y_axis2 = [];
        var chart = <View style={styles.chart}/>;
        // TODO: Find a better way to do this OR just make sure user cant pick 30 minutes of work
        if (this.state.data !== undefined && this.state.xAxis.valueFormatter.length > 1) {

            var greatest_num = 0;
            for (obj in this.state.xAxis['valueFormatter']) {
                const x = convertToFullTime(this.state.xAxis['valueFormatter'][parseInt(obj)]);
                x_axis.push(x);
                const y = parseInt(this.state.data['dataSets'][0]['values'][parseInt(obj)]['y']);
                if (greatest_num < y) {
                    greatest_num = y
                }
                y_axis.push(y);
                const y2 = parseInt(this.state.data['dataSets'][1]['values'][parseInt(obj)]['y']);
                if (greatest_num < y2) {
                    greatest_num = y2
                }
                y_axis2.push(y2);
            }
            
            chart = <MainChart greatestNum={greatest_num} data={this.state.data} xAxis={this.state.xAxis}/>;
        }

        var weeks = [];
        const now = new Date();
        for (var i = 0; i < 7; i++) {
            if (now.getDay() === 1) {
                break;
            } else {
                now.setDate(now.getDate()-1);
            }
        }

        for (var i = 0; i < 10; i++) {
            weeks.push(`Week of ${now.getMonth()+1}/${now.getDate()}/${now.getYear()-100}`);
            now.setDate(now.getDate()-7);
        }

        return (
            <SafeAreaView style={styles.background}>
                <View
                    style={{
                    flexDirection: 'row',
                    marginTop: 30
                }}>
                    <Text style={{fontFamily: 'ProximaNova-Semibold', fontSize: 30, color: '#fff'}}>Compare:</Text>
                </View>
                <View
                    style={{
                    flexDirection: 'row',
                    marginTop: 15
                }}>
                    <MainButton
                        style={{width: '45%', height: 45, borderRadius: 8, marginRight: '1.5%'}}
                        title={this.state.date1}
                        onPress={()=>this.chooseWeekOrDay(true)}/>
                    <MainButton
                        style={{width: '45%', height: 45, borderRadius: 8, marginLeft: '1.5%'}}
                        title={this.state.date2}
                        onPress={()=>this.chooseWeekOrDay(false)}/>
                </View>

                <View style={[styles.container, {marginTop: 10, height: height > 650 ? "54%" : "50%"}]}> 
                    {chart}
                </View>


                <View style={styles.main_table}>
                    <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
                        <Table borderStyle={{borderWidth: 2, borderColor: '#fff'}} style={{flexDirection: 'row'}}>
                            <TableWrapper style={{width: '48%'}}>
                                <Cell data={tableHead[0]} textStyle={[styles.table_text, {textAlign: 'left', fontFamily: 'ProximaNova-Bold'}]} style={{height: 30, width: '100%'}}/>
                                <Col data={x_axis} heightArr={[30]} textStyle={styles.table_text} style={[styles.table, {width: '100%'}]} />     
                            </TableWrapper>

                            <TableWrapper style={{width: '24%'}}>
                                <Cell data={tableHead[1]} textStyle={[styles.table_text, {textAlign: 'right', fontFamily: 'ProximaNova-Bold'}]} style={{height: 30, width: '100%'}}/>
                                <Col data={y_axis} heightArr={[30]} textStyle={[styles.table_text, {textAlign: 'right'}]} style={[styles.table, { width: '100%'}]} />
                            </TableWrapper>
                            
                            <TableWrapper style={{width: '24%'}}>
                                <Cell data={tableHead[2]} textStyle={[styles.table_text, { textAlign: 'right', fontFamily: 'ProximaNova-Bold'}]} style={{height: 30, width: '100%'}}/>
                                <Col data={y_axis2} heightArr={[30]} textStyle={[styles.table_text, {textAlign: 'right'}]} style={[styles.table, { width: '100%'}]} />
                            </TableWrapper>
                        </Table>
                    </ScrollView>
                </View>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={(date) => {this._handleDatePicked(date)}}
                    titleIOS='Pick a Date'
                    minuteInterval={30}
                    onCancel={() => {
                        this.setState({isDateTimePickerVisible: false})
                    }}
                    mode="date"/>
                <Modal
                    animationType="fade"
                    transparent={true}
                    presentationType="overFullScreen"
                    visible={this.state.weekPicker}>
                    <View style={{backgroundColor: 'rgba(0, 0, 0, 0.28)', width: '100%', height: '100%', alignItems: 'center'}}>
                        <View style={styles.modalContainer}>
                            <Picker
                                selectedValue={this.state.date1OrNot ? this.state.date1 : this.state.date2}
                                onValueChange={(itemValue, itemIndex) => {
                                    if (itemIndex !== 0)
                                        if (this.state.date1OrNot)
                                            this.setState({date1: itemValue});
                                        else 
                                            this.setState({date2: itemValue});
                                    }}>
                                    <Picker.Item label={'Select a Week'} value={-1} key={-1}/>
                                {weeks.map((item, index) => {
                                    return (<Picker.Item label={item} value={item} key={index}/>) 
                                })}
                            </Picker>
                        <Button onPress={()=>{this.setState({weekPicker: false}, ()=> {this.retrieveData()})}} title={"Submit"} style={{bottom: 10}}/>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    async retrieveData() {
        const date1 = convertToDate(this.state.date1.substring(0,1) === 'W' ? this.state.date1.substring(8) : this.state.date1);
        var date1_date = date1.getDate();
        var date1_month = date1.getMonth();
        var date1_year = date1.getFullYear();

        const date2 = convertToDate(this.state.date2.substring(0,1) === 'W' ? this.state.date2.substring(8) : this.state.date2);
        var date2_date = date2.getDate();
        var date2_month = date2.getMonth();
        var date2_year = date2.getFullYear();

        var time_now = convertToMilitaryTime(this.state.startingTime);
        const time_end = convertToMilitaryTime(this.state.endingTime);

        var currentHour = parseInt(time_now.substring(0, time_now.length - 3));
        var currentMin = 0;
        if (currentHour < 10) 
            currentMin = time_now.substring(2, 4);
        else 
            currentMin = time_now.substring(3, 5);
        
        const endHour = parseInt(time_end.substring(0, time_end.length - 3));
        var endMin = 0;
        if (endHour < 10) 
            endMin = time_end.substring(2, 4);
        else 
            endMin = time_end.substring(3, 5);
        
        var data1_array = [];
        var data2_array = [];
        var x_axis = [];
        while (currentHour !== endHour || currentMin !== endMin) {
            try {
                const interval = await AsyncStorage.getItem(`${date1_year}-${date1_month}-${date1_date}-${currentHour}:${currentMin}`);
                const interval2 = await AsyncStorage.getItem(`${date2_year}-${date2_month}-${date2_date}-${currentHour}:${currentMin}`);

                var final = 0;
                if (interval !== null)
                    final = parseInt(interval)

                if (this.state.date1.substring(0,1) === 'W') {
                    for (var i = 0; i < 6; i++) {
                        date1.setDate(date1.getDate()+1);
                        date1_date = date1.getDate();
                        date1_month = date1.getMonth();
                        date1_year = date1.getFullYear();
                        const new_interval = await AsyncStorage.getItem(`${date1_year}-${date1_month}-${date1_date}-${currentHour}:${currentMin}`);
                        if (new_interval !== null && new_interval !== undefined)
                            final += parseInt(new_interval)
                    }
                    final /= 7;
                    console.log('current_hour' + currentHour + currentMin+'final: ' + final);
                    date1.setDate(date1.getDate()-7);
                    date1_date = date1.getDate();
                    date1_month = date1.getMonth();
                    date1_year = date1.getFullYear();
                }


                var final2 = 0;
                if (interval2 !== null)
                    final2 = parseInt(interval2)

                if (this.state.date2.substring(0,1) === 'W') {
                    for (var i = 0; i < 6; i++) {
                        date2.setDate(date2.getDate()+1);
                        date2_date = date2.getDate();
                        date2_month = date2.getMonth();
                        date2_year = date2.getFullYear();
                        const new_interval = await AsyncStorage.getItem(`${date2_year}-${date2_month}-${date2_date}-${currentHour}:${currentMin}`);
                        if (new_interval !== null && new_interval !== undefined)
                            final2 += parseInt(new_interval)
                    }
                    final2 /= 7;
                    console.log('current_hour' + currentHour + currentMin+'final2: ' + final2);
                    date2.setDate(date2.getDate()-7);
                    date2_date = date2.getDate();
                    date2_month = date2.getMonth();
                    date2_year = date2.getFullYear();
                }
                
                data1_array.push({'y': final});
                data2_array.push({'y': final2});
            } catch (error) {
                // Error retrieving data
                console.log('error');
            }

            var hour = currentHour;
            if (hour == 0) 
                hour = 12;
            
            var full_time = `${hour}:${currentMin}`;
            full_time = convertToRegularTime(full_time);

            x_axis.push(full_time);

            if (currentMin == '00') {
                currentMin = '30';
            } else {
                currentMin = '00';
                currentHour++;
            }

            if (currentHour === 24) {
                currentHour = 0;
            }
        }
        //this.setState({x_vals: x_axis, y_vals: data_array});

        for (var i = 0; i < this.state.x_vals; i++) {
            this.state.x_vals[i] = convertToRegularTime(this.state.x_vals[i]);
        }

        var data = [];
        var xAxis = [];
        data = update(this.state.data, {dataSets:[{values: {$set: data1_array}}, {values: {$set: data2_array}}]})

        xAxis = update(this.state.xAxis, {valueFormatter: {$set: x_axis}});
        this.setState({xAxis, data}, ()=> this.render());
        
 }

}
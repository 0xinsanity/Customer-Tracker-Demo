import React, {Component} from 'react';
import {
    View, processColor,
    Image,
    StyleSheet,
    Text,
    Button,
    AsyncStorage,
    ScrollView,
    SafeAreaView,
    Alert,
    Platform
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
    Table,
    TableWrapper,
    Row,
    Col,
    Cell
} from 'react-native-table-component';
import OpeningClosingButton from '../components/OpeningClosingButton';
import MainButton from '../components/MainButton';
import MainChart from '../components/MainChart';
import {convertToFullTime, convertToMilitaryTime, convertToRegularTime} from '../convertTime';

import update from 'immutability-helper';

const config = require('../config');
const styles = config.main_styles;

export default class Results extends Component {
    static navigationOptions = {
        title: 'Results',
        tabBarIcon: ({tintColor}) => (<Image
            source={require('../img/results_icon.png')}
            style={[
            styles.icon, {
                tintColor: tintColor
            }
        ]}/>)
    };

    constructor(props) {
        super(props)
        this.state = {
            startingTime: '8:30 AM',
            endingTime: '8:30 PM',
            isDateTimePickerVisible: false,
            start: true,
            cust_tot_count: 0,
            x_vals: [],
            y_vals: [{}],
            viewType: 'Today'
        }
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
                    label: 'Company',
                    config: {
                      lineWidth: 2,
                      drawCircles: false,
                      color: processColor('white'),
                      fillAlpha: 0,
                      valueTextSize: 0,
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
                  labelRotationAngle:90,
                }
              }
            })
          );
    }

    changeDate = () => {
        if (Platform.OS == 'ios') {
        Alert.alert(
            'What would you like to change your viewing type too?',
            'After choosing the viewing type, you must change the tab of the app and come back in in order for the changes to be in effect.',
            [
              {text: 'Today', onPress: () => this.setState({viewType: 'Today'}, ()=> this.retrieveData())},
              {text: 'This Week', onPress: () => this.setState({viewType: 'This Week'}, ()=> this.retrieveData())},
              {text: 'This Month', onPress: () => this.setState({viewType: 'This Month'}, ()=> this.retrieveData())},
              {text: 'Overall', onPress: () => this.setState({viewType: 'Overall'}, ()=> this.retrieveData())},
              {text: 'Cancel', onPress: () => console.log('cancelled'), style: 'cancel'},
            ],
            { cancelable: false }
          )
        } else {
            Alert.alert(
                'What would you like to change your viewing type too?',
                'After choosing the viewing type, you must change the tab of the app and come back in in order for the changes to be in effect.',
                [
                  {text: 'Today', onPress: () => this.setState({viewType: 'Today'}, ()=> this.retrieveData())},
                  {text: 'This Week', onPress: () => this.setState({viewType: 'This Week'}, ()=> this.retrieveData())},
                  {text: 'Others', onPress: () => Alert.alert('Here are some other options.', 'Please choose one or cancel',[
                    {text: 'Overall', onPress: () => this.setState({viewType: 'Overall'}, ()=> this.retrieveData())},
                    {text: 'This Month', onPress: () => this.setState({viewType: 'This Month'}, ()=> this.retrieveData())},
                    {text: 'Cancel', onPress: () => console.log('cancelled'), style: 'cancel'}])},
                ],
                { cancelable: false }
              )
        }
    }

    _handleDatePicked = (time) => {
        var ampm = '';

        const now = time;

        if (time.getHours() > 12) 
            ampm = 'PM';
        else if (time.getHours() === 12)
            ampm = 'PM';
        else 
            ampm = 'AM';
        
        time = time.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/(:\d{2}| [AP]M)$/, "") + " " + ampm;


        if (this.state.start) {
            // save to opening


            var colon_start = this.state.endingTime.indexOf(":");
            const ending_hrs = parseInt(convertToMilitaryTime(this.state.endingTime).substring(0, colon_start));
            const ending_min = parseInt(convertToMilitaryTime(this.state.endingTime).substring(colon_start+1, colon_start+3));


            if (now.getHours() < ending_hrs || (now.getHours() === ending_hrs && now.getMinutes() < ending_min)) {
                this.setState({startingTime: time}, ()=>this.retrieveData());
                AsyncStorage.setItem(`startingTime`, `${time}`);
                
            } else {

                if (Platform.OS === 'android') {
                    this.setState({isDateTimePickerVisible: false}, ()=> Alert.alert(
                        'Not Valid',
                        'Please only enter a time that comes after your starting time.',
                        [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: false }
                    ));
                } else {
                    Alert.alert(
                        'Not Valid',
                        'Please only enter a time that comes after your starting time.',
                        [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: false }
                    );
                }
                return;
            }
            
        } else {
            // end time

            var colon_start = this.state.startingTime.indexOf(":");
            const starting_hrs = parseInt(convertToMilitaryTime(this.state.startingTime).substring(0, colon_start));
            const starting_min = parseInt(convertToMilitaryTime(this.state.startingTime).substring(colon_start+1, colon_start+3));


            if (now.getHours() > starting_hrs || (now.getHours() === starting_hrs && now.getMinutes() > starting_min)) {
                this.setState({endingTime: time}, ()=>this.retrieveData());
                AsyncStorage.setItem(`endingTime`, `${time}`);
                
            } else {
                
                if (Platform.OS === 'android') {
                    this.setState({isDateTimePickerVisible: false}, ()=> Alert.alert(
                        'Not Valid',
                        'Please only enter a time that comes after your starting time.',
                        [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: false }
                    ));
                } else {
                    Alert.alert(
                        'Not Valid',
                        'Please only enter a time that comes after your starting time.',
                        [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: false }
                    );
                }
                
                return;
            }
        }

        this.setState({isDateTimePickerVisible: false})
        //this.retrieveData();
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.screenProps.currentScreen === "Results" && this.props.screenProps.currentScreen !== "Results") {
            this.retrieveData();
        }
    }

    changeTimerOpening() {
        this.setState({start: true});
        this.setState({isDateTimePickerVisible: true});
    }

    changeTimerClosing() {
        this.setState({start: false});
        this.setState({isDateTimePickerVisible: true})
    }

    render() {
        
        const tableHead = ['Time', '# of Customers'];
        var x_axis = [];
        var y_axis = [];
        var chart = <View style={styles.chart}/>;
        // TODO: Find a better way to do this OR just make sure user cant pick 30 minutes of work
        if (this.state.data !== undefined && this.state.xAxis.valueFormatter.length > 1) {

            console.log('data: ' + this.state.data);
            var greatest_num = 0;
            for (obj in this.state.xAxis['valueFormatter']) {
                const x = convertToFullTime(this.state.xAxis['valueFormatter'][parseInt(obj)]);
                x_axis.push(x);
                const y = parseInt(this.state.data['dataSets'][0]['values'][parseInt(obj)]['y']);
                if (greatest_num < y) {
                    greatest_num = y
                }
                y_axis.push(y);
            }
            
            chart = <MainChart greatestNum={greatest_num} data={this.state.data} xAxis={this.state.xAxis}/>;
        }
        for (obj in this.state.x_vals) {
            const x = convertToFullTime(this.state.x_vals[parseInt(obj)]);
            x_axis.push(x);
            y_axis.push(parseInt(this.state.y_vals[parseInt(obj)]['y']));
        }
        return (
            <SafeAreaView style={styles.background}>
                <View
                    style={{
                    flexDirection: 'row',
                    marginTop: 20
                }}>
                    <OpeningClosingButton
                        title="Opening"
                        time={this.state.startingTime}
                        onPress={()=>this.changeTimerOpening()}/>
                    <OpeningClosingButton
                        title="Closing"
                        time={this.state.endingTime}
                        onPress={()=>this.changeTimerClosing()}/>
                </View>
                <MainButton
                title={this.state.viewType}
                style={{
                    height: 45,
                    width: '95%',
                    borderRadius: 8,
                    marginTop: 10
                }}
                onPress={this.changeDate.bind(this)}
                textStyle={{
                    fontFamily: 'ProximaNova-Bold',
                    fontSize: 18
                }}/>
                <View
                    style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    width: '95%'
                }}>
                    <Text
                        style={{
                        fontFamily: 'ProximaNova-Semibold',
                        fontSize: 18,
                        color: '#fff'
                    }}>Customers: <Text
                            style={{
                            fontFamily: 'ProximaNova-Bold'
                        }}>{this.state.cust_tot_count}</Text>
                    </Text>
                </View>

                <View style={styles.container}> 
                    {chart}
                </View>

                <View style={styles.main_table}>
                    <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
                        <Table borderStyle={{borderWidth: 2, borderColor: '#fff'}} style={{flexDirection: 'row'}}>
                            <TableWrapper style={{width: '48%'}}>
                                <Cell data={tableHead[0]} textStyle={[styles.table_text, {textAlign: 'left', fontFamily: 'ProximaNova-Bold'}]} style={{height: 30, width: '100%'}}/>
                                <Col data={x_axis} heightArr={[30]} textStyle={styles.table_text} style={[styles.table, {width: '100%'}]} />     
                            </TableWrapper>

                            <TableWrapper style={{width: '48%'}}>
                                <Cell data={tableHead[1]} textStyle={[styles.table_text, {textAlign: 'right', fontFamily: 'ProximaNova-Bold'}]} style={{height: 30, width: '100%'}}/>
                                <Col data={y_axis} heightArr={[30]} textStyle={[styles.table_text, {textAlign: 'right'}]} style={[styles.table, { width: '100%'}]} />
                            </TableWrapper>
                        </Table>
                    </ScrollView>
                </View>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    titleIOS='Pick a Time'
                    minuteInterval={30}
                    onCancel={() => {
                    this.setState({isDateTimePickerVisible: false})
                }}
                    date={new Date('04 Dec 2018 9:00:00 EST')}
                    mode="time"/>

            </SafeAreaView>
        );
    }

    async retrieveData() {
        const now = new Date();
        const date = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        AsyncStorage
            .getItem(`${year}-${month}-${date}`)
            .then((total) => {
                if (total !== null) 
                    this.setState({cust_tot_count: total});
                }
            );

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
        
        var data_array = [];
        var x_axis = [];
        while (currentHour !== endHour || currentMin !== endMin) {

            try {
                const interval = await AsyncStorage.getItem(`${year}-${month}-${date}-${currentHour}:${currentMin}`);
                console.log("interval: " + interval+ '\n');

                var final = 0;
                // Today
                if (interval !== null)
                    final = parseInt(interval)

                var change = 0;
                if (this.state.viewType === "This Week") {
                    change = 7;
                } else if (this.state.viewType === 'This Month') {
                    change = 31;
                } else if (this.state.viewType === 'Overall') {
                    
                    var og_date = await AsyncStorage.getItem(`startDate`);
                    
                    var counter = 0;
                    var new_year = year;
                    var new_month = month;
                    var new_date = date;
                    while (`${new_year}-${new_month}-${new_date}` !== og_date) {
                        new_date--;
                        if (new_date === 0) {
                            new_month--;
                            if (new_month === 2)
                                new_date = 28;
                            else if (new_month === 4 || new_month === 6 || new_month === 9 || new_month === 11)
                                new_date = 30;
                            else 
                                new_date = 31;
                        }
                        if (new_month === 0) {
                            new_month = 12;
                            new_date = 31;
                            new_year--;
                        }
                        counter++;
                    }
                    change = counter;
                }
                
                var new_year = year;
                var new_month = month;
                var new_date = date;
                for (var i = 1; i <= change; i++) {
                    new_date--;
                    if (new_date === 0) {
                        new_month--;
                        if (new_month === 2)
                            new_date = 28;
                        else if (new_month === 4 || new_month === 6 || new_month === 9 || new_month === 11)
                            new_date = 30;
                        else 
                            new_date = 31;
                    }
                    if (new_month === 0) {
                        new_month = 12;
                        new_date = 31;
                        new_year--;
                    }

                    const interval2 = await AsyncStorage.getItem(`${new_year}-${new_month}-${new_date}-${currentHour}:${currentMin}`);

                    if (interval2 !== null)
                        final += parseInt(interval2);
                }
                if (change !== 0)
                    final = final/change;
                    
                data_array.push({'y': final})
            } catch (error) {
                // Error retrieving data
                console.log('error');
            }

            var hour = currentHour;
            if (hour == 0) hour = 12;
            
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


        var data = update(this.state.data, {dataSets:[{
            values: {$set: data_array}
        }]});
        var xAxis = update(this.state.xAxis, {valueFormatter: {$set: x_axis}});
        this.setState({xAxis, data}, ()=> this.render());
        
 }
}
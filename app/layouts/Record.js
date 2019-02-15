import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    StatusBar,
    AsyncStorage,
    Alert,
    SafeAreaView
} from 'react-native';
import MainButton from '../components/MainButton';
import TimerMixin from 'react-timer-mixin';
import {convertToMilitaryTime} from '../convertTime';
import { Button } from 'rmwc/Button';
import {main_styles} from '../config';

export default class Record extends Component {
    static navigationOptions = {
        title: 'Record',
        tabBarIcon: ({tintColor}) => (<Image
            source={require('../img/record_icon.png')}
            style={[
                main_styles.icon, {
                tintColor: tintColor
            }
        ]}/>)
    };

    constructor(props) {
        super(props)
        this.state = {
            cust_tot_count: 0,
            cust_interval_count: 0,
            startingTime: null,
            endingTime: null
        }
        console.ignoredYellowBox = ['Setting a timer'];
    }

    componentDidMount() {
        const now = new Date();
        const current_hour = now.getHours();
        var current_min = now.getMinutes();

        if (current_min >= 30) {
            current_min = 30;
        } else {
            current_min = 0;
        }

        // number date
        const date = now.getDate();
        // day name
        const month = now.getMonth();
        const year = now.getFullYear();

        AsyncStorage
            .getItem(`${year}-${month}-${date}-${current_hour}:${current_min}`)
            .then((interval) => {
                if (interval !== null) 
                    this.setState({cust_interval_count: interval});
                }
            );
        AsyncStorage
            .getItem(`${year}-${month}-${date}`)
            .then((total) => {
                if (total !== null) 
                    this.setState({cust_tot_count: total});
                }
            );


        AsyncStorage.getItem(`startDate`).then((startDate) => {
            if (startDate === null) 
                AsyncStorage.setItem(`startDate`, `${year}-${month}-${date}`);
        });

        this.resetTime();

        const rest_day_hrs = 24 - current_hour - 1;
        const rest_day_mins = 60 - current_min;
        setTimeout(this.resetDay.bind(this), (3600000 * rest_day_hrs) + (60000 * rest_day_mins));
    }

    resetDay() {
        this.setState({cust_tot_count: 0});
        setTimeout(this.resetDay.bind(this), (3600000 * rest_day_hrs) + (60000 * rest_day_mins));
    }

    resetInterval() {
        console.log('bad');
        this.setState({cust_interval_count: 0});
        this.resetTime();
    }

    resetTime() {
        const now = new Date();
        var current_min = now.getMinutes();
        var left_overs = 0;
        if (current_min >= 30) {
            left_overs = 60 - current_min;
        } else {
            left_overs = 30 - current_min;
        }

        console.log(left_overs);
        setTimeout(this.resetInterval.bind(this), (60000 * left_overs));
    }

    saveData() {
        const now = new Date();
        //CHANGE BACK
        const current_hour = now.getHours();
        var current_min = now.getMinutes();

        if (current_min >= 30) {
            current_min = 30;
        } else {
            current_min = '00';
        }

        // number date
        const date = now.getDate();
        // day name
        const month = now.getMonth();
        const year = now.getFullYear();

        AsyncStorage.setItem(`${year}-${month}-${date}-${current_hour}:${current_min}`, `${this.state.cust_interval_count}`);
        AsyncStorage.setItem(`${year}-${month}-${date}`, `${this.state.cust_tot_count}`);
        
    }

    addOrRemove(add) {
        const now = new Date();
        const current_hour = now.getHours();
        var current_min = now.getMinutes();

        var go = true;
        
        if (this.state.startingTime === null) {
            this.state.startingTime = '8:30';
            this.state.endingTime = '20:30';

            AsyncStorage.setItem(`startingTime`, '8:30 AM');
            AsyncStorage.setItem(`endingTime`, '10:30 PM');
        }

        var semicolon_start = this.state.startingTime.indexOf(":");
        var semicolon_end = this.state.endingTime.indexOf(":");

        var starting_hr = parseInt(this.state.startingTime.substring(0, semicolon_start));
        var starting_min = parseInt(this.state.startingTime.substring(semicolon_start+1));
        var ending_hr = parseInt(this.state.endingTime.substring(0, semicolon_end));
        var ending_min = parseInt(this.state.endingTime.substring(semicolon_end+1));

        if (current_hour > starting_hr && current_hour < ending_hr) {
            // goes through
        } else if (current_hour === starting_hr){
            if (current_min >= starting_min) {
                // goes through
            } else {
                //nope
                go = false;
            }
        } else if (current_hour === ending_hr) {
            if (current_min <= ending_min) {
                // goes through
            } else {
                //nope
                go = false;
            }
        } else {
            // nope
                go = false;
        }
        

        if (go) {
            if (this.state.cust_tot_count !== 0 || add) {
                var final = this.state.cust_tot_count;
                if (add)
                    final++;
                else 
                    final--;
                    
                this.setState({
                    cust_tot_count: final
                });
                if (add)
                    this.setState({
                        cust_interval_count: ++this.state.cust_interval_count
                    }, ()=>this.saveData());
                else
                    this.setState({
                        cust_interval_count: --this.state.cust_interval_count
                    }, ()=>this.saveData());
                    
            }
        } else {
            Alert.alert(
                'Not within Range',
                'Please only add customers within the workday. If you would like to change your work hours, go to the Results page.',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
        }
    }

    addToCost() {
        this.addOrRemove(true);
    }

    remFromCost() {
        this.addOrRemove(false);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.screenProps.currentScreen === "Record" && this.props.screenProps.currentScreen !== "Record") {
            AsyncStorage.getItem(`startingTime`).then((start) => {
                if (start !== null) 
                    this.setState({startingTime: convertToMilitaryTime(start)});
                }
            );
        
            AsyncStorage.getItem(`endingTime`).then((end) => {
                if (end !== null) 
                    this.setState({endingTime: convertToMilitaryTime(end)});
                }
            );
        }
    }


    render() {
        return (
            <SafeAreaView style={main_styles.background}>
                <StatusBar barStyle='light-content'></StatusBar>
                <Text style={main_styles.customer_txt}>Today's Customers: <Text
                        style={{
                        fontFamily: 'ProximaNova-Bold'
                    }}>{this.state.cust_tot_count}</Text>
                </Text>

                <MainButton
                    title="New Costumer"
                    style={{
                    marginTop: '50%',
                    position: 'relative'
                }}
                    onPress={this
                    .addToCost
                    .bind(this)}/>
                <MainButton
                    title="Delete Costumer"
                    style={{
                    marginTop: 20
                }}
                    onPress={this
                    .remFromCost
                    .bind(this)}/>
            </SafeAreaView>
        );
    }

}
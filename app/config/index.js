import {Platform, StyleSheet} from 'react-native';

import {Dimensions} from 'react-native';
var {height, width} = Dimensions.get('window');

const main_styles = StyleSheet.create({
    container: {
        height: height > 650 ? "50%" : "45%",
        width: '100%',
    },
    chart: {
        flex: 1
    },
    main_table: {
        height: '30%', 
        position: 'absolute', 
        bottom: 15
    },
    background: {
        height: '100%',
        width: '100%',
        backgroundColor: '#4A5C94',
        alignItems: 'center'
    },
    icon: {
        height: 26,
        width: 26
    },
    customer_buttons: {
        borderRadius: 16,
        backgroundColor: '#fff',
        height: 60,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        bottom: 15,
        position: 'absolute',
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 18
    },
    openingclosing_buttons: {
        width: '46%',
        height: 45,
        margin: '1.5%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#fff'
    },
    buttonText: {
        fontFamily: 'ProximaNova-Semibold',
        fontSize: 20,
        color: '#4A5C94'
    },
    customer_txt: {
        fontFamily: 'ProximaNova-Semibold',
        fontSize: 25,
        color: '#fff',
        marginTop: '25%'
    },
    table_text: {
        color: '#fff',
        fontFamily: 'ProximaNova-Semibold',
        fontSize: height > 650 ? 18 : 12,
        margin: 5

    }
});

module.exports = {
    main_styles,
    height
};
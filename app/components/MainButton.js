import React, {Component} from 'react';

import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';

const config = require('../config');
const styles = config.main_styles;

export default class MainButton extends React.Component {
    render() {
        return (
            <TouchableHighlight
                onPress={this.props.onPress}
                style={[styles.customer_buttons, this.props.style]}
                activeOpacity={50}
                underlayColor={'#bcbcbc'}>
                <Text style={[styles.buttonText, this.props.textStyle]}>
                    {this.props.title}
                </Text>
            </TouchableHighlight>
        );
    }
}
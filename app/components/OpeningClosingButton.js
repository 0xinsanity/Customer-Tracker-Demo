import React, {Component} from 'react';

import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';

const config = require('../config');
const styles = config.main_styles;

export default class OpeningClosingButton extends React.Component {
    render() {
        return (
            <TouchableHighlight
                onPress={this.props.onPress}
                style={[styles.openingclosing_buttons, this.props.style]}
                activeOpacity={50}
                underlayColor={'#bcbcbc'}>
                <Text
                adjustsFontSizeToFit
                 minimumFontScale={0.9}
                    style={[
                    styles.buttonText, {
                        fontSize: 18,
                        
                    }
                ]}>{this.props.title}: <Text
                        style={{
                        fontFamily: 'ProximaNova-Bold'
                    }}>{this.props.time}</Text>
                </Text>
            </TouchableHighlight>
        );
    }
}
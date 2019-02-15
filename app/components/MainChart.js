import React, {Component} from 'react';
import {LineChart} from 'react-native-charts-wrapper';
import {processColor} from 'react-native';

const config = require('../config');
const styles = config.main_styles;

export default class MainChart extends LineChart {
    render() {
        return (
            <LineChart
            style={[styles.chart, this.props.style]}
            data={this.props.data}
            chartDescription={{text: ''}}
            textColor={processColor('white')}
            legend={{
                custom: {
                  colors: [processColor('transparent')],
                  labels: ['']
                }}}
            xAxis={this.props.xAxis}
            yAxis={{
                right: {
                    enabled:false,
                },
                left: {
                    textColor: processColor('white'),
                    drawGridLines:false,
                    axisMinimum:0,
                    labelCount: this.props.greatestNum
                }
            }}
            
            drawGridBackground={false}
            borderColor={processColor('white')}
            borderWidth={2}
            drawBorders={true}
            
            touchEnabled={false}
            dragEnabled={false}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={false}
            doubleTapToZoomEnabled={false}

            dragDecelerationEnabled={false}
            dragDecelerationFrictionCoef={0.99}

            keepPositionOnRotation={false}
            onChange={(event) => console.log(event.nativeEvent)}
    />
        );
    }
} 
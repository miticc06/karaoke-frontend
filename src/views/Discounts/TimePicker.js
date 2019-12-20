import { DatePicker } from 'antd'
import React from 'react'
import moment from 'moment'

export class TimePicker extends React.Component {
  state = {
    startValue: this.props.startTime,
    endValue: this.props.endTime,
    endOpen: false
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    })

    if (field === 'startValue') {
      this.props.setStartTime(new Date(`${value}`).getTime())
    } else if (field === 'endValue') {
      this.props.setEndTime(new Date(`${value}`).getTime())
    }
  };

  onStartChange = value => {
    this.onChange('startValue', value)
  };

  onEndChange = value => {
    this.onChange('endValue', value)
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open })
  };

  render () {
    const { startValue, endValue, endOpen } = this.state
    console.log(startValue)
    return (
      <div>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format='DD-MM-YYYY HH:mm'
          value={startValue}
          placeholder='Bắt đầu'
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          showTime
          format='DD-MM-YYYY HH:mm'
          value={endValue}
          placeholder='Kết thúc'
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          style={{ marginLeft: 10 }}
        />
      </div>
    )
  }
}
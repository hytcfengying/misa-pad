/**
 * @file personAccount/IdRangePicker.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { DatePicker } from 'antd';
import { autobind } from 'core-decorators';

import pickerStyle from './idRangePicker.less';

export default class IdRangePicker extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
  }

  @autobind
  onChange(field, value) {
    this.setState({
      [field]: value,
    }, this.triggerChange);
  }

  @autobind
  onStartChange(value) {
    this.onChange('startValue', value);
  }

  @autobind
  onEndChange(value) {
    this.onChange('endValue', value);
  }

  @autobind
  disabledStartDate(startValue) {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  @autobind
  disabledEndDate(endValue) {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  @autobind
  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  @autobind
  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }

  @autobind
  triggerChange() {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state));
    }
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div className={pickerStyle.pickerWrapper}>
        <DatePicker
          disabledDate={this.disabledStartDate}
          format="YYYY-MM-DD"
          value={startValue}
          placeholder="开始时间"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          showTime={false}
          showToday={false}
        />
        <div className={pickerStyle.pickerLink}>至</div>
        <DatePicker
          disabledDate={this.disabledEndDate}
          format="YYYY-MM-DD"
          value={endValue}
          placeholder="结束时间"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          showTime={false}
          showToday={false}
        />
      </div>
    );
  }
}

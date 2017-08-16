/**
 * @file personAccount/CodeInput.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { Input, message } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import codeStyle from './codeInput.less';

export default class CodeInput extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func,
    cellGet: PropTypes.func.isRequired,
    getCerCodeFunc: PropTypes.func.isRequired,
    verifyCode: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
  }

  static defaultProps = {
    onChange: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      code: '',
      countdown: '获取验证码',
      available: true,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  @autobind
  countDown() {
    // message.error(getMessage(msg), 2);
    const { cellGet, getCerCodeFunc } = this.props;
    const cell = cellGet();
    const { available } = this.state;
    if (available) {
      if (cell.cellNumber &&
        cell.cellConfirm &&
        _.isEmpty(cell.numberCheck) &&
        _.isEmpty(cell.confirmCheck)
      ) {
        getCerCodeFunc({
          mobile: cell.cellNumber,
          yyb: cell.yyb,
          callback: this.counting,
        });
      } else {
        message.error('请填写正确的手机号码', 2);
      }
    }
  }

  @autobind
  counting() {
    let count = 60;
    this.setState({ countdown: '60秒后可重发', available: false }, () => {
      this.interval = setInterval(() => {
        count--;
        if (count > 0) {
          this.setState({ countdown: `${count}秒后可重发` });
        }
        if (count <= 0) {
          this.setState({ countdown: '获取验证码', available: true });
          clearInterval(this.interval);
        }
      }, 1000);
    });
  }

  @autobind
  handleCodeChange(e) {
    const code = e.target.value;
    this.setState({ code }, this.triggerChange);
  }

  @autobind
  handleCodeBlur() {
    this.props.verifyCode();
  }

  @autobind
  triggerChange() {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state));
    }
  }

  @autobind
  returnChangeState(key) {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return false;
    }
    let state = true;
    returnOpinion.map((item) => {
      if (item.zd === key) {
        state = false;
      }
      return state;
    });
    return state;
  }

  render() {
    const { countdown } = this.state;
    const codeBtn = (
      <div className={codeStyle.codeBtn} onClick={this.countDown}>
        {countdown}
      </div>
    );
    const codeDisBtn = (
      <div className={codeStyle.codeDisBtn}>
        {countdown}
      </div>
    );
    const btnHtml = this.returnChangeState('LXXX') ? codeDisBtn : codeBtn;
    return (
      <div className={codeStyle.codeWrapper}>
        <Input
          id="code"
          className={codeStyle.formInput}
          maxLength="6"
          onChange={this.handleCodeChange}
          onBlur={this.handleCodeBlur}
          disabled={this.returnChangeState('LXXX')}
        />
        {btnHtml}
      </div>
    );
  }
}

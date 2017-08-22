/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import styles from './investDetail.less';

export default class InvestList extends PureComponent {

  static propTypes = {
    information: PropTypes.object,
    push: PropTypes.func.isRequired,
    changeInvestList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    readFlag: PropTypes.bool.isRequired,
    type: PropTypes.string,
  }

  static defaultProps = {
    information: {},
    type: 'personAccount',
  }

  constructor(props) {
    super(props);

    this.state = {
      countdown: props.readFlag ? 0 : this.props.information.ydsj || 0,
    };
  }

  componentWillMount() {
    const { information } = this.props;
    if (information && information.ydsj > 0) {
      this.countdown();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { information, readFlag } = nextProps;
    console.log(information.bt);
    if (information.ydsj > 0 && !this.interval) {
      this.setState({ countdown: (readFlag ? 0 : information.ydsj) }, () => {
        this.countdown();
      });
    }
  }
  componentWillUnmount() {
    const { changeInvestList, location: { query: { investKey } } } = this.props;
    const { countdown } = this.state;
    // 关闭定时器
    if (this.interval) {
      clearInterval(this.interval);
    }
    // 标记为已读
    if (countdown < 1) {
      changeInvestList({ index: investKey });
    }
  }

  @autobind
  handleClose() {
    const { countdown } = this.state;
    if (countdown > 0) {
      return;
    }
    const { push, type } = this.props;
    push(`/${type}/invest`);
  }

  @autobind
  countdown() {
    // 倒计时开始
    let count = this.state.countdown;
    this.setState({ countdown: count-- });
    this.interval = setInterval(() => {
      if (this.state.countdown > 0) {
        this.setState({ countdown: count-- });
      }
      if (this.state.countdown <= 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  render() {
    const { information } = this.props;
    const { countdown } = this.state;
    const isCheck = countdown > 0 ? styles.activited : '';
    return (
      <section className={styles.investDetail}>
        <div className={styles.investDetailTitle}>
          {information.bt}
          {
            this.state.countdown > 0 ?
              <span className={styles.spanCountdown}>倒计时<b> {this.state.countdown} </b>秒</span> :
              ''
          }
        </div>
        <article className={styles.article}>
          <div className="clearfix" dangerouslySetInnerHTML={{ __html: information.zw }} />
          <Button
            type="primary"
            htmlType="submit"
            className={`${styles.checkBut} ${isCheck}`}
            onClick={this.handleClose}
          >
            <span className={styles.read} />已阅读
          </Button>
        </article>
      </section>
    );
  }
}


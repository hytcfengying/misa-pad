/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import styles from './investLi.less';

export default class InvestList extends PureComponent {

  static propTypes = {
    item: PropTypes.object,
    push: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  }

  static defaultProps = {
    item: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  @autobind
  handleDetail() {
    const { push, index } = this.props;
    push(`/personAccount/invest/detail?investKey=${index}`);
  }

  render() {
    const { item } = this.props;
    return (
      <li className={styles.investLi} onClick={this.handleDetail}>
        {
          item.read ?
            '' : <span className={styles.unread} />
        }
        {item.bt}
        <span className={styles.iconRed}>*</span>
      </li>
    );
  }
}

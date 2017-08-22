/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import styles from './investList.less';

import InvestLi from './InvestLi';

export default class InvestList extends PureComponent {

  static propTypes = {
    list: PropTypes.array,
    push: PropTypes.func.isRequired,
    type: PropTypes.string,
  }

  static defaultProps = {
    list: [],
    type: 'personAccount',
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  filterList() {
    const { list } = this.props;
    list.sort((a, b) => a.indexId > b.indexId);
    const arr = [];
    list.forEach((item) => {
      if (item.read) {
        arr.push(item.indexId);
      }
    });
    arr.forEach((item) => {
      const index = _.findIndex(list, { indexId: item });
      list.splice(8, 0, list[index]);
      list.splice(index, 1);
    });
  }

  render() {
    const { list, push, type } = this.props;
    this.filterList();
    return (
      <section className={styles.investList}>
        <div className={styles.investListTip}>
          <i className={styles.investListSpeaker} />
          请认真阅读以下协议及其书函，带<i className={styles.iconRequire}> * </i>号为必读且阅读时间不少于系统要求，完成后方可进入下一步！
        </div>
        <ul className={styles.investUl}>
          {
            list.map(item =>
              <InvestLi
                key={item.indexId}
                push={push}
                item={item}
                index={item.indexId}
                type={type}
              />,
            )
          }
        </ul>
      </section>
    );
  }
}

/**
 * @file identity/numResult.js
 * @author zzc
 */
import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import styles from './indTab.less';

export default class numResult extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    numShow: PropTypes.bool.isRequired,
    numQuery: PropTypes.array,
  }

  static defaultProps = {
    numQuery: [],
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { numQuery, numShow } = this.props;
    const showClass = numShow ? styles.showClass : '';
    const numResultList = _.isEmpty(numQuery) ?
      null :
      numQuery.map((item, index) =>
        <tr key={`customer-${index + 1}`}>
          <td>{item.khmc}</td>
          <td>{item.zjlb_note}</td>
          <td>{item.zjbh}</td>
          <td>{item.zhlb_note}</td>
          <td>{item.zqzh}</td>
          <td>{item.zqzhzt_note}</td>
        </tr>,
      );
    const tableOne = _.isEmpty(numQuery) ?
      (<div className={styles.searchNone}>
        <img alt="" src="../../../static/img/img_none1.png" />
        <p>查无数据</p>
        <p>无符合此信息数据，请查正后再继续...</p>
      </div>) :
      (<table cellSpacing="0" className={styles.numTable}>
        <thead>
          <tr>
            <th>中登股东姓名</th>
            <th>证件类别</th>
            <th>证件编号</th>
            <th>账户类别</th>
            <th>证券账户</th>
            <th>账户状态</th>
          </tr>
        </thead>
        <tbody>
          {numResultList}
        </tbody>
      </table>);

    return (
      <div className={`${styles.indResultTable} ${showClass}`}>
        <p className={styles.top}><span>中登查询结果</span></p>
        <div className={styles.resuTable}>
          {tableOne}
        </div>
      </div>
    );
  }
}


/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './detail.less';

export default class identity extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    csdcQuery: PropTypes.array.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  @autobind
  getDetail() {
    const { location: { query }, csdcQuery } = this.props;
    let obj = {};
    if (query.id) {
      obj = _.find(csdcQuery, { id: _.parseInt(query.id) });
    }
    return {
      detail: obj,
      pathname: query.path,
    };
  }

  render() {
    const obj = this.getDetail();
    const { detail, pathname } = obj;
    return (
      <div className={styles.detail}>
        <table className={styles.tableArea}>
          {
            pathname === 'codeSearch' ?
              <tbody>
                <tr>
                  <td>处理标志</td>
                  <td>
                    {detail.clbz_note || detail.clbz}
                  </td>
                  <td>一码通号</td>
                  <td colSpan="3" >{detail.ymth}</td>
                </tr>
                <tr>
                  <td>结果说明</td>
                  <td>{detail.jgsm}</td>
                  <td>回报结果说明</td>
                  <td>{detail.hbjgsm}</td>
                </tr>
                <tr>
                  <td width="10%">回报时间</td>
                  <td width="40%">{detail.hbsj}</td>
                  <td width="10%">账户状态</td>
                  <td>{detail.ymtzt}</td>
                </tr>
                <tr>
                  <td>开户方式</td>
                  <td>{detail.khfs_note || detail.khfs}</td>
                  <td>开户日期</td>
                  <td>{detail.khrq}</td>
                </tr>
                <tr>
                  <td>开户机构名称</td>
                  <td>{detail.khjgmc}</td>
                  <td>销户日期</td>
                  <td>{detail.xhrq}</td>
                </tr>
                <tr>
                  <td>销户机构名称</td>
                  <td>{detail.xhjgmc}</td>
                  <td>客户名称</td>
                  <td>{detail.khmc}</td>
                </tr>
                <tr>
                  <td>证件类别</td>
                  <td>{detail.zjlb_note || detail.zjlb}</td>
                  <td>证件号码</td>
                  <td>{detail.zjbh}</td>
                </tr>
              </tbody> : ''
          }
          {
            pathname === 'stockSearch' ?
              <tbody>
                <tr>
                  <td>处理标志</td>
                  <td>
                    {detail.clbz_note || detail.clbz}
                  </td>
                  <td>结果说明</td>
                  <td>{detail.jgsm}</td>
                </tr>
                <tr>
                  <td>回报结果说明</td>
                  <td>{detail.hbjgsm}</td>
                  <td>证件号码</td>
                  <td>{detail.zjbh}</td>
                </tr>
                <tr>
                  <td width="10%">回报时间</td>
                  <td width="40%">{detail.hbsj}</td>
                  <td width="10%">账户类别</td>
                  <td>{detail.zhlb_note || detail.zhlb}</td>
                </tr>
                <tr>
                  <td width="10%">证券账号</td>
                  <td width="40%">{detail.zqzh}</td>
                  <td width="10%">账户状态</td>
                  <td>{detail.zqzhzt_note || detail.zqzhzt}</td>
                </tr>
                <tr>
                  <td width="10%">一码通号</td>
                  <td width="40%">{detail.ymth}</td>
                  <td width="10%">一码通状态</td>
                  <td>{detail.ymtzt_note || detail.ymtzt}</td>
                </tr>
                <tr>
                  <td>开户方式</td>
                  <td>{detail.khfs_note || detail.khfs}</td>
                  <td>开户日期</td>
                  <td>{detail.khrq}</td>
                </tr>
                <tr>
                  <td>开户机构名称</td>
                  <td>{detail.khjgmc}</td>
                  <td>销户日期</td>
                  <td>{detail.xhrq}</td>
                </tr>
                <tr>
                  <td>销户机构名称</td>
                  <td>{detail.xhjgmc}</td>
                  <td>关联关系确认标识</td>
                  <td>{detail.glgxbs}</td>
                </tr>
                <tr>
                  <td>确认机构名称</td>
                  <td>{detail.qrjgmc}</td>
                  <td>不合格标识</td>
                  <td>{detail.bhgbs}</td>
                </tr>
                <tr>
                  <td>不合格交易限制</td>
                  <td>{detail.qrjgmc}</td>
                  <td>不合格原因类别</td>
                  <td>{detail.bhgyylb}</td>
                </tr>
                <tr>
                  <td>客户名称</td>
                  <td>{detail.khmc}</td>
                  <td>证件类别</td>
                  <td>{detail.zjlb_note || detail.zjlb}</td>
                </tr>
              </tbody> : ''
          }
          {
            pathname === 'relationSearch' ?
              <tbody>
                <tr>
                  <td>处理标志</td>
                  <td>
                    {detail.clbz_note || detail.clbz}
                  </td>
                  <td>结果说明</td>
                  <td>{detail.jgsm}</td>
                </tr>
                <tr>
                  <td>回报结果说明</td>
                  <td>{detail.hbjgsm}</td>
                  <td>回报时间</td>
                  <td>{detail.hbsj}</td>
                </tr>
                <tr>
                  <td>证券账号</td>
                  <td>{detail.zjzh}</td>
                  <td width="10%">账户类别</td>
                  <td>{detail.zhlb_note || detail.zhlb}</td>
                </tr>
                <tr>
                  <td>一码通号</td>
                  <td colSpan="3">{detail.ymth}</td>
                </tr>
              </tbody> : ''
          }
          {
            pathname === 'infoSearch' ?
              <tbody>
                <tr>
                  <td>处理标志</td>
                  <td>
                    {detail.clbz_note || detail.clbz}
                  </td>
                  <td>结果说明</td>
                  <td>{detail.jgsm}</td>
                </tr>
                <tr>
                  <td>回报结果说明</td>
                  <td>{detail.hbjgsm}</td>
                  <td width="10%">回报时间</td>
                  <td width="40%">{detail.hbsj}</td>
                </tr>
                <tr>
                  <td width="10%">账户类别</td>
                  <td>{detail.zhlb_note || detail.zhlb}</td>
                  <td>证券账号</td>
                  <td>{detail.zqzh}</td>
                </tr>
                <tr>
                  <td>证件编号</td>
                  <td>{detail.zjbh}</td>
                  <td>一码通号</td>
                  <td>{detail.ymth}</td>
                </tr>
                <tr>
                  <td>证件类别</td>
                  <td>{detail.zjlb_note || detail.zjlb}</td>
                  <td>交易单元</td>
                  <td>{detail.jydy}</td>
                </tr>
                <tr>
                  <td>代理机构</td>
                  <td>{detail.khjgdm_note || detail.khjgdm}</td>
                  <td>营业部编码</td>
                  <td>{detail.yybbm}</td>
                </tr>
                <tr>
                  <td>申报券商</td>
                  <td>{detail.khjgmc}</td>
                  <td>代理网点</td>
                  <td>{detail.khwddm}</td>
                </tr>
                <tr>
                  <td>指定交易券商</td>
                  <td>{detail.zdjgmc}</td>
                  <td>申报营业部</td>
                  <td>{detail.khwdmc}</td>
                </tr>
                <tr>
                  <td>业务日期</td>
                  <td>{detail.ywrq}</td>
                  <td>申报日期</td>
                  <td>{detail.sysbrq}</td>
                </tr>
                <tr>
                  <td>使用信息报送标识</td>
                  <td colSpan="3" >{detail.ywpzbs}</td>
                </tr>
              </tbody> : ''
          }
          {
            pathname === 'partnerSearch' ?
              <tbody>
                <tr>
                  <td width="10%">处理标志</td>
                  <td width="40%">
                    {detail.clbz_note || detail.clbz}
                  </td>
                  <td width="10%">结果说明</td>
                  <td width="40%">{detail.jgsm}</td>
                </tr>
                <tr>
                  <td>回报结果说明</td>
                  <td>{detail.hbjgsm}</td>
                  <td>回报时间</td>
                  <td>{detail.hbsj}</td>
                </tr>
                <tr>
                  <td width="10%">一码通号</td>
                  <td>{detail.ymth}</td>
                  <td>合伙人全称</td>
                  <td>{detail.khmc}</td>
                </tr>
                <tr>
                  <td>合伙人证件类别</td>
                  <td>{detail.zjlb_note || detail.zjlb}</td>
                  <td>合伙人证件编号</td>
                  <td>{detail.zjbh}</td>
                </tr>
                <tr>
                  <td>合伙人证件截止日期</td>
                  <td>{detail.zjjzrq}</td>
                  <td>合伙人国籍/地区代码</td>
                  <td>{detail.gjdm}</td>
                </tr>
                <tr>
                  <td>合伙人责任承担方式</td>
                  <td colSpan="3" >{detail.hhcdfs}</td>
                </tr>
              </tbody> : ''
          }
        </table>
      </div>
    );
  }
}

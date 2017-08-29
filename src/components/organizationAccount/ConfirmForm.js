/**
 * @file identity/ConfirmForm.js
 * @author zzc
 */
import React, { PureComponent, PropTypes } from 'react';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import { onlyShowImgFile } from '../../utils/cordova';

import styles from '../personAccount/inforDetail.less';

export default class infor extends PureComponent {

  static propTypes = {
    inforData: PropTypes.object,
    stepCacheData: PropTypes.array.isRequired,
    accessState: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    inforData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  showImgBox = item => () => {
    const arg = [
      item.item.FILEPATH,
      item.item.YXLXMC,
    ];
    onlyShowImgFile(
      arg,
      result => console.log(result),
      err => console.log(err),
    );
  }

  khNote(e) {
    switch (e) {
      case 0:
      case '0':
        return '不开户';
      case 1:
      case '1':
        return '新开A股账户';
      case 2:
      case '2':
        return '新开场内基金账户';
      case 9:
      case '9':
        return '已开';
      default:
        return '';
    }
  }

  render() {
    const { stepCacheData, inforData = {}, accessState } = this.props;
    const seeNone = accessState ? '' : styles.none;
    const gdkhShNote = this.khNote(inforData.gdkh_sh);
    const gdkhSzNote = this.khNote(inforData.gdkh_sz);
    const stepObj = _.find(stepCacheData, { key: 'YXSM' });
    let imageList = [];
    if (stepObj) {
      imageList = JSON.parse(stepObj.value).YXSTR;
    }
    return (
      <div className={styles.tableBox}>
        <p className={`${styles.boxTop} ${seeNone}`}><span>开户申请资料确认</span></p>
        <div className={styles.tableDeta}>
          <h5>风险测评结果</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>测评类型</th>
                  <td>{inforData.fxpclx_note}</td>
                  <th>投资期限</th>
                  <td>{inforData.tzqx_note}</td>
                </tr>
                <tr>
                  <th>测评类型说明</th>
                  <td colSpan="3">{inforData.fxpclxsm}</td>
                </tr>
                <tr>
                  <th>投资品种</th>
                  <td colSpan="3">{inforData.tzpz_note}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>证件信息</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>证件类别</th>
                  <td>{inforData.zjlb_note}</td>
                  <th>证件编号</th>
                  <td>{inforData.zjbh}</td>
                </tr>
                <tr>
                  <th>机构全称</th>
                  <td colSpan="3">{inforData.khqc}</td>
                </tr>
                <tr>
                  <th>证件地址</th>
                  <td colSpan="3">{inforData.zjdz}</td>
                </tr>
                <tr>
                  <th>发证机关</th>
                  <td>{inforData.zjfzjg}</td>
                  <th>证件有效期</th>
                  <td>{inforData.zjqsrq}~{inforData.zjjzrq}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>开户代理人</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>姓名</th>
                  <td>{inforData.jbrxm}</td>
                  <th>性别</th>
                  <td>{inforData.jbrxb_note}</td>
                </tr>
                <tr>
                  <th>证件类别</th>
                  <td>{inforData.jbrzjlb_note}</td>
                  <th>证件编号</th>
                  <td>{inforData.jbrzjbh}</td>
                </tr>
                <tr>
                  <th>证件有效期</th>
                  <td>{inforData.jbrzjqsrq}~{inforData.jbrzjjzrq}</td>
                  <th>出生日期</th>
                  <td>{inforData.csrq}</td>
                </tr>
                <tr>
                  <th>手机号码</th>
                  <td>{inforData.jbrsj}</td>
                  <th>联系电话</th>
                  <td>{inforData.jbrdh}</td>
                </tr>
                <tr>
                  <th>国籍</th>
                  <td>{inforData.gj_note}</td>
                  <th>邮编</th>
                  <td>{inforData.yzbm}</td>
                </tr>
                <tr>
                  <th>联系地址</th>
                  <td colSpan="3">{inforData.dz}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>基本信息</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>机构简称</th>
                  <td colSpan="3">{inforData.khxm}</td>
                </tr>
                <tr>
                  <th>英文名称</th>
                  <td>{inforData.ywmc}</td>
                  <th>国籍</th>
                  <td>{inforData.gj_note}</td>
                </tr>
                <tr>
                  <th>企业类型</th>
                  <td>{inforData.qyxz_sh_note}</td>
                  <th>行业类型</th>
                  <td>{inforData.hydm_sh_note}</td>
                </tr>
                <tr>
                  <th>机构类别</th>
                  <td>{inforData.jglb_note}</td>
                  <th>私募基金管理人编码</th>
                  <td>{inforData.cby1}</td>
                </tr>
                <tr>
                  <th>特别说明</th>
                  <td colSpan="3">{inforData.tbsm}</td>
                </tr>
                <tr>
                  <th>国有属性</th>
                  <td>{inforData.gysx_note}</td>
                  <th>上市属性</th>
                  <td>{inforData.sssx_note}</td>
                </tr>
                <tr>
                  <th>资本属性</th>
                  <td>{inforData.zbsx_note}</td>
                  <th>注册日期</th>
                  <td>{inforData.jgzcrq}</td>
                </tr>
                <tr>
                  <th>注册地址</th>
                  <td colSpan="3">{inforData.jgzcdz}</td>
                </tr>
                <tr>
                  <th>经营范围</th>
                  <td>{inforData.jgjyfw}</td>
                  <th>注册资本币种</th>
                  <td>{inforData.jgzcbz}</td>
                </tr>
                <tr>
                  <th>注册资本（万）</th>
                  <td>{inforData.jgzczb}</td>
                  <th>联系地址</th>
                  <td>{inforData.dz}</td>
                </tr>
                <tr>
                  <th>邮政编码</th>
                  <td>{inforData.yzbm}</td>
                  <th>联系电话</th>
                  <td>{inforData.jggsdh}</td>
                </tr>
                <tr>
                  <th>传真</th>
                  <td>{inforData.cz}</td>
                  <th>电子邮箱</th>
                  <td>{inforData.email}</td>
                </tr>
                <tr>
                  <th>税务登记证</th>
                  <td colSpan="3">{inforData.gsswdjz}</td>
                </tr>
                <tr>
                  <th>组织机构代码证编号</th>
                  <td>{inforData.zzjgdm}</td>
                  <th>组织机构代码证有效期</th>
                  <td>{inforData.zzjgdmqsrq}~{inforData.zzjgdmjzrq}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>法定代理人</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>姓名</th>
                  <td>{inforData.frdbxm}</td>
                  <th>证件类别</th>
                  <td>{inforData.frdbzjlb_note}</td>
                </tr>
                <tr>
                  <th>证件编号</th>
                  <td>{inforData.frdbzjbh}</td>
                  <th>证件有效期</th>
                  <td>{inforData.frdbzjqsrq}~{inforData.frdbzjjzrq}</td>
                </tr>
                <tr>
                  <th>联系电话</th>
                  <td colSpan="3">{inforData.frdbdh}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>控股股东</h5>
          <div className={styles.resuTable}>
            <table cellSpacing="0" className={styles.numTable}>
              <thead>
                <tr>
                  <th>股东名称</th>
                  <th>证件类别</th>
                  <th>证件编号</th>
                  <th>证件有效期</th>
                  <th>电子邮箱</th>
                  <th>国籍</th>
                  <th>股东类型</th>
                  <th>责任承担方式</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>股东名称</td>
                  <td>证件类别</td>
                  <td>证件编号</td>
                  <td>证件有效期</td>
                  <td>电子邮箱</td>
                  <td>国籍</td>
                  <td>股东类型</td>
                  <td>责任承担方式</td>
                </tr>
                <tr>
                  <td>股东名称</td>
                  <td>证件类别</td>
                  <td>证件编号</td>
                  <td>证件有效期</td>
                  <td>电子邮箱</td>
                  <td>国籍</td>
                  <td>股东类型</td>
                  <td>责任承担方式</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>适当性</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0" className={styles.sdxTable}>
              <tbody>
                <tr>
                  <th>不良诚信记录</th>
                  <td colSpan="3">{inforData.cxjl_note || '无'}</td>
                </tr>
                <tr>
                  <th>实际控制人姓名</th>
                  <td colSpan="3">{inforData.sjkzrxm}</td>
                </tr>
                <tr>
                  <th>实际控制人证件类别</th>
                  <td>{inforData.sjkzrzjlb_note}</td>
                  <th>实际控制人证件编号</th>
                  <td>{inforData.sjkzrzjbh}</td>
                </tr>
                <tr>
                  <th>交易受益人关系</th>
                  <td>{inforData.jysyrgx_note}</td>
                  <th>交易受益人姓名</th>
                  <td>{inforData.jysyrxm}</td>
                </tr>
                <tr>
                  <th>交易受益人证件类别</th>
                  <td>{inforData.jysyrzjlb_note}</td>
                  <th>交易受益人证件编号</th>
                  <td>{inforData.jysyrzjbh}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>反洗钱</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>反洗钱风险等级</th>
                  <td colSpan="3">{inforData.xqfxdj_note}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>资金开户</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>佣金套餐</th>
                  <td colSpan="3">{inforData.yjtc_note}</td>
                </tr>
                <tr>
                  <th>允许币种</th>
                  <td colSpan="3">{inforData.yxbz_note}</td>
                </tr>
                <tr>
                  <th>委托方式</th>
                  <td colSpan="3">{inforData.wtfs_note}</td>
                </tr>
                <tr>
                  <th>客户权限</th>
                  <td colSpan="3">{inforData.khqx_note}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>股东开户</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>沪A股东开户</th>
                  <td>{gdkhShNote}</td>
                  <th>沪A股东账户</th>
                  <td>{inforData.gddj_sh}</td>
                </tr>
                <tr>
                  <th>深A股东开户</th>
                  <td>{gdkhSzNote}</td>
                  <th>深A股东账户</th>
                  <td>{inforData.gddj_sz}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>银行账号</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>存管银行</th>
                  <td>{inforData.cgyh_note}</td>
                  <th>存管指定方式</th>
                  <td>{inforData.cgyhzh ? '直接指定' : '预指定'}</td>
                </tr>
                <tr>
                  <th>银行账号</th>
                  <td colSpan="3">{inforData.cgyhzh}</td>
                </tr>
                <tr>
                  <th>证件类别</th>
                  <td />
                  <th>证件编号</th>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>基金公司</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>基金公司</th>
                  <td colSpan="3">{inforData.sqjjzh}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>影像资料</h5>
          <div className={styles.imgDetailBox}>
            {
              imageList.map(item =>
                <span
                  key={item.YXLX}
                  className={`${styles.imgLi} ${item.FILEPATH ? '' : styles.noPath}`}
                  onClick={this.showImgBox({ item })}
                >
                  {item.YXLXMC}
                </span>,
              )
            }
          </div>
        </div>
      </div>
    );
  }
}


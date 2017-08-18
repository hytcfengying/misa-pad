/**
 * @file identity/inforDetail.js
 * @author zzc
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Button } from 'antd';
import { onlyShowImgFile } from '../../utils/cordova';
import ImgDetail from './inforImageDetatil';
import styles from './inforDetail.less';

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
      isImgShow: false,
    };
  }

  componentDidMount() {
  }

  showImgBox = item => () => {
    // this.setState({ isImgShow: true });
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

  @autobind
  hideImgbox() {
    this.setState({ isImgShow: false });
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
    const { isImgShow } = this.state;
    const isShowClass = isImgShow ? styles.isShow : '';
    const seeNone = accessState ? '' : styles.none;
    const gdkhShNote = this.khNote(inforData.gdkh_sh);
    const gdkhSzNote = this.khNote(inforData.gdkh_sz);
    const stepObj = _.find(stepCacheData, { key: 'YXSM' });
    let imageList = [];
    if (stepObj) {
      imageList = JSON.parse(stepObj.value).YXSTR;
    }
    const khzp = inforData.khzpImg ?
      `data:image/jpeg;base64,${inforData.khzpImg}` :
      '../../../static/img/icon_user_m2.png';
    return (
      <div className={styles.tableBox}>
        <p className={`${styles.boxTop} ${seeNone}`}><span>信息确认</span></p>
        <div className={styles.tableDeta}>
          <h5>身份信息</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0" className={styles.userInfor}>
              <tbody>
                <tr>
                  <td rowSpan="3" className={styles.imgBox}>
                    {
                      inforData.khzpImg ?
                        <span><img alt="头像" src={khzp} /></span> :
                        <span className={styles.iconDefault} />
                    }
                  </td>
                  <th>姓名</th>
                  <td>{inforData.khqc}</td>
                  <th>客户号</th>
                  <td>{inforData.khh}</td>
                </tr>
                <tr>
                  <th>证件类别</th>
                  <td>{inforData.zjlb_note}</td>
                  <th>证件编号</th>
                  <td>{inforData.zjbh}</td>
                </tr>
                <tr>
                  <th>性别</th>
                  <td>{inforData.xb_note}</td>
                  <th>出生日期</th>
                  <td>{inforData.csrq}</td>
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
                  <th>证件签发机关</th>
                  <td>{inforData.zjfzjg}</td>
                  <th>证件有效期</th>
                  <td>{inforData.zjqsrq}至{inforData.zjjzrq}</td>
                </tr>
                <tr>
                  <th>证件地址</th>
                  <td colSpan="3">{inforData.zjdz}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>联系方式</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0">
              <tbody>
                <tr>
                  <th>联系地址</th>
                  <td colSpan="3">{inforData.province_note}-
                    {inforData.city_note}-
                    {inforData.dz}</td>
                </tr>
                <tr>
                  <th>手机号码</th>
                  <td>{inforData.sj}</td>
                  <th>邮政编码</th>
                  <td>{inforData.yzbm}</td>
                </tr>
                <tr>
                  <th>电子邮箱</th>
                  <td>{inforData.email}</td>
                  <th>固定号码</th>
                  <td>{inforData.dh}</td>
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
                  <th>职业</th>
                  <td>{inforData.zydm_note}</td>
                  <th>学历</th>
                  <td>{inforData.xl_note}</td>
                </tr>
                <tr>
                  <th>国籍</th>
                  <td>{inforData.gj_note}</td>
                  <th>民族</th>
                  <td>{inforData.zjlb === '18' ? '' : inforData.mzdm_note}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableDeta}>
          <h5>风险测评</h5>
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
          <h5>适当性</h5>
          <div className={styles.tableDetaBox}>
            <table cellSpacing="0" className={styles.sdxTable}>
              <tbody>
                <tr>
                  <th>诚信记录</th>
                  <td colSpan="3">{inforData.cxjl_note}</td>
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
        <div className={`${styles.imgBoxClass} ${isShowClass}`}>
          <div className={styles.top}>
            <Button type="primary" htmlType="submit" className={styles.returnBut} onClick={this.hideImgbox}>x</Button>
          </div>
          <ImgDetail />
        </div>
      </div>
    );
  }
}


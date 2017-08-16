/**
 * @file identity/indExaResult.js
 * @author zzc
 */
import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import styles from './indTab.less';

export default class indResult extends PureComponent {

  static propTypes = {
    resultDataDetail: PropTypes.object,
    resultDataDetail2: PropTypes.object,
    location: PropTypes.object.isRequired,
    tableSelect: PropTypes.number.isRequired,
    resultShow: PropTypes.bool.isRequired,
    imgBase64str: PropTypes.string,
  }

  static defaultProps = {
    resultDataDetail: {},
    resultDataDetail2: {},
    imgBase64str: '',
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { resultDataDetail = {}, resultDataDetail2 = {}, tableSelect, resultShow } = this.props;
    const showClass = resultShow ? styles.showClass : '';
    const imgSrc = this.props.imgBase64str ?
      `data:image/jpeg;base64,${this.props.imgBase64str}` :
      '../../../static/img/icon_user_m2.png';
    const imgSrcOne = resultDataDetail.Bmpfile ?
      `data:image/jpeg;base64,${resultDataDetail.Bmpfile}` :
      imgSrc;
    const tableOne = _.isEmpty(resultDataDetail) ?
      (<div className={styles.searchNone}>
        <img alt="" src="../../../static/img/img_none1.png" />
        <p>查无数据</p>
        <p>无符合此信息数据，请查正后再继续...</p>
      </div>) :
      (<table cellSpacing="0">
        <tbody>
          <tr>
            <td rowSpan="3" className={styles.imgBox}>
              <span><img alt="头像" src={imgSrcOne} /></span>
            </td>
            <th>姓名</th>
            <td>{resultDataDetail.Name}</td>
            <th>身份证号码</th>
            <td>{resultDataDetail.ID}</td>
          </tr>
          <tr>
            <th>性别</th>
            <td>{resultDataDetail.Gender}</td>
            <th>出生日期</th>
            <td>{resultDataDetail.Birthday}</td>
          </tr>
          <tr>
            <th>民族</th>
            <td>{resultDataDetail.Nation}</td>
            <th>签证机关</th>
            <td>{resultDataDetail.Department}</td>
          </tr>
          <tr>
            <th>地址</th>
            <td colSpan="4">{resultDataDetail.Address}</td>
          </tr>
          <tr>
            <th>有效期</th>
            <td colSpan="4">{resultDataDetail.StartDate}
              至{resultDataDetail.EndDate}</td>
          </tr>
        </tbody>
      </table>);
    const tableTwo = _.isEmpty(resultDataDetail2) ?
      (<div className={styles.searchNone}>
        <img alt="" src="../../../static/img/img_none1.png" />
        <p>查无数据</p>
        <p>无符合此信息数据，请查正后再继续...</p>
      </div>) :
      (<table cellSpacing="0">
        <tbody>
          <tr>
            <td rowSpan="3" className={styles.imgBox}>
              {
                this.props.imgBase64str ?
                  <span><img alt="头像" src={imgSrc} /></span> :
                  <span className={styles.iconDefault} />
              }
            </td>
            <th>姓名</th>
            <td>{resultDataDetail2.callStep ? resultDataDetail2.o_xm : resultDataDetail2.sqxm}</td>
            <th>民族</th>
            <td>
              {resultDataDetail2.callStep ?
                resultDataDetail2.o_nation_note :
                resultDataDetail2.nation_note}
            </td>
          </tr>
          <tr>
            <th>性别</th>
            <td>
              {resultDataDetail2.callStep ?
                resultDataDetail2.o_xb_note :
                resultDataDetail2.xb_note}
            </td>
            <th>出生日期</th>
            <td>
              {resultDataDetail2.callStep ?
                resultDataDetail2.o_csrq :
                resultDataDetail2.csrq}
            </td>
          </tr>
          <tr>
            <th>身份证号码</th>
            <td colSpan="3">{resultDataDetail2.callStep ? resultDataDetail2.o_sfzh : resultDataDetail2.zjbh}</td>
          </tr>
        </tbody>
      </table>);

    return (
      <div className={`${styles.indResultTable} ${showClass}`}>
        <p className={styles.top}><span>核查结果</span></p>
        <div className={styles.resuTable}>
          {
            tableSelect === 1 ? tableOne : ''
          }
          {
            tableSelect === 2 ? tableTwo : ''
          }
        </div>
      </div>
    );
  }
}


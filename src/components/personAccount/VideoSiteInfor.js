/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import styles from './videoSiteInfor.less';

export default class VideoSiteInfor extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    infor: PropTypes.object.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  filterDate(date) {
    let str = '';
    if (date) {
      str = `${date.toString().substring(0, 4)}-${date.toString().substring(4, 6)}-${date.toString().substring(6, 8)}`;
    }
    return str;
  }

  render() {
    const { title, infor } = this.props;
    console.log(infor);
    const qdrq = this.filterDate(infor.zsqdrq);
    const zsyxrq = infor.zsyxq || infor.zsyxrq;
    const yxrq = this.filterDate(zsyxrq);
    return (
      <div className={styles.videoSiteInfor}>
        <div className={styles.title}>
          <span className={styles.greyIcon} />
          <span className={styles.name}>{title}</span>
        </div>
        <table className="tableArea">
          <tbody>
            <tr>
              <td className="header" rowSpan="3" width="12%">
                <span>
                  {
                    infor.base64str ?
                      <img className="icon" src={`data:image/jpeg;base64,${infor.base64str}`} alt="头像" /> :
                      <span className="icon iconDefault" />
                  }
                </span>
              </td>
              <td width="12%" className="label">姓名</td>
              <td width="26%">{infor.xm}</td>
              <td width="12%" className="label">执业机构</td>
              <td>{infor.zyjg}</td>
            </tr>
            <tr>
              <td className="label">性别</td>
              <td>{infor.xb_note}</td>
              <td className="label">证书编号</td>
              <td>{infor.zsbh}</td>
            </tr>
            <tr>
              <td className="label">学历</td>
              <td>{infor.xl_note}</td>
              <td className="label">执业岗位</td>
              <td>{infor.zygw}</td>
            </tr>
            <tr>
              <td className="label">证书取得日期</td>
              <td colSpan="2">{qdrq}</td>
              <td className="label">证件有效日期</td>
              <td>{yxrq}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

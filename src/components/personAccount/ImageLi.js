/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { showImgFile, uploadImgFile, onlyShowImgFile } from '../../utils/cordova';
import styles from './imageLi.less';

export default class imageLi extends PureComponent {

  static propTypes = {
    information: PropTypes.object,
  }

  static defaultProps = {
    information: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  @autobind
  handleClick() {
    const { information } = this.props;
    if (information.returnChange && information.defaultFilepath && !information.shr) { // 退回整改
      const arg = [
        information.filepath,
        information.yxlxmc,
      ];
      onlyShowImgFile(
        arg,
        result => console.log(result),
        err => console.log(err),
      );
      return;
    }
    if (information.filepath) { // 已有影像资料
      const arg = [
        information.filepath,
        information.yxlxmc,
        information.yxlx,
      ];
      showImgFile(
        arg,
        result => console.log(result),
        err => console.log(err),
      );
      return;
    }
    if (!information.filepath) { // 未上传影像资料
      const arg = [
        information.yxlxmc,
        information.yxlx,
      ];
      uploadImgFile(
        arg,
        result => console.log(result),
        err => console.log(err),
      );
    }
  }

  render() {
    const { information } = this.props;
    return (
      <li key={information.px} className={`${styles.imageLi}`} onClick={this.handleClick}>
        <div className={`clearfix ${styles.imgLiArea}`}>
          <a className={`${styles.icon} ${information.filepath ? styles.finish : ''}`}>
            <span className={styles.imgIcon} />
          </a>
          <div className={styles.name}>
            {
              information.bx === 1 ? <span className={styles.required}>*</span> : ''
            }
            {information.yxlxmc}
          </div>
          {
            information.yxlx === 2 ? <p className={styles.tip}>视频见证需拍摄受理人与客户双人合影；<br />双人见证需拍摄受理人、见证人与客户三人合影</p> : ''
          }
        </div>
        {
          information.shsj ?
            <div className={styles.imgLiTipError}>
              {information.shyj}
            </div> : ''
        }
        {
          (information.defaultFilepath
          && information.shyj === undefined
          && information.returnChange) ?
            <div className={styles.imgLiTipSuccesss} >审核通过</div> : ''
        }
      </li>
    );
  }
}

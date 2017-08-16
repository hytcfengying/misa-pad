/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import styles from './video.less';
import { unidirectionalVideo, bilateralVideo } from '../../utils/cordova';


export default class boxTitle extends PureComponent {

  static propTypes = {
    checked: PropTypes.string,
    push: PropTypes.func.isRequired,
    stepCacheData: PropTypes.array.isRequired,
    empInforData: PropTypes.object.isRequired,
    setVideoType: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
  }

  static defaultProps = {
    checked: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      checked: this.props.checked,
    };
  }

  componentWillMount() {
  }

  @autobind
  selectSingle() {
    if (this.state.checked === 'single') {
      return;
    }
    this.setState({ checked: 'single' });
  }

  @autobind
  selectDouble() {
    if (this.state.checked === 'double') {
      return;
    }
    this.setState({ checked: 'double' });
  }
  @autobind
  selectSite() {
    if (this.state.checked === 'site') {
      return;
    }
    this.setState({ checked: 'site' });
  }
  @autobind
  handleVideo() {
    const { checked } = this.state;
    const { setVideoType, push, stepCacheData, empInforData, bdid } = this.props;
    if (checked === 'single') {
      unidirectionalVideo(
        result => console.log(result),
        err => console.log(err),
      );
    } else if (checked === 'double') {
      // 测试数据
      // bilateralVideo(
      //   ['xxx', 15151515151, 14627, 3210030],
      //   result => console.log(result),
      //   err => console.log(err),
      // );
      // return;
      const name = JSON.parse(_.find(stepCacheData, { key: 'SFYZ' }).value).KHXM;
      const phone = JSON.parse(_.find(stepCacheData, { key: 'ZLTX' }).value).SJ;
      const yyb = empInforData.yyb;
      console.log([name, phone, yyb]);
      bilateralVideo(
        [name, phone, 14627, bdid],
        result => console.log(result),
        err => console.log(err),
      );
    } else {
      push('/personAccount/video/site');
    }
    setVideoType({ type: checked });
  }

  render() {
    const { checked } = this.state;
    // const singleChecked = this.state.checked === 'single' ? styles.checked : '';
    const doubleChecked = checked === 'double' ? styles.checked : '';
    const siteChecked = checked === 'site' ? styles.checked : '';
    const isPerson = checked === 'site' ? styles.site : '';
    return (
      <div className={styles.video}>
        <div className={styles.content}>
          <div className={styles.label}>见证方式</div>
          <ul className={styles.ul}>
            <li>
              <span className={`${styles.radio} ${doubleChecked}`} onClick={this.selectDouble} />
              双向视频见证
            </li>
            <li>
              <span className={`${styles.radio} ${siteChecked}`} onClick={this.selectSite} />
              双人现场见证
            </li>
          </ul>
        </div>
        <button className={styles.videoBtn} onClick={this.handleVideo}>
          <span className={`${styles.videoBtnIcon} ${isPerson}`} />
          { checked === 'site' ? '现场见证' : '视频见证' }
        </button>
      </div>
    );
  }
}

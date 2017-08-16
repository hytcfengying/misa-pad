/**
 * @file identity/inforDetail.js
 * @author zzc
 */
import React, { PureComponent, PropTypes } from 'react';
// import { autobind } from 'core-decorators';
import ReactSwipe from 'react-swipes';
import styles from './inforDetail.less';

export default class infor extends PureComponent {

  static propTypes = {
    inforData: PropTypes.object,
  }

  static defaultProps = {
    inforData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      curCard: 0,
    };
  }

  componentDidMount() {
  }

  render() {
    const imgList = [
      {
        src: '../../../static/img/img_photo_a.png',
        name: '1',
      },
      {
        src: '../../../static/img/invest-close.png',
        name: '2',
      },
      {
        src: '../../../static/img/img_photo_a.png',
        name: '3',
      },
    ];
    const dw = document.body.clientWidth;
    const opt = {
      distance: dw, // 每次移动的距离，卡片的真实宽度，需要计算
      currentPoint: 0, // 初始位置，默认从0即第一个元素开始
      swTouchend: (ev) => {
        const data = {
          moved: ev.moved,
          originalPoint: ev.originalPoint,
          newPoint: ev.newPoint,
          cancelled: ev.cancelled,
        };
        console.log(data);
        this.setState({ curCard: ev.newPoint });
      },
    };
    // const { inforData = {} } = this.props;
    const { curCard } = this.state;
    const listLenght = imgList.length;
    const curIndex = curCard + 1;
    return (
      <div className={styles.imgDetaBox}>
        <span className={styles.title}>xxxxx(<span>{`${curIndex}/${listLenght}`}</span>)</span>
        <div className={styles.viewport}>
          <div className={styles.cardBox}>
            <ReactSwipe className={styles.cardSlide} options={opt}>
              {
                imgList.map(item =>
                  <div
                    key={item.name}
                    className={styles.imgBox}
                  >
                    <img alt={item.name} src={item.src} />
                  </div>,
                )
              }
            </ReactSwipe>
          </div>
        </div>
      </div>
    );
  }
}


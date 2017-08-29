/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import styles from './image.less';

import ImageLi from './ImageLi';
import BoxTitle from './BoxTitle';

export default class image extends PureComponent {

  static propTypes = {
    list: PropTypes.array,
    title: PropTypes.string.isRequired,
  }

  static defaultProps = {
    list: [],
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  render() {
    const { list, title } = this.props;
    const listLeft = _.slice(list, 0, _.round(list.length / 2));
    const listRight = _.slice(list, _.round(list.length / 2), list.length);
    return (
      <div className={styles.imageArea}>
        <BoxTitle
          title={title}
        />
        <div className={`${styles.image} clearfix`}>
          <ul className={styles.left}>
            {
              listLeft.map(item =>
                <ImageLi
                  key={item.yxlxmc}
                  information={item}
                />,
              )
            }
          </ul>
          <ul className={styles.right}>
            {
              listRight.map(item =>
                <ImageLi
                  key={item.yxlxmc}
                  information={item}
                />,
              )
            }
          </ul>
        </div>
      </div>
    );
  }
}

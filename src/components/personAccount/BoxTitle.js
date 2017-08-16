/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import styles from './boxTitle.less';

export default class boxTitle extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    radius: PropTypes.bool,
    thin: PropTypes.bool,
  }

  static defaultProps = {
    title: '',
    radius: true,
    thin: false,
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  render() {
    const { title, radius, thin } = this.props;
    const isRadius = radius ? styles.radius : '';
    const isThin = thin ? styles.thin : '';
    return (
      <div className={`${styles.title} ${isRadius}  ${isThin}`}>
        <span className={styles.tip} />
        {title}
      </div>
    );
  }
}

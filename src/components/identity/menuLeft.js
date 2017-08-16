/**
 * @file identity/menuLeft.js
 * @author zzc
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Menu } from 'antd';
// import { menus } from '../../config';
import PopUp from '../globalCom/popup';
import styles from './menuLeft.less';

export default class menuTab extends PureComponent {

  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    menuState: PropTypes.array.isRequired,
    changePopState: PropTypes.func.isRequired,
    popState: PropTypes.object.isRequired,
    stepObj: PropTypes.object,
    stepIndex: PropTypes.number,
  }

  static defaultProps = {
    stepObj: {},
    stepIndex: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  componentWillMount() {
    this.resetScroll();
  }

  componentDidMount() {
  }

  resetScroll() {
    window.scroll(0, 0);
  }

  @autobind
  navClick(item) {
    const { push, stepObj } = this.props;
    this.setState({
      value: item.key,
    });
    const pathL = location.pathname.split('/');
    const pathIndex = pathL[2];
    if (stepObj && stepObj.value) {
      if (pathIndex === 'info') {
        this.props.changePopState({
          popType: 'menuJump',
          callback: this.changeMenu,
          popShow: true,
        });
        return;
      }
      push(`/personAccount/${item.key}`);
    } else {
      this.props.changePopState({
        popType: 'menuJump',
        callback: this.changeMenu,
        popShow: true,
      });
    }
  }

  @autobind
  changeMenu() {
    const { push } = this.props;
    const { value } = this.state;
    push(`/personAccount/${value}`);
  }

  render() {
    const {
      push,
      location,
      menuState,
      popState,
      changePopState,
    } = this.props;
    const pathL = location.pathname.split('/');
    const pathIndex = pathL[2];
    return (
      <div className={styles.menuLeft}>
        <Menu
          selectedKeys={[pathIndex !== undefined ? pathIndex : 'identity']}
          onClick={this.navClick}
        >
          {
            menuState.map(item =>
              (item.show ?
                <Menu.Item
                  key={item.key}
                  className={`${item.off ? '' : styles.offState} ${item.show ? styles.showClass : styles.hideClass}`}
                >
                  <span className={`${styles.iconYes} ${item.iconOn ? styles.on : ''}`}>yes</span>
                  <span className={styles.itemText}>{item.name}</span>
                  <p className={styles.triangle}><span className={styles.triangleN}>x</span></p>
                </Menu.Item> : null),
            )
          }
        </Menu>
        <PopUp
          popType={'menuJump'}
          popState={popState}
          changePopState={changePopState}
          push={push}
        />
      </div>
    );
  }
}

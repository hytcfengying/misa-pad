/**
 * @file search/searchTop.js
 * @author zzc
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Menu, Input, DatePicker, Button } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import 'moment/locale/zh-cn';

import styles from './searchRecord.less';

moment.locale('zh-cn');
const dateFormat = 'YYYYMMDD';

const nowday = new Date();
const year = nowday.getFullYear();
let month = nowday.getMonth() + 1;
let strDate = nowday.getDate();
if (month >= 1 && month <= 9) {
  month = `0${month}`;
}
if (strDate >= 0 && strDate <= 9) {
  strDate = `0${strDate}`;
}
const currentdate = `${year}${month}${strDate}`;

export default class SearchTop extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    empInforData: PropTypes.object,
    dicData: PropTypes.object,
    getRecordListFunc: PropTypes.func.isRequired,
    clearListDataState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    empInforData: {},
    dicData: {},
  }

  constructor(props) {
    super(props);

    const { location: { query } } = props;
    this.state = {
      current: query.current ? query.current : 'KHYW',
      value: query.searchKey ? query.searchKey : '',
      step: query.step ? query.step : '',
      jgbz: query.jgbz ? query.jgbz : '',
      startValue: query.ksrq ? moment(query.ksrq) : moment(currentdate),
      endValue: query.jsrq ? moment(query.jsrq) : moment(currentdate),
      filterShow: false,
      filterButSelect: false,
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    if (query.searchKey) {
      this.setState({ value: query.searchKey });
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    document.documentElement.style.overflow = 'initial';
  }
  // componentWillReceiveProps(nextProps) {}

  // 日期改变处理
  @autobind
  onChange(field, value) {
    this.setState({
      [field]: value,
    });
  }

  @autobind
  onStartChange(value) {
    this.onChange('startValue', value);
  }

  @autobind
  onEndChange(value) {
    this.onChange('endValue', value);
  }

  // menu
  @autobind
  handleClick(e) {
    const { replace, location: { query } } = this.props;
    this.setState({
      current: e.key,
    });
    replace({
      pathname: '/histRecord/histRecordList',
      query: {
        ...query,
        current: e.key,
      },
    });
  }

  // step
  @autobind
  checkStep(e) {
    this.setState({
      step: e.key === '-99999' ? '' : e.key,
    });
  }

  // step
  @autobind
  checkjgbz(e) {
    this.setState({
      jgbz: e.key === '-99999' ? '' : e.key,
    });
  }

  // 限制日期选择范围
  @autobind
  disabledStartDate(startValue) {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return startValue && startValue.valueOf() > Date.now();
    }
    const start = Date.parse(endValue) - 2592000000;
    return startValue.valueOf() > endValue.valueOf() ||
      startValue.valueOf() > Date.now() ||
      startValue.valueOf() < start.valueOf();
  }

  @autobind
  disabledEndDate(endValue) {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return endValue && endValue.valueOf() < Date.now();
    }
    const end = Date.parse(startValue) + 2592000000;
    return endValue.valueOf() < startValue.valueOf() ||
      endValue.valueOf() > Date.now() ||
      endValue.valueOf() > end.valueOf();
  }

  // 输入框
  @autobind
  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  @autobind
  emitEmpty() {
    this.searchInput.focus();
    this.setState({ value: '' });
  }

  @autobind
  showFilter() {
    const { location: { query }, replace } = this.props;
    replace({
      pathname: '/histRecord/histRecordList',
      query: {
        ...query,
        sureClick: false,
      },
    });
    this.setState({
      filterShow: true,
    });
    document.documentElement.style.overflow = 'hidden';
  }

  @autobind
  cancelBut() { // 取消
    const { location: { query }, replace } = this.props;
    this.setState({
      filterShow: false,
      value: query.searchKey ? query.searchKey : '',
      step: query.step ? query.step : '',
      jgbz: query.jgbz ? query.jgbz : '',
      startValue: query.ksrq ? moment(query.ksrq) : moment(currentdate),
      endValue: query.jsrq ? moment(query.jsrq) : moment(currentdate),
    });
    replace({
      pathname: '/histRecord/histRecordList',
      query: {
        ...query,
        sureClick: true,
      },
    });
    document.documentElement.style.overflow = 'initial';
  }

  @autobind
  sureBut() { // 确定
    const { location: { query }, replace, empInforData } = this.props;
    const { value, startValue, endValue } = this.state;
    this.props.clearListDataState();
    this.props.getRecordListFunc({
      searchKey: value || '',
      empId: empInforData.id,
      step: this.state.step || '',
      jgbz: this.state.jgbz || '',
      ksrq: startValue.format(dateFormat) || currentdate,
      jsrq: endValue.format(dateFormat) || currentdate,
    });
    this.setState({
      filterShow: false,
      filterButSelect: true,
    });
    replace({
      pathname: '/histRecord/histRecordList',
      query: {
        ...query,
        step: this.state.step ? this.state.step : '',
        searchKey: value || '',
        jgbz: this.state.jgbz ? this.state.jgbz : '',
        ksrq: startValue.format(dateFormat),
        jsrq: endValue.format(dateFormat),
        sureClick: true,
      },
    });
    document.documentElement.style.overflow = 'initial';
  }

  render() {
    const {
      current,
      value,
      step,
      jgbz,
      startValue,
      endValue,
      filterShow,
    } = this.state;
    const { dicData } = this.props;
    const filterShowClass = filterShow ? styles.showClass : '';
    const buttSelectClass = this.state.filterButSelect ? styles.on : '';
    const suffix = value ?
      <span className={styles.searchClear} onClick={this.emitEmpty} /> :
      null;
    const stepList = _.isEmpty(dicData) ?
      null :
      dicData.KH_STEP.map(item =>
        <Menu.Item key={item.ibm} className={styles.stepLi}>
          <span>{item.note}</span>
          <i className={styles.stepYes}>yes</i>
        </Menu.Item>,
      );
    return (
      <div className={styles.searchBar}>
        <div className={styles.menuSelect}>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            className={styles.selectUl}
          >
            <Menu.Item key="KHYW" className={styles.selectLi}>
              开户业务
            </Menu.Item>
            <Menu.Item key="ECYW" className={`${styles.selectLi} ${styles.offLi}`}>
              二次业务
            </Menu.Item>
          </Menu>
        </div>
        <div className={`${styles.filterButt} ${buttSelectClass}`} onClick={this.showFilter}>
          筛选
        </div>
        <div className={`${styles.filterBox} ${filterShowClass}`}>
          <div className={styles.mask}>x</div>
          <div className={styles.rightBox}>
            <div className={styles.filterSearchBox}>
              <div className={styles.searchBox}>
                <p>客户号/证件编号</p>
                <Input
                  className={styles.seaInput}
                  placeholder="请输入客户号或证件编号"
                  suffix={suffix}
                  value={value}
                  onChange={this.handleChange}
                  onPressEnter={this.sureBut}
                  ref={(node) => { (this.searchInput = node); }}
                  maxLength={30}
                />
              </div>
              <div className={styles.searchBox}>
                <p>受理日期</p>
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  format="YYYYMMDD"
                  placeholder="开始时间"
                  onChange={this.onStartChange}
                  showTime={false}
                  showToday
                  value={startValue}
                /><span className={styles.dataLink}>-</span>
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  format="YYYYMMDD"
                  placeholder="结束时间"
                  onChange={this.onEndChange}
                  showTime={false}
                  showToday
                  value={endValue}
                />
              </div>
              <div className={`${styles.searchBox} ${styles.stepUlBox}`}>
                <p>机构标志</p>
                <Menu
                  onClick={this.checkjgbz}
                  selectedKeys={[jgbz || '-99999']}
                  mode="horizontal"
                  className={styles.stepUl}
                >
                  <Menu.Item key="-99999" className={styles.stepLi}>
                    <span>全部状态</span>
                    <i className={styles.stepYes}>yes</i>
                  </Menu.Item>
                  <Menu.Item key="0" className={styles.stepLi}>
                    <span>个人开户</span>
                    <i className={styles.stepYes}>yes</i>
                  </Menu.Item>
                  <Menu.Item key="1" className={styles.stepLi}>
                    <span>机构开户</span>
                    <i className={styles.stepYes}>yes</i>
                  </Menu.Item>
                </Menu>
              </div>
              <div className={`${styles.searchBox} ${styles.stepUlBox}`}>
                <p>业务状态</p>
                <Menu
                  onClick={this.checkStep}
                  selectedKeys={[step || '-99999']}
                  mode="horizontal"
                  className={styles.stepUl}
                >
                  <Menu.Item key="-99999" className={styles.stepLi}>
                    <span>全部状态</span>
                    <i className={styles.stepYes}>yes</i>
                  </Menu.Item>
                  {stepList}
                </Menu>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.buttBox} ${filterShowClass}`}>
          <Button type="primary" className={styles.butt} onClick={this.cancelBut}>取消</Button>
          <Button type="primary" className={styles.butt} onClick={this.sureBut}>确认</Button>
        </div>
      </div>
    );
  }
}

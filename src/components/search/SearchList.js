/**
 * @file search/SearchList.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import ListStyle from './searchList.less';

export default class SearchList extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    stopOpenFunc: PropTypes.func.isRequired,
    listData: PropTypes.object,
    customerlist: PropTypes.array,
    registerlist: PropTypes.array,
    empInforData: PropTypes.object,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    getSearchFunc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    listData: {},
    customerlist: [],
    registerlist: [],
    empInforData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  // 继续
  continueClick = item => () => {
    const { push, location: { query } } = this.props;
    const step = item.item.step;
    let queryIndex;
    switch (step) {
      case 0:
        queryIndex = {
          ...query,
          bdid: item.item.id,
        };
        break;
      case 11:
        queryIndex = {
          ...query,
          bdid: item.item.id,
          returnChange: true,
        };
        break;
      default:
        queryIndex = {
          ...query,
        };
    }
    push({
      pathname: '/personAccount',
      query: queryIndex,
    });
  }

  // 终止
  suspensionClick = item => () => {
    this.props.changePopState({
      popShow: true,
      popType: 'isSure',
      popTest: '确认要终止开户吗？',
      callback: () => {
        this.suspensionPro(item.item.id);
      },
    });
  }

  @autobind
  suspensionPro(id) {
    const nextBtnClick = (props, nowBdid) => {
      const promise = new Promise((resolve, reject) => {
        try {
          const { stopOpenFunc } = props;
          stopOpenFunc({
            bdid: nowBdid,
            callback: () => {
              resolve(true);
            },
          });
        } catch (e) {
          reject(e);
        }
      });
      return promise;
    };
    const { empInforData, location: { query }, getSearchFunc } = this.props;
    nextBtnClick(this.props, id).then(() => {
      getSearchFunc({
        ...query,
        searchKey: query.searchKey,
        empId: empInforData.id || query.userId,
      });
    });
  }

  // 查看
  seeClick = item => () => {
    const { push, location: { query } } = this.props;
    push({
      pathname: '/personAccount/confirm',
      query: {
        ...query,
        bdid: item.item.id,
        see: true,
      },
    });
  }

  // 修改日期
  @autobind
  modifyDate(date) {
    const y = parseInt(date.substring(0, 4), 10);
    const m = parseInt(date.substring(4, 6), 10);
    const d = parseInt(date.substring(6, 8), 10);
    const newDate = `${y}-${m}-${d}`;
    return newDate;
  }

  render() {
    if (_.isEmpty(this.props.listData)) {
      return null;
    }
    const { customerlist = [], registerlist = [] } = this.props;
    const { location: { query } } = this.props;
    if (_.isEmpty(customerlist) && _.isEmpty(registerlist)) {
      return (
        <div className={ListStyle.emptyList}>
          <div className={ListStyle.emptyWrapper}>
            <div className={ListStyle.emptyIcon} />
            <div className={ListStyle.emptyInfo}>
              <div className={ListStyle.emptyTitle}>
                暂无记录
              </div>
              <div className={ListStyle.emptyTxt}>
                <span>{query.searchKey || '--'}</span>
                在本司没有任何记录！
              </div>
            </div>
          </div>
        </div>
      );
    }
    const customerList = _.isEmpty(customerlist) ?
      null :
      customerlist.map((item, index) =>
        <li key={`customer-${index + 1}`}>
          <div className={ListStyle.regTitle}>
            <p className={ListStyle.regName}>
              {item.khqc}<span>{item.khh}</span>
            </p>
            <p className={ListStyle.regTip}>
              {item.khzt_note}
            </p>
          </div>
          <div className={ListStyle.infoTable}>
            <div className={ListStyle.tableFirst}>
              <p>开户时间</p>
              <div className={ListStyle.infoTxt}>
                {
                  this.modifyDate(item.khrq)
                }
              </div>
            </div>
            <div className={ListStyle.tableSecond}>
              <p>证件类别</p>
              <div className={ListStyle.infoTxt}>
                {item.zjlb_note}
              </div>
            </div>
            <div className={ListStyle.tableThird}>
              <p>证件编号</p>
              <div className={ListStyle.infoTxt}>
                {item.zjbh}
              </div>
            </div>
            <div className={ListStyle.tableForth}>
              <p>营业部</p>
              <div className={ListStyle.infoTxt}>
                {item.yyb_note}
              </div>
            </div>
            <div className={ListStyle.tableFifth}>
              <p>客户类别</p>
              <div className={ListStyle.infoTxt}>
                {item.jgbz_note}
              </div>
            </div>
          </div>
          <div className={ListStyle.listOperation}>
            <div className={ListStyle.operationBtn}>
              二次业务
            </div>
          </div>
        </li>,
      );
    const registerList = _.isEmpty(registerlist) ?
      null :
      registerlist.map((item, index) =>
        <li key={`register-${index + 1}`}>
          <div className={ListStyle.regTitle}>
            <p className={ListStyle.regName}>
              {item.khqc}<span>{item.khh}</span>
            </p>
            <p className={ListStyle.regTip}>
              {item.step_note}
            </p>
          </div>
          <div className={ListStyle.infoTable}>
            <div className={ListStyle.tableFirst}>
              <p>受理时间</p>
              <div className={ListStyle.infoTxt}>
                {
                  this.modifyDate(item.sqrq)
                } {item.sqsj}
              </div>
            </div>
            <div className={ListStyle.tableSecond}>
              <p>证件类别</p>
              <div className={ListStyle.infoTxt}>
                {item.zjlb_note}
              </div>
            </div>
            <div className={ListStyle.tableThird}>
              <p>证件编号</p>
              <div className={ListStyle.infoTxt}>
                {item.zjbh}
              </div>
            </div>
            <div className={ListStyle.tableForth}>
              <p>营业部</p>
              <div className={ListStyle.infoTxt}>
                {item.yyb_note}
              </div>
            </div>
            <div className={ListStyle.tableFifth}>
              <p>客户类别</p>
              <div className={ListStyle.infoTxt}>
                {item.jgbz_note}
              </div>
            </div>
          </div>
          <div className={ListStyle.listOperation}>
            <div className={ListStyle.operationBtn} onClick={this.seeClick({ item })}>详情</div>
            {
              (item.step === 0 || item.step === 11) ?
                (<div>
                  <div className={ListStyle.operationBtn} onClick={this.suspensionClick({ item })}>
                    终止</div>
                  <div className={ListStyle.operationBtn} onClick={this.continueClick({ item })}>
                    {item.step === 0 ? '继续' : '修改'}</div>
                </div>) : ''
            }
          </div>
        </li>,
      );
    const customerContent = _.isEmpty(customerlist) ?
      null :
      (<ul className={ListStyle.customerList}>
        <li className={ListStyle.listLabel}>
          <div className={ListStyle.labelTxt}>
            客户列表
          </div>
        </li>
        {customerList}
      </ul>);
    const registerContent = _.isEmpty(registerlist) ?
      null :
      (<ul className={ListStyle.customerList}>
        <li className={ListStyle.listLabel}>
          <div className={ListStyle.labelTxt}>
            开户在途
          </div>
        </li>
        {registerList}
      </ul>);
    return (
      <div className={ListStyle.listWrapper}>
        {customerContent}
        {registerContent}
      </div>
    );
  }
}

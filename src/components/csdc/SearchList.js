/**
 * @file search/SearchList.js
 * @author zzc
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import ListStyle from './searchRecord.less';

export default class SearchList extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    recordList: PropTypes.array,
    stopOpenFunc: PropTypes.func.isRequired,
    popState: PropTypes.object.isRequired,
    changePopState: PropTypes.func.isRequired,
    empInforData: PropTypes.object,
    getRecordListFunc: PropTypes.func.isRequired,
    listData: PropTypes.object,
  }

  static defaultProps = {
    recordList: [],
    empInforData: {},
    listData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      canClick: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query } } = nextProps;
    const { location: { query: preQuery } } = this.props;
    // 条件变化
    if (!_.isEqual(query, preQuery)) {
      if (query.sureClick && query.sureClick === 'false') {
        this.setState({
          canClick: false,
        });
      } else {
        this.setState({
          canClick: true,
        });
      }
    }
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
      query: {
        ...queryIndex,
        source: 'record',
      },
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
    const { empInforData, location: { query } } = this.props;
    nextBtnClick(this.props, id).then(() => {
      this.props.getRecordListFunc({
        searchKey: query.searchKey,
        empId: empInforData.id || query.userId,
        jgbz: query.jgbz || '',
        step: query.step || '',
        ksrq: query.ksrq || '',
        jsrq: query.jsrq || '',
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
        source: 'record',
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
    const { recordList = [] } = this.props;
    const noClickClass = this.state.canClick ? '' : ListStyle.noClick;
    if (_.isEmpty(recordList)) {
      return (
        <div className={ListStyle.emptyList}>
          <div className={ListStyle.emptyWrapper}>
            <div className={ListStyle.emptyIcon} />
            <div className={ListStyle.emptyInfo}>
              <div className={ListStyle.emptyTitle}>
                没有筛选到结果
              </div>
            </div>
          </div>
        </div>
      );
    }
    const recordlist = _.isEmpty(recordList) ?
      null :
      recordList.map((item, index) =>
        (<li key={`register-${index + 1}`}>
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
              <p>见证方式</p>
              <div className={ListStyle.infoTxt}>
                {item.jzfs_note ?
                  item.jzfs_note :
                  '待见证'}
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
          <div className={`${ListStyle.listOperation} ${noClickClass}`}>
            <div className={ListStyle.time}>
              {
                this.modifyDate(item.sqrq)
              } {item.sqsj}
            </div>
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
        </li>),
      );
    const registerContent = _.isEmpty(recordList) ?
      null :
      (<ul className={ListStyle.customerList}>
        {recordlist}
      </ul>);
    return (
      <div className={ListStyle.listWrapper}>
        {registerContent}
      </div>
    );
  }
}

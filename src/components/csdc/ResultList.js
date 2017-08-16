/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';

import styles from './resultList.less';
import BoxTitle from '../personAccount/BoxTitle';

export default class identity extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    csdcList: PropTypes.array,
    replace: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    showState: PropTypes.string.isRequired,
  }

  static defaultProps = {
    location: {},
    csdcList: [],
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  handleItemClick = item => () => {
    const { push, replace, location: { query }, pathname } = this.props;
    replace({
      pathname: `/${pathname}`,
      query: {
        ...query,
        searchState: true,
      },
    });
    push(`/searchDetail?id=${item.item.id}&path=${pathname}`);
  }

  render() {
    const { csdcList, showState, pathname } = this.props;

    const codeSearchType = pathname === 'codeSearch' ?
                            `${pathname}_${showState}` : '';
    return (
      <div className={styles.result}>
        <BoxTitle
          title="查询结果"
          radius={false}
        />
        {
          csdcList.length === 0 ?
            <div className={styles.none}>
              <span>查无数据</span>
            </div> :
            <table className={styles.tableArea}>
              <thead>
                {
                  codeSearchType === 'codeSearch_identity' ?
                    <tr>
                      <td>处理标志</td>
                      <td width="30%">结果说明</td>
                      <td>回报时间</td>
                      <td>一码通号</td>
                      <td>账户状态</td>
                      <td width="5%" />
                    </tr> : ''
                }
                {
                  codeSearchType === 'codeSearch_code' ?
                    <tr>
                      <td>处理标志</td>
                      <td width="30%">结果说明</td>
                      <td>回报时间</td>
                      <td>客户名称</td>
                      <td>证件类别</td>
                      <td>证件号码</td>
                      <td width="5%" />
                    </tr> : ''
                }
                {
                  pathname === 'stockSearch' ?
                    <tr>
                      <td>处理标志</td>
                      <td width="30%">结果说明</td>
                      <td>回报时间</td>
                      <td>账户类别</td>
                      <td>证券账号</td>
                      <td>账户状态</td>
                      <td width="5%" />
                    </tr> : ''
                }
                {
                  pathname === 'relationSearch' ?
                    <tr>
                      <td>处理标志</td>
                      <td width="30%">结果说明</td>
                      <td>回报时间</td>
                      <td>客户名称</td>
                      <td>证件类别</td>
                      <td>证件号码</td>
                      <td width="5%" />
                    </tr> : ''
                }
                {
                  pathname === 'infoSearch' ?
                    <tr>
                      <td>处理标志</td>
                      <td width="30%">结果说明</td>
                      <td>回报时间</td>
                      <td>客户名称</td>
                      <td>证件类别</td>
                      <td>证件号码</td>
                      <td width="5%" />
                    </tr> : ''
                }
                {
                  pathname === 'partnerSearch' ?
                    <tr>
                      <td width="30%">结果说明</td>
                      <td>回报时间</td>
                      <td>一码通号</td>
                      <td>合伙人全称</td>
                      <td>合伙人证件类别</td>
                      <td>合伙人证件编号</td>
                      <td width="5%" />
                    </tr> : ''
                }
              </thead>
              <tbody>
                {
                  codeSearchType === 'codeSearch_identity' ?
                    csdcList.map(item =>
                      <tr>
                        <td>{item.clbz_note || item.clbz}</td>
                        <td>
                          <div>{item.hbjgsm || item.jgsm}</div>
                        </td>
                        <td>{`${item.hbrq} ${item.hbsj}`}</td>
                        <td>{item.ymth}</td>
                        <td>{item.ymtzt}</td>
                        <td onClick={this.handleItemClick({ item })}>
                          <span className={styles.iconRight} />
                        </td>
                      </tr>,
                    ) : ''
                }
                {
                  codeSearchType === 'codeSearch_code' ?
                    csdcList.map(item =>
                      <tr>
                        <td>{item.clbz_note || item.clbz}</td>
                        <td>
                          <div>{item.hbjgsm || item.jgsm}</div>
                        </td>
                        <td>{`${item.hbrq} ${item.hbsj}`}</td>
                        <td>{item.khmc}</td>
                        <td>{item.zjlb_note || item.zjlb}</td>
                        <td>{item.zjbh}</td>
                        <td onClick={this.handleItemClick({ item })}>
                          <span className={styles.iconRight} />
                        </td>
                      </tr>,
                    ) : ''
                }
                {
                  pathname === 'stockSearch' ?
                    csdcList.map(item =>
                      <tr>
                        <td>{item.clbz_note || item.clbz}</td>
                        <td>
                          <div>{item.hbjgsm || item.jgsm}</div>
                        </td>
                        <td>{`${item.hbrq} ${item.hbsj}`}</td>
                        <td>{item.zhlb_note || item.zhlb}</td>
                        <td>{item.zhzh}</td>
                        <td>{item.zqzhzt_note || item.zqzhzt}</td>
                        <td onClick={this.handleItemClick({ item })}>
                          <span className={styles.iconRight} />
                        </td>
                      </tr>,
                    ) : ''
                }
                {
                  pathname === 'relationSearch' ?
                    csdcList.map(item =>
                      <tr>
                        <td>{item.clbz_note || item.clbz}</td>
                        <td>
                          <div>{item.hbjgsm || item.jgsm}</div>
                        </td>
                        <td>{`${item.hbrq} ${item.hbsj}`}</td>
                        <td>{item.khmc}</td>
                        <td>{item.zhlb_note || item.zhlb}</td>
                        <td>{item.zhbh}</td>
                        <td onClick={this.handleItemClick({ item })}>
                          <span className={styles.iconRight} />
                        </td>
                      </tr>,
                    ) : ''
                }
                {
                  pathname === 'infoSearch' ?
                    csdcList.map(item =>
                      <tr>
                        <td>{item.clbz_note || item.clbz}</td>
                        <td>
                          <div>{item.hbjgsm || item.jgsm}</div>
                        </td>
                        <td>{`${item.hbrq} ${item.hbsj}`}</td>
                        <td>{item.hbmc}</td>
                        <td>{item.zhlb_note || item.zhlb}</td>
                        <td>{item.zhbh}</td>
                        <td onClick={this.handleItemClick({ item })}>
                          <span className={styles.iconRight} />
                        </td>
                      </tr>,
                    ) : ''
                }
                {
                  pathname === 'partnerSearch' ?
                    csdcList.map(item =>
                      <tr>
                        <td>
                          <div>{item.hbjgsm || item.jgsm}</div>
                        </td>
                        <td>{`${item.hbrq} ${item.hbsj}`}</td>
                        <td>{item.ymth}</td>
                        <td>{item.khmc}</td>
                        <td>{item.zjlb_note || item.zjlb}</td>
                        <td>{item.zjbh}</td>
                        <td onClick={this.handleItemClick({ item })}>
                          <span className={styles.iconRight} />
                        </td>
                      </tr>,
                    ) : ''
                }
              </tbody>
            </table>
        }
      </div>
    );
  }
}

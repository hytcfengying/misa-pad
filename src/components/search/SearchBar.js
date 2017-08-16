/**
 * @file search/SearchBar.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import { getIDCard } from '../../utils/cordova';
import barStyle from './searchBar.less';

export default class SearchBar extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    empInforData: PropTypes.object,
  }

  static defaultProps = {
    empInforData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  componentDidMount() {
  }

  // componentWillReceiveProps(nextProps) {}

  @autobind
  handleSearch() {
    const { push, location: { query }, empInforData } = this.props;
    if (this.searchInput.props.value) {
      push({
        pathname: '/search/result',
        query: {
          ...query,
          searchKey: this.searchInput.props.value,
          userId: empInforData.id,
        },
      });
    }
  }

  @autobind
  handleIdentify() {
    const { push, location: { query }, empInforData } = this.props;
    getIDCard(
      (result) => {
        const resultObjct = JSON.parse(result);
        push({
          pathname: '/search/result',
          query: {
            ...query,
            searchKey: resultObjct.ID,
            userId: empInforData.id,
          },
        });
        this.setState({ value: resultObjct.ID });
      },
      err => console.log(err),
    );
  }

  @autobind
  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const { value } = this.state;
    return (
      <div className={barStyle.searchBar}>
        <div className={barStyle.searchForm}>
          <Input
            className={barStyle.searchInput}
            placeholder="可输入客户号/证件编号查询"
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.handleSearch}
            ref={(node) => { (this.searchInput = node); }}
            maxLength={30}
          />
          <div className={barStyle.searchBtn} onClick={this.handleSearch}>
            查找客户
          </div>
        </div>
        <div className={barStyle.identify} onClick={this.handleIdentify} />
      </div>
    );
  }
}

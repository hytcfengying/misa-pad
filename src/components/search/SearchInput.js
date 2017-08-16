/**
 * @file search/SearchInput.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import { getIDCard } from '../../utils/cordova';
import inputStyle from './searchInput.less';

export default class SearchInput extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getSearchFunc: PropTypes.func.isRequired,
    stopOpenFunc: PropTypes.func.isRequired,
    empInforData: PropTypes.object,
    clearListDataStateFunc: PropTypes.func.isRequired,
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

  componentWillMount() {
    const { location: { query } } = this.props;
    if (query.searchKey) {
      this.setState({ value: query.searchKey });
    }
  }

  componentDidMount() {
  }

  // componentWillReceiveProps(nextProps) {}

  @autobind
  handleSearch() {
    const { replace, location: { query }, empInforData } = this.props;
    if (this.searchInput.props.value) {
      this.props.clearListDataStateFunc();
      this.props.getSearchFunc({
        ...query,
        searchKey: this.searchInput.props.value,
        empId: empInforData.id || query.userId,
      });
      replace({
        pathname: '/search/result',
        query: {
          ...query,
          searchKey: this.searchInput.props.value,
        },
      });
    }
  }

  @autobind
  handleIdentify() {
    const { replace, location: { query }, empInforData } = this.props;
    getIDCard(
      (result) => {
        const resultObjct = JSON.parse(result);
        replace({
          pathname: '/search/result',
          query: {
            ...query,
            searchKey: resultObjct.ID,
          },
        });
        this.setState({ value: resultObjct.ID });
        this.props.clearListDataStateFunc();
        this.props.getSearchFunc({
          ...query,
          searchKey: resultObjct.ID,
          empId: empInforData.id || query.userId,
        });
      },
      err => console.log(err),
    );
  }

  @autobind
  emitEmpty() {
    this.searchInput.focus();
    this.setState({ value: '' });
  }

  @autobind
  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const { value } = this.state;
    const suffix = value ?
      <span className={inputStyle.searchClear} onClick={this.emitEmpty} /> :
      null;
    return (
      <div className={inputStyle.searchBar}>
        <div className={inputStyle.searchForm}>
          <Input
            placeholder="可输入客户号/证件编号查询"
            prefix={<span className={inputStyle.searchIcon} onClick={this.handleSearch} />}
            suffix={suffix}
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.handleSearch}
            ref={(node) => { (this.searchInput = node); }}
            maxLength={30}
          />
          <div className={inputStyle.identify} onClick={this.handleIdentify} />
        </div>
      </div>
    );
  }
}

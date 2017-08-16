/**
 * @file personAccount/AddressInput.js
 * @author fengwencong
 */
import React, { PropTypes, PureComponent } from 'react';
import { Input, Select } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import AddressStyle from './addressInput.less';

const Option = Select.Option;

export default class AddressInput extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func,
    provinceInfo: PropTypes.array.isRequired,
    cityInfo: PropTypes.array.isRequired,
    getCityInfoFunc: PropTypes.func.isRequired,
    setConnect: PropTypes.func.isRequired,
    getConnect: PropTypes.func.isRequired,
    returnOpinion: PropTypes.array.isRequired,
  }

  static defaultProps = {
    onChange: () => {},
  }

  constructor(props) {
    super(props);

    const { cityInfo, getConnect } = props;
    const connectInfo = getConnect();

    this.state = {
      cities: connectInfo.cities || '110000',
      secondCity: connectInfo.secondCity || (cityInfo[0] ? cityInfo[0].post : ''),
      detail: connectInfo.detail || '',
    };
  }

  componentWillMount() {
    const { getConnect } = this.props;
    const connectInfo = getConnect() || {};
    this.props.getCityInfoFunc({
      sjdm: connectInfo.cities,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { cityInfo, getConnect } = nextProps;
    const { cityInfo: preCityInfo } = this.props;
    const connectInfo = getConnect() || {};
    if (!_.isEqual(cityInfo, preCityInfo)) {
      this.setState({
        secondCity: connectInfo.secondCity || (cityInfo[0] ? cityInfo[0].post : ''),
      }, this.triggerChange);
    }
  }

  @autobind
  onSecondCityChange(value) {
    this.setState({
      secondCity: value,
      detail: '',
    }, this.triggerChange);
  }

  @autobind
  handleProvinceChange(value) {
    this.setState({
      cities: value,
      secondCity: '',
      detail: '',
    }, this.triggerChange);
    this.props.getCityInfoFunc({
      sjdm: value,
    });
  }

  @autobind
  handleDetailChange(e) {
    const detail = e.target.value;
    this.setState({ detail }, this.triggerChange);
  }

  @autobind
  triggerChange() {
    const { setConnect } = this.props;
    const { cities, secondCity, detail } = this.state;
    setConnect({
      detail,
      cities,
      secondCity,
    });
  }

  @autobind
  returnChangeState(key) {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return false;
    }
    let state = true;
    returnOpinion.map((item) => {
      if (item.zd === key) {
        state = false;
      }
      return state;
    });
    return state;
  }

  @autobind
  returnChangeWarning(key) {
    const { returnOpinion } = this.props;
    if (_.isEmpty(returnOpinion)) {
      return '';
    }
    let state = '';
    returnOpinion.map((item) => {
      if (item.zd === key) {
        state = 'warning';
      }
      return state;
    });
    return state;
  }

  render() {
    const { provinceInfo, cityInfo } = this.props;
    const { cities, secondCity, detail } = this.state;
    if (_.isEmpty(provinceInfo) || _.isEmpty(cityInfo)) {
      return (
        <div className={AddressStyle.addressWrapper}>
          <Input
            id="addressDetail"
            className={AddressStyle.formInput}
            maxLength="30"
            placeholder="请填写详细地址（不需要重复填写省市）"
            onChange={this.handleDetailChange}
            defaultValue={detail}
            disabled={this.returnChangeState('LXXX')}
          />
        </div>
      );
    }
    const provinceOptions = provinceInfo.map(
      province => <Option key={province.ibm}>{province.name}</Option>,
    );
    const cityOptions = cityInfo.map(
      city => <Option key={city.post}>{city.name}</Option>,
    );
    const wrapper = this.returnChangeWarning('LXXX') ?
      `${AddressStyle.addressWrapper} ${AddressStyle.addressWarning}` :
      `${AddressStyle.addressWrapper}`;
    return (
      <div className={wrapper}>
        <Select
          defaultValue={cities}
          onChange={this.handleProvinceChange}
          className={AddressStyle.formSelect}
          dropdownClassName="formOption angle"
          disabled={this.returnChangeState('LXXX')}
        >
          {provinceOptions}
        </Select>
        <Select
          value={secondCity}
          onChange={this.onSecondCityChange}
          className={AddressStyle.formSelect}
          dropdownClassName="formOption angle"
          disabled={this.returnChangeState('LXXX')}
        >
          {cityOptions}
        </Select>
        <Input
          id="addressDetail"
          className={AddressStyle.formInput}
          maxLength="30"
          placeholder="请填写详细地址（不需要重复填写省市）"
          onChange={this.handleDetailChange}
          defaultValue={detail}
          value={detail}
          disabled={this.returnChangeState('LXXX')}
        />
      </div>
    );
  }
}

/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Input, Select, Form } from 'antd';
// import _ from 'lodash';

import formStyles from '../personAccount/form.less';
import styles from './identity.less';

import BoxTitle from '../personAccount/BoxTitle';
// import SelectDepart from '../identity/selectDepart';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@Form.create()
export default class boxTitle extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      value: '',
    };
  }

  componentWillMount() {
  }

  @autobind
  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  @autobind
  handleSearch() {
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { value } = this.props;
    const suffix = value ?
      <span className={styles.searchClear} onClick={this.emitEmpty} /> : null;
    const prefix = value ?
      <span className={styles.searchIcon} onClick={this.handleSearch} /> :
      <span className={styles.searchIconP} />;
    return (
      <div className={`${styles.identity} ${formStyles.form}`}>
        <BoxTitle
          title="证件信息"
        />
        <div className={styles.selectDepart}>
          {/* <SelectDepart
            push={push}
            replace={replace}
            location={location}
            // empInforData={empInforData}
          /> */}
        </div>
        <div className={styles.searchBar}>
          <div className={styles.searchForm}>
            <Input
              placeholder="请输入一码通号码查询"
              prefix={prefix}
              suffix={suffix}
              value={value}
              onChange={this.handleChange}
              ref={(node) => { (this.searchInput = node); }}
              onPressEnter={this.handleSearch}
              maxLength={20}
            />
          </div>
        </div>
        <div className={`${styles.formArea} clearfix`}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="机构全称"
              colon={false}
            >
              {getFieldDecorator(
                'KHXM',
                {
                  // initialValue: 'xxx',
                  rules: [
                    { required: true, message: '机构全称不能为空!', whitespace: true },
                  ],
                },
              )(
                <Input placeholder="请输入机构全称" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="证件类型"
              colon={false}
            >
              {getFieldDecorator('select', {
                rules: [
                  { required: true, message: 'Please select your country!' },
                ],
              })(
                <Select>
                  <Option value="china">营业执照</Option>
                  <Option value="use">U.S.A</Option>
                </Select>,
              )}
            </FormItem>
            <div className={styles.tip}>
              <p>
                <span />营业执照：有效证件号为统一社会信用代码的，录入18位“社会信用代码”号码
              </p>
            </div>
            <FormItem
              {...formItemLayout}
              label="证件编号"
              colon={false}
              className={styles.label}
            >
              {getFieldDecorator('username', {
                rules: [{
                  pattern: /^\d*$/, message: '证件编号输入错误!',
                }, {
                  required: true, message: '请输入证件编号!',
                }],
              })(
                <Input placeholder="请输入证件编号" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="证件校验"
              colon={false}
              className={styles.label}
            >
              {getFieldDecorator('password', {
                rules: [{
                  pattern: /^\d*$/, message: '证件编号输入错误!',
                }, {
                  required: true, message: '请输入证件编号!',
                }],
              })(
                <Input placeholder="请再次输入证件编号" />,
              )}
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

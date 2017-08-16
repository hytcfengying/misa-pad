/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Input, Form, Button, Select } from 'antd';
import _ from 'lodash';

import styles from './identity.less';
import formStyles from '../personAccount/form.less';

const FormItem = Form.Item;
const Option = Select.Option;
const FORM_ITEM_LAYOUT = {
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
export default class codePass extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object,
    getCodePassFunc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      IdType: '4',
      showState: 'identity', // identity or code
    };
  }

  @autobind
  handleSubmit(e) {
    const { form, getCodePassFunc, location: { query } } = this.props;
    const { showState } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (_.isEmpty(err)) {
        console.log(values);
        getCodePassFunc({
          sqgy: query.empId,
          cxfs: showState === 'identity' ? 1 : 2,
          khxm: values.khxm || '',
          zjlb: values.zjlb || '',
          zjbh: values.zjbh || '',
          ymth: values.ymth || '',
        });
      }
    });
  }
  @autobind
  handleChangeID(valueID) {
    this.setState({ IdType: valueID });
    this.props.form.setFieldsValue({ zjbh: '', khxm: '' });
  }
  @autobind
  cardRule(rule, value, callback) {
    const { IdType } = this.state;
    const re1 = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/;
    const re2 = /^[0-9]{8}$/;
    if (value) {
      switch (IdType) {
        case '4':
          if (re1.test(value)) {
            callback();
          } else {
            callback('证件号码格式不正确！');
          }
          break;
        case '15':
          if (re2.test(value)) {
            callback();
          } else {
            callback('证件号码格式不正确！');
          }
          break;
        case '18':
          if (value.length > 30) {
            callback('证件号码格式不正确！');
          } else {
            callback();
          }
          break;
        default:
          callback();
      }
    }
    callback();
  }
  @autobind
  handleIdentity() {
    this.setState({
      showState: 'identity',
    });
  }
  @autobind
  handleCode() {
    this.setState({
      showState: 'code',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showState } = this.state;
    return (
      <div className={`${styles.identity} ${formStyles.form}`}>
        <div className={`${styles.boxFlex} ${styles.titleArea}`}>
          <div className={`${styles.title} ${styles.boxFlex1}`}>
            <span className={showState === 'identity' ? 'styles.active' : ''} onClick={this.handleIdentity}>按证件信息查询</span>
          </div>
          <div className={`${styles.title} ${styles.boxFlex1}`}>
            <span className={showState === 'code' ? 'styles.active' : ''} onClick={this.handleCode}>按一码通号码查询</span>
          </div>
        </div>
        <section className={styles.section}>
          <div className={`${styles.area} clearfix`}>
            <Form onSubmit={this.handleSubmit}>
              {
                showState === 'identity' ?
                  <div>
                    <FormItem
                      {...FORM_ITEM_LAYOUT}
                      label="证件类别"
                      colon={false}
                    >
                      {getFieldDecorator('zjlb', {
                        rules: [
                          { required: true, message: '请选择沪A股东账户' },
                        ],
                        initialValue: '4',
                      })(
                        <Select onChange={this.handleChangeID}>
                          <Option value="4">港澳通行证</Option>
                          <Option value="15">台湾居民来往大陆通行证</Option>
                          <Option value="18">外国人永久居留证</Option>
                        </Select>,
                      )}
                    </FormItem>
                    <FormItem
                      {...FORM_ITEM_LAYOUT}
                      label="证件号码"
                      colon={false}
                    >
                      {getFieldDecorator(
                        'zjbh',
                        {
                          rules: [
                            { required: true, message: '证件号码不能为空!', whitespace: true },
                            { validator: this.cardRule },
                          ],
                        },
                      )(
                        <Input
                          placeholder="请输入身份证"
                          onFocus={this.textChange}
                          autoComplete="off"
                        />,
                      )}
                    </FormItem>
                    <FormItem
                      {...FORM_ITEM_LAYOUT}
                      label="客户姓名"
                      colon={false}
                    >
                      {getFieldDecorator(
                        'khxm',
                        {
                          rules: [
                            { required: true, message: '姓名不能为空!', whitespace: true },
                            { max: 30, message: '姓名不能超过30个字符！' },
                          ],
                        },
                      )(
                        <Input placeholder="请输入姓名" autoComplete="off" />,
                      )}
                    </FormItem>
                  </div> :
                  <FormItem
                    {...FORM_ITEM_LAYOUT}
                    label="一码通号码"
                    colon={false}
                  >
                    {getFieldDecorator(
                      'ymth',
                      {
                        rules: [
                          { required: true, message: '一码通号码不能为空!', whitespace: true },
                          { max: 30, message: '姓名不能超过30个字符！' },
                        ],
                      },
                    )(
                      <Input placeholder="请输入一码通号码" autoComplete="off" />,
                    )}
                  </FormItem>
              }
              <Button
                type="primary"
                htmlType="submit"
                className={`${formStyles.checkBut}`}
              >
                <span className={styles.select} />查询
              </Button>
            </Form>
          </div>
        </section>
      </div>
    );
  }
}

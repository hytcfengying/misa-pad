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
    replace: PropTypes.func.isRequired,
    location: PropTypes.object,
    getCodePassFunc: PropTypes.func.isRequired,
    identityArr: PropTypes.array.isRequired,
    accountArr: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired,
    searchObj: PropTypes.object.isRequired,
    setShowState: PropTypes.func.isRequired,
    setSearchObj: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      showState: this.getShowState(), // identity or code or shareholder
    };
  }

  @autobind
  getShowState() {
    const { pathname, searchObj } = this.props;
    let str = '';
    if (searchObj && searchObj.cxfs) {
      str = searchObj.cxfs;
    } else if (pathname === 'infoSearch') {
      str = 'shareholder';
    } else if (pathname === 'partnerSearch') {
      str = 'code';
    } else {
      str = 'identity';
    }
    return str;
  }
  @autobind
  handleSubmit(e) {
    const {
      form,
      getCodePassFunc,
      location: { query },
      setSearchObj,
      pathname,
    } = this.props;
    const { showState } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (_.isEmpty(err)) {
        console.log(values);
        let typeId = 0;
        let searchShowObj = {};
        switch (showState) {
          case 'identity':
            typeId = 1;
            searchShowObj = {
              khxm: values.khxm || '',
              zjlb: values.zjlb || '',
              zjbh: values.zjbh || '',
            };
            break;
          case 'code':
            typeId = 2;
            searchShowObj = {
              ymth: values.ymth || '',
            };
            break;
          case 'shareholder':
            typeId = 3;
            searchShowObj = {
              zhlb: values.zhlb || '',
              gdh: values.gdh || '',
            };
            break;
          default:
            typeId = 0;
            break;
        }
        // 保存页面当前的搜索数据
        setSearchObj({
          obj: {
            ...searchShowObj,
            cxfs: showState,
          },
        });
        // 中登查询
        getCodePassFunc({
          query: {
            sqgy: query.empId,
            cxfs: typeId,
            khxm: values.khxm || '',
            zjlb: values.zjlb || '',
            zjbh: values.zjbh || '',
            ymth: values.ymth || '',
            zhlb: values.zhlb || '',
            gdh: values.gdh || '',
          },
          path: pathname,
          type: showState,
        });
      }
    });
  }
  @autobind
  handleChangeID() {
    const { showState } = this.state;
    switch (showState) {
      case 'identity':
        this.props.form.setFieldsValue({ zjbh: '', khxm: '' });
        break;
      case 'shareholder':
        this.props.form.setFieldsValue({ gdh: '' });
        break;
      default:
        break;
    }
  }
  handleChange = obj => () => {
    const { setShowState } = this.props;
    this.setState({
      showState: obj.item,
    });
    setShowState({ show: obj.item });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { showState } = this.state;
    const { pathname, identityArr, accountArr, searchObj } = this.props;
    let identityDefault = '';
    let accountDefault = '';
    if (identityArr && identityArr.length > 0) {
      identityDefault = _.toString(identityArr[0].ibm);
    }
    if (accountArr && accountArr.length > 0) {
      accountDefault = _.toString(identityArr[0].ibm);
    }
    let identityShow = true;
    let codeShow = true;
    let shareholderShow = true;
    if (pathname === 'infoSearch' || pathname === 'partnerSearch') {
      identityShow = false;
    }
    if (pathname === 'infoSearch') {
      codeShow = false;
    }
    if (pathname === 'codeSearch' || pathname === 'partnerSearch') {
      shareholderShow = false;
    }
    return (
      <div className={`${styles.identity} ${formStyles.form}`}>
        <div className={`${styles.boxFlex} ${styles.titleArea}`}>
          {
            identityShow ?
              <div className={`${styles.title} ${styles.boxFlex1}`}>
                <span
                  className={showState === 'identity' ? styles.active : ''}
                  onClick={this.handleChange({ item: 'identity' })}
                >按证件信息查询</span>
              </div> : ''
          }
          {
            codeShow ?
              <div className={`${styles.title} ${styles.boxFlex1}`}>
                <span
                  className={showState === 'code' ? styles.active : ''}
                  onClick={this.handleChange({ item: 'code' })}
                >按一码通号查询</span>
              </div> : ''
          }
          {
            shareholderShow ?
              <div className={`${styles.title} ${styles.boxFlex1}`}>
                <span
                  className={showState === 'shareholder' ? styles.active : ''}
                  onClick={this.handleChange({ item: 'shareholder' })}
                >按证券账户查询</span>
              </div> : ''
          }
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
                          { required: true, message: '请选择证件类别' },
                        ],
                        initialValue: searchObj.zjlb || identityDefault,
                      })(
                        <Select onChange={this.handleChangeID}>
                          {
                            identityArr.map(item =>
                              <Option
                                key={item.ibm}
                                value={_.toString(item.ibm)}
                              >
                                {item.note}
                              </Option>,
                            )
                          }
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
                          initialValue: searchObj.zjbh,
                          rules: [
                            { required: true, message: '证件号码不能为空!', whitespace: true },
                            { max: 40, message: '证件号码不能超过40个字符！' },
                          ],
                        },
                      )(
                        <Input
                          placeholder="请输入证件号码"
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
                          initialValue: searchObj.khxm,
                          rules: [
                            { required: true, message: '客户姓名不能为空!', whitespace: true },
                            { max: 120, message: '客户姓名不能超过120个字符！' },
                          ],
                        },
                      )(
                        <Input placeholder="请输入客户姓名" autoComplete="off" />,
                      )}
                    </FormItem>
                  </div> : ''
              }
              {
                showState === 'code' ?
                  <FormItem
                    {...FORM_ITEM_LAYOUT}
                    label="一码通号"
                    colon={false}
                  >
                    {getFieldDecorator(
                      'ymth',
                      {
                        initialValue: searchObj.ymth,
                        rules: [
                          { required: true, message: '一码通号不能为空!', whitespace: true },
                          { max: 20, message: '一码通号不能超过20个字符！' },
                        ],
                      },
                    )(
                      <Input placeholder="请输入一码通号" autoComplete="off" />,
                    )}
                  </FormItem> : ''
              }
              {
                showState === 'shareholder' ?
                  <div>
                    <FormItem
                      {...FORM_ITEM_LAYOUT}
                      label="账户类别"
                      colon={false}
                    >
                      {getFieldDecorator('zhlb', {
                        rules: [
                          { required: true, message: '请选择账户类别' },
                        ],
                        initialValue: searchObj.zhlb || accountDefault,
                      })(
                        <Select onChange={this.handleChangeID}>
                          {
                            accountArr.map(item =>
                              <Option
                                key={item.ibm}
                                value={_.toString(item.ibm)}
                              >
                                {item.note}
                              </Option>,
                            )
                          }
                        </Select>,
                      )}
                    </FormItem>
                    <FormItem
                      {...FORM_ITEM_LAYOUT}
                      label="股东号"
                      colon={false}
                    >
                      {getFieldDecorator(
                        'gdh',
                        {
                          initialValue: searchObj.gdh,
                          rules: [
                            { required: true, message: '股东号不能为空!', whitespace: true },
                            { max: 20, message: '股东号不能超过20个字符！' },
                          ],
                        },
                      )(
                        <Input
                          placeholder="请输入股东号"
                          onFocus={this.textChange}
                          autoComplete="off"
                        />,
                      )}
                    </FormItem>
                  </div> : ''
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

/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Input, Form, Button, Select } from 'antd';
import _ from 'lodash';
import { getIDCard } from '../../utils/cordova';

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
    clearCurentQuery: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      showState: this.getShowState(), // identity or code or shareholder
      scanIconShow: true,
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
        const resultObj = _.cloneDeep(values);
        let typeId = 0;
        let searchShowObj = {};
        switch (showState) {
          case 'identity':
            typeId = 1;
            searchShowObj = {
              khxm: resultObj.khxm || '',
              zjlb: resultObj.zjlb || '',
              zjbh: resultObj.zjbh || '',
              szjbh: resultObj.szjbh || '',
            };
            break;
          case 'code':
            typeId = 2;
            searchShowObj = {
              ymth: resultObj.ymth || '',
            };
            break;
          case 'shareholder':
            typeId = 3;
            searchShowObj = {
              zhlb: resultObj.zhlb || '',
              gdh: resultObj.gdh || '',
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
        resultObj.zjbh = resultObj.szjbh || resultObj.zjbh;
        // 中登查询
        getCodePassFunc({
          query: {
            sqgy: query.empId,
            cxfs: typeId,
            khxm: resultObj.khxm || '',
            zjlb: resultObj.zjlb || '',
            zjbh: resultObj.zjbh || '',
            ymth: resultObj.ymth || '',
            zhlb: resultObj.zhlb || '',
            gdh: resultObj.gdh || '',
          },
          path: pathname,
          type: showState,
        });
      }
    });
  }
  @autobind
  handleChangeID(value) {
    const { showState, scanIconShow } = this.state;
    const { clearCurentQuery } = this.props;
    clearCurentQuery({ show: showState });
    switch (showState) {
      case 'identity':
        if (scanIconShow) {
          this.props.form.setFieldsValue({ szjbh: '', khxm: '' });
        } else {
          this.props.form.setFieldsValue({ zjbh: '', khxm: '' });
        }
        if (value === '1') {
          this.setState({
            scanIconShow: true,
          });
        } else {
          this.setState({
            scanIconShow: false,
          });
        }
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
  @autobind
  handleClick() {
    const { form } = this.props.form;
    getIDCard(
      (result) => {
        const resultObjct = JSON.parse(result);
        form.setFieldsValue({
          zjbh: resultObjct.ID,
          khxm: resultObjct.Name,
        });
      },
      err => console.log(err),
    );
  }
  // 姓名校验
  @autobind
  nameCheck(rule, value, callback) {
    if (value) {
      const length = this.asciilen(value);
      if (length > 120 && length !== 0) {
        callback('必须小于120个字符（汉字长度计为2）');
      }
      callback();
    } else {
      callback();
    }
  }

  asciilen(src) {
    let byteLen = 0;
    const len = src.length;
    if (src) {
      for (let i = 0; i < len; i++) {
        if (src.charCodeAt(i) > 255) {
          byteLen += 2;
        } else {
          byteLen++;
        }
      }
      return byteLen;
    }
    return 0;
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { showState, scanIconShow } = this.state;
    const { pathname, identityArr, accountArr, searchObj } = this.props;
    let identityDefault = '';
    let accountDefault = '';
    let checkScanState = false;
    if (identityArr && identityArr.length > 0) {
      identityDefault = _.toString(identityArr[0].ibm);
    }
    if (identityArr &&
      identityArr.length > 0 &&
      identityArr[0].ibm === 1 &&
      scanIconShow) {
      checkScanState = true;
    }
    if (accountArr && accountArr.length > 0) {
      accountDefault = _.toString(accountArr[0].ibm);
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
                        <Select
                          onChange={this.handleChangeID}
                          dropdownClassName="angle"
                        >
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
                    {
                      checkScanState ?
                        <div className={formStyles.identityArea}>
                          <FormItem
                            {...FORM_ITEM_LAYOUT}
                            label="证件号码"
                            colon={false}
                          >
                            {getFieldDecorator(
                              'szjbh',
                              {
                                initialValue: searchObj.szjbh,
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
                          <div onClick={this.handleClick} className={formStyles.scanIcon} />
                        </div> :
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
                    }
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
                            { validator: this.nameCheck },
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
                        <Select
                          onChange={this.handleChangeID}
                          dropdownClassName="angle"
                        >
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
                      label="证券账号"
                      colon={false}
                    >
                      {getFieldDecorator(
                        'gdh',
                        {
                          initialValue: searchObj.gdh,
                          rules: [
                            { required: true, message: '证券账号不能为空!', whitespace: true },
                            { max: 20, message: '证券账号不能超过20个字符！' },
                          ],
                        },
                      )(
                        <Input
                          placeholder="请输入证券账号"
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

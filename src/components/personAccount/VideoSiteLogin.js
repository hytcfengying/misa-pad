/**
 * @file
 * @author fengying
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Input, Form, Button } from 'antd';
import _ from 'lodash';
import styles from './videoSiteLogin.less';
import formStyles from './form.less';


import BoxTitle from './BoxTitle';
import SiteInfor from './VideoSiteInfor';
import NextPop from './nextPop';

const FormItem = Form.Item;
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
export default class VideoSiteLogin extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object,
    stepCacheData: PropTypes.array.isRequired,
    saveStepFunc: PropTypes.func.isRequired,
    getBdidFunc: PropTypes.func.isRequired,
    bdid: PropTypes.string.isRequired,
    acceptor: PropTypes.object.isRequired,
    witnessLoginFunc: PropTypes.func.isRequired,
    witness: PropTypes.object.isRequired,
  }

  static defaultProps = {
    location: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      witnessId: 0,
      // 下一步
      accessState: true,
      cacheKey: 'KHTJ',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.witness)) {
      this.setState({
        isActive: true,
      });
    }
  }

  @autobind
  getStepValue() {
    return {
      JZR: this.state.witnessId,
      KHSP: '',
      JZFS: 2,
    };
  }
  @autobind
  handleSubmit(e) {
    const { form, witnessLoginFunc } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (_.isEmpty(err)) {
        witnessLoginFunc(values);
        this.setState({
          witnessId: values.witnessId,
        });
      }
    });
  }
  @autobind
  witnessIdCheck(rule, value, callback) {
    const { acceptor } = this.props;
    if (_.parseInt(value) === _.parseInt(acceptor.userId)) {
      callback('见证人与受理人不能为同一人!');
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      isActive,
      accessState,
      cacheKey,
    } = this.state;
    const {
      push,
      location,
      getBdidFunc,
      saveStepFunc,
      bdid,
      acceptor,
      witness,
    } = this.props;
    // 点击之后成功的话就置灰
    const isCheck = isActive ? formStyles.activited : '';
    const getStepValue = this.getStepValue();
    return (
      <div className={`${styles.videoSite} ${formStyles.form}`}>
        <section className={styles.section}>
          <BoxTitle
            title="开户见证人登录"
            radius={false}
          />
          <div className={`${styles.loginArea} clearfix`}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...FORM_ITEM_LAYOUT}
                label="见证人"
                colon={false}
                className={styles.label}
                disabled={isActive}
              >
                {getFieldDecorator('witnessId', {
                  rules: [{
                    pattern: /^\d*$/, message: '见证人员工号输入错误!',
                  }, {
                    required: true, message: '请输入见证人员工号!',
                  }, {
                    validator: this.witnessIdCheck,
                  }],
                })(
                  <Input disabled={isCheck} />,
                )}
              </FormItem>
              <FormItem
                {...FORM_ITEM_LAYOUT}
                label="密码"
                colon={false}
                className={styles.label}
                disabled={isActive}
              >
                {getFieldDecorator('witnessPass', {
                  rules: [{
                    required: true, message: '请输入密码!',
                  }],
                })(
                  <Input disabled={isCheck} type="password" />,
                )}
              </FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className={`${formStyles.checkBut} ${isCheck}`}
              >
                登录
              </Button>
            </Form>
          </div>
        </section>
        {
          isActive ? (
            <div>
              <section className={styles.section}>
                <BoxTitle
                  title="见证人资格"
                  radius={false}
                />
                <div className={styles.siteInforList}>
                  <SiteInfor
                    infor={acceptor}
                    title="开户受理人"
                  />
                  <SiteInfor
                    infor={witness}
                    title="开户见证人"
                  />
                </div>
              </section>
              <NextPop
                cacheKey={cacheKey}
                accessState={accessState}
                push={push}
                location={location}
                stepValue={getStepValue}
                getBdidFunc={getBdidFunc}
                saveStepFunc={saveStepFunc}
                bdid={bdid}
                content="提交"
              />
            </div>
          ) : ''
        }
      </div>
    );
  }
}

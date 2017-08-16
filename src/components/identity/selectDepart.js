/**
 * @file identity/selectDepart.js
 * @author zzc
 */
import React, { PropTypes, PureComponent } from 'react';
import { Select } from 'antd';
import { autobind } from 'core-decorators';

import styles from './selectDepart.less';

const Option = Select.Option;

export default class secDepar extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    empInforData: PropTypes.object.isRequired,
    tapDisabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  componentDidMount() {
  }

  @autobind
  handleChangeID(valueID) {
    const { replace, location: { query } } = this.props;
    replace({
      pathname: '/personAccount/identity',
      query: {
        ...query,
        selectDep: valueID,
      },
    });
  }

  yybCreate() {
    const { empInforData } = this.props;
    const yybNote = [];
    let yyb = {
      yyb: 1,
      yyb_note: 'null',
    };
    if (empInforData.yyb) {
      yyb = {
        yyb: empInforData.yyb,
        yyb_note: empInforData.yyb_note,
      };
    }
    const yybLi = [yyb];
    yybLi.map(item =>
      yybNote.push(<Option key={item.yyb_note}>{item.yyb_note}</Option>),
    );
    return yybNote;
  }

  render() {
    const { empInforData, tapDisabled } = this.props;
    // return (
    //   <div className={styles.selDeaprtBox}>
    //     <span className={styles.text}>{empInforData.yyb_note}</span>
    //     <span className={styles.triangle}>x</span>
    //   </div>
    // );
    return (
      <div className={styles.selDeaprtBox}>
        <Select value={empInforData.yyb_note} disabled={tapDisabled}>
          {this.yybCreate()}
        </Select>
      </div>
    );
  }
}


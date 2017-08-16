/**
 * @fileOverview layouts/Loading.js
 * @author sunweibin
 */

import React, { PropTypes } from 'react';
import { Spin } from 'antd';

import styles from './Loading.less';

function Loading({
  loading,
  loadingTxt,
}) {
  if (!loading) {
    return null;
  }

  return (
    <div className={styles.popmask}>
      <Spin tip={loadingTxt} spinning={loading} size="large" />
    </div>
  );
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadingTxt: PropTypes.string.isRequired,
};

export default Loading;

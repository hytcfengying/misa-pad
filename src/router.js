/**
 * @file routes.js
 * @author maoquan(maoquan@htsc.com)
 */

import React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
} from 'dva/router';

import Frame from './layouts/Frame';

import searchHome from './routes/search/SearchHome';
import serchResult from './routes/search/SearchResult';

import investList from './routes/personAccount/InvestList';
import investDetail from './routes/personAccount/InvestDetail';
import identityHome from './routes/personAccount/IdentityHome';
import questionHome from './routes/personAccount/Question';
import inforConfirm from './routes/personAccount/InforConfirm';
import imageHome from './routes/personAccount/ImageHome';
import videoHome from './routes/personAccount/VideoHome';
import infoWrite from './routes/personAccount/InfoWrite';
import videoSite from './routes/personAccount/VideoSite';
import complete from './routes/personAccount/Complete';

import orgIdentityHome from './routes/organizationAccount/IdentityHome';

import csdcHome from './routes/csdc/CSDCHome';
import csdcDetail from './routes/csdc/CSDCDetail';

import histRecord from './routes/csdc/HistRecord';
import histRecordList from './routes/csdc/HistRecordList';

const routes = ({ history }) => (// eslint-disable-line
  <Router history={history}>
    <Route path="/" component={Frame}>
      <IndexRedirect to="/search" />
      <Route path="search">
        <IndexRoute component={searchHome} />
        <Route path="result" component={serchResult} />
      </Route>
      {/** 侧栏 */}
      <Route path="personAccount">
        <IndexRoute component={identityHome} />
        <Route path="identity" component={identityHome} />
        <Route path="invest">
          <IndexRoute component={investList} />
          <Route path="detail" component={investDetail} />
        </Route>
        <Route path="question" component={questionHome} />
        <Route path="confirm" component={inforConfirm} />
        <Route path="image" component={imageHome} />
        <Route path="info" component={infoWrite} />
        <Route path="video">
          <IndexRoute component={videoHome} />
          <Route path="site" component={videoSite} />
        </Route>
        <Route path="complete" component={complete} />
      </Route>
      <Route path="organizationAccount">
        <IndexRoute component={orgIdentityHome} />
        <Route path="identity" component={orgIdentityHome} />
      </Route>
      <Route path="histRecord">
        <IndexRoute component={histRecord} />
        <Route path="histRecordList" component={histRecordList} />
      </Route>
      <Route path="codeSearch" component={csdcHome} />
      <Route path="stockSearch" component={csdcHome} />
      <Route path="relationSearch" component={csdcHome} />
      <Route path="infoSearch" component={csdcHome} />
      <Route path="partnerSearch" component={csdcHome} />
      <Route path="searchDetail" component={csdcDetail} />
    </Route>
  </Router>
);

export default routes;

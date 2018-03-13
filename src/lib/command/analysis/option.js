// @flow

import startsWith from 'lodash/startswith';

type TypeIsOption = (string) => boolean;

export const isOption : TypeIsOption = value => startsWith(value, '--');

type TypeCallbackSetOption = (string, any) => void; 

type TypeSetOption = (string, callback? : TypeCallbackSetOption) => void;

export const setOption : TypeSetOption = (option, callback) => {

  const indexSet = option.indexOf('=');
  const hasValue = indexSet !== -1;

  const name = option.substring(2, hasValue ? indexSet : option.length);
  const value = option.substring(indexSet + 1, option.length);

  callback && callback(name, hasValue ? value : true);
};
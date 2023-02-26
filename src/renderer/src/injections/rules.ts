const emailRegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlRegExp =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const required = (v, text = '此為必填項目') => (!!v && !(v < 0)) || text;
const requiredNum = (v, text) => typeof v === 'number' || required(v, text);
const email = (v, text = 'email 格式錯誤') => (v ? emailRegExp.test(v) || text : true);
const url = (v, text = 'url 格式錯誤') => (v ? urlRegExp.test(v) || text : true);
const maxLength = (v, length, text = '') =>
  `${v}` ? `${v}`.length <= length || text || `長度不可超過 ${length}` : true;
const minLength = (v, length, text = '') =>
  `${v}` ? `${v}`.length >= length || text || `長度不可少於 ${length}` : true;

const rules = {
  required,
  requiredNum,
  email,
  url,
  maxLength,
  minLength
};

export default rules;

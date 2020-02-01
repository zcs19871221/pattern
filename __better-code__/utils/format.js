'use strict';

require('core-js/modules/es.array.iterator');

/* eslint-disable import/no-unresolved */
const exec = require('./exec');

module.exports = ({
  options = ['--write', '--list-different'],
  src = ['.'],
  ext = ['.js', '.jsx', '.css', '.less', '.html', '.json', '.md'],
} = {}) => {
  if (!Array.isArray(options) || !Array.isArray(src) || !Array.isArray(ext)) {
    throw new Error('prettier参数错误');
  }

  const toPrettierFile = [
    `${src.length === 1 ? src : `{${src.join(',')}}`}/**/*{${ext.join(',')}}`,
  ];
  return exec({
    command: 'node',
    args: [
      './node_modules/prettier/bin-prettier.js',
      ...options,
      toPrettierFile,
    ],
    name: 'prettier',
    opts: {
      stdio: 'inherit',
    },
  });
};

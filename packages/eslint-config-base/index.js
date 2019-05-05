module.exports = {
   extends: [
      'kentcdodds',
      'kentcdodds/jest',
      'plugin:react/recommended',
      'plugin:prettier/recommended',
      'prettier/react',
   ],
   rules: {
      'react/require-default-props': 'error',
   },
};

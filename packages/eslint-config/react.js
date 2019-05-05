module.exports = {
   extends: [
      'kentcdodds',
      'kentcdodds/jest',
      'kentcdodds/react',
      'kentcdodds/jsx-a11y',
      'plugin:prettier/recommended',
      'prettier/react',
   ],
   rules: {
      'react/require-default-props': 'error',
   },
};

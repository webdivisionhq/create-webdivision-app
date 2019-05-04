module.exports = {
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "lf",
        trailingComma: "es5",
        tabWidth: 2,
        printWidth: 120,
        singleQuote: true,
        semi: true
      }
    ]
  }
};

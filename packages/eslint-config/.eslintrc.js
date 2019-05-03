module.exports = {
  extends: [
    "react-app",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier/react"
  ],
  rules: {
    "react/require-default-props": "error",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "lf",
        trailingComma: "es5",
        tabWidth: 4,
        printWidth: 120,
        singleQuote: true,
        semi: true
      }
    ]
  }
};

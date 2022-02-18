/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    es6: true,
    es2017: true,
    es2020: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:unicorn/recommended",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
    "unicorn",
  ],
  rules: {
    "array-bracket-spacing": ["error", "never"],
    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": ["error", "always"],
    "arrow-spacing": ["error", {
      before: true, after: true,
    }],
    "class-methods-use-this": "error",
    "comma-dangle": ["error", "always-multiline"],
    "computed-property-spacing": ["error", "never"],
    eqeqeq: ["error", "smart"],
    "implicit-arrow-linebreak": ["error", "beside"],
    indent: ["error", 2],
    "no-console": "error",
    "no-duplicate-imports": ["error", { includeExports: true }],
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "no-useless-constructor": "error",
    "no-var": "error",
    "no-whitespace-before-property": "error",
    "object-curly-newline": ["error", {
      ExportDeclaration: {
        multiline: true,
        minProperties: 2,
      },
      ImportDeclaration: {
        multiline: true,
        minProperties: 2,
      },
      ObjectExpression: {
        multiline: true,
        minProperties: 2,
      },
      ObjectPattern: { consistent: true },
    }],
    "object-curly-spacing": ["error", "always"],
    "object-shorthand": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    quotes: ["error", "double"],
    "quote-props": ["error", "as-needed"],
    "require-await": "error",
    semi: "error",
    "sort-imports": ["error", {
      allowSeparatedGroups: true,
      ignoreDeclarationSort: true,
    }],
    "space-before-blocks": ["error", "always"],
    "import/newline-after-import": "error",
    "import/order": ["error", { alphabetize: { order: "asc" } }],
  },
  overrides: [
    {
      files: [
        ".eslintrc.cjs",
        "jest.config.cjs",
      ],
      rules: { "unicorn/prefer-module": "off" },
    },
    {
      files: [
        "*.ts",
      ],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/typescript",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        project: "./tsconfig.json",
      },
      plugins: [
        "@typescript-eslint",
      ],
    },
    {
      files: [
        "*.test.ts",
      ],
      plugins: [
        "jest",
      ],
      extends: [
        "plugin:jest/all",
      ],
      rules: {
        "jest/no-hooks": "off",
        "jest/no-standalone-expect": [
          "error",
          { additionalTestBlockFunctions: ["afterEach"] },
        ],
        "jest/prefer-expect-assertions": "off",
      },
    },
  ],
};

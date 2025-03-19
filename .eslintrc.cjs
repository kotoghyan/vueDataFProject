const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features
  },

  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    // 'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    // 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    // https://github.com/prettier/eslint-config-prettier#installation
    // usage with Prettier, provided by 'eslint-config-prettier'.
    'prettier',
  ],

  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue',

    // https://github.com/typescript-eslint/typescript-eslint/issues/389#issuecomment-509292674
    // Prettier has not been included as plugin to avoid performance impact
    // add it as an extension for your IDE
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
  },

  // add your custom rules here
  rules: {
    'prefer-promise-reject-errors': 'off',
    'no-debugger': isDev ? 'off' : 'error',
    'no-async-promise-executor': 'off',
    'no-case-declarations': 'off',
    'dot-notation': 'error',
    'no-useless-concat': 'error',
    'no-console': isDev ? 'off' : 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'prefer-const': 'error',
    'no-else-return': 'error',
    eqeqeq: 'error',
    'block-scoped-var': 'error',
    curly: 'error',
    'guard-for-in': 'error',
    'no-alert': 'error',
    'no-return-await': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    yoda: 'error',
    'no-undef-init': 'error',
    'no-label-var': 'error',
    'no-lonely-if': 'error',
    'no-unneeded-ternary': 'error',
    'operator-assignment': 'error',
    'arrow-body-style': 'error',
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/padding-line-between-blocks': 'error',
    'vue/define-macros-order': [
      'error',
      {
        order: ['defineProps', 'defineEmits', 'defineSlots'],
      },
    ],
    'vue/html-button-has-type': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/no-useless-mustaches': 'error',
    'vue/no-duplicate-attr-inheritance': 'error',
    'vue/no-multiple-objects-in-class': 'error',
    'vue/no-potential-component-option-typo': 'error',
    'vue/no-template-target-blank': 'error',
    'vue/no-this-in-before-route-enter': 'error',
    'vue/no-use-v-else-with-v-for': 'error',
    'vue/no-v-text': 'error',
    'vue/prefer-define-options': 'error',
    'vue/prefer-prop-type-boolean-first': 'error',
    'vue/prefer-separate-static-class': 'error',
    'vue/require-macro-variable-name': 'error',
    'vue/valid-define-options': 'error',
    'vue/dot-notation': 'error',
    'vue/eqeqeq': 'error',
    'vue/no-console': isDev ? 'off' : 'error',
    'vue/no-constant-condition': 'error',
    'vue/no-empty-pattern': 'error',
    'vue/no-loss-of-precision': 'error',
    'vue/no-sparse-arrays': 'error',
    'vue/no-useless-concat': 'error',
    'vue/object-shorthand': 'error',
    'vue/prefer-template': 'error',
  },
}

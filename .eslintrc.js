module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}

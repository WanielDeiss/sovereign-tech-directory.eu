module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Nur erlaubte Commit Types
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'chore', 'build', 'ci']
    ],
    // Subject Line Regeln
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 72],
    'subject-full-stop': [2, 'never', '.'],
    // Body und Footer optional (Default-Verhalten)
    'body-empty': [0, 'never'],
    'footer-empty': [0, 'never']
  }
};

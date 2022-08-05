# get all translation files that were updated
# from `yarn i18n:extract`
HEAD_REF="${1:-main}"
CHANGED_FILES=$(git diff $HEAD_REF..HEAD --name-only -- src/locales/**/*.po)

# Bail if there were changes to the template file.
# that weren't included in the commit.
if ! [ -z "$CHANGED_FILES" ]; then
  echo "🍎 PRs should not change .po files. Only changes to the messages.pot are allowed."
  exit 1
else
  echo "🍏 Translations are good."
  exit 0
fi
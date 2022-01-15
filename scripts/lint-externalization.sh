# If no changes to source files, don't run the i18n extraction.
SRC_CHANGED_FILES=$(git diff --name-only src/**/*)
if [ -z "$SRC_CHANGED_FILES" ]; then
  echo "🍏 Source files haven't changed. No changes to translation source file are necessary."
  exit 0
fi

# extract new strings
yarn i18n:extract

# get all translation files that were updated
# from `yarn i18n:extract`
LOCALE_CHANGED_FILES=$(git diff --name-only src/locales)

# Bail if there were changes to translation files
# that weren't included in the commit.
if ! [ -z "$LOCALE_CHANGED_FILES" ]; then
  echo "🍎 Translation source file is out of date. Review and commit changes to $LOCALE_CHANGED_FILES."
  exit 1
else
  echo "🍏 Translation source file is up to date."
  exit 0
fi
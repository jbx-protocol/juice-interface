# extract new strings
yarn i18n:extract

# get all translation files that were updated
# from `yarn i18n:extract`
LOCALE_CHANGED_FILES=$(git diff --name-only src/locales)

# Bail if there were changes to translation files
# that weren't included in the commit.
if ! [ -z "$LOCALE_CHANGED_FILES" ]; then
  echo "🍎 Translation source files are out of date. Run 'yarn i18n:extract' locally and commit changes to the following files:\n$LOCALE_CHANGED_FILES."
  exit 1
else
  # bail if .po files contain git merge conflict diff artefact (like <<<<< HEAD)
  for File in $(find src/locales -maxdepth 2 -regex '.*.po')
  do
    if grep -q '<<<' "$File"; then
      echo "🍎 Translation source files contain artefacts from git merge conflict."
      exit 1
    fi
  done

  echo "🍏 Translation source files are up to date."
  exit 0
fi
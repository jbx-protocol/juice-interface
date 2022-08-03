# extract new strings
yarn i18n:extract

# get all translation files that were updated
# from `yarn i18n:extract`
FILE_DIFF=$(git diff --name-only src/locales/messages.pot)

# Bail if there were changes to the template file.
# that weren't included in the commit.
if ! [ -z "$FILE_DIFF" ]; then
  echo "🍎 messages.pot is out of date. Run 'yarn i18n:extract' locally and commit the changes."
  exit 1
else
  # bail if .po files contain git merge conflict diff artefact (like <<<<< HEAD)
  for File in $(find src/locales -maxdepth 2 -regex 'messages.pot')
  do
    if grep -e '<<<' -e '>>>' -e '====' "$File"; then
      echo "🍎 messages.pot contains artifacts from git merge conflict."
      exit 1
    fi
  done

  echo "🍏 messages.pot is up to date."
  exit 0
fi
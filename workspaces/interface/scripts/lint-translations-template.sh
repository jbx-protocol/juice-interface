# extract new strings
yarn i18n:extract

POT_FILE="src/locales/messages.pot"

# get all translation files that were updated
# from `yarn i18n:extract`
FILE_DIFF=$(git diff --name-only $POT_FILE)

# Bail if there were changes to the template file.
# that weren't included in the commit.
if ! [ -z "$FILE_DIFF" ]; then
  echo "🍎 messages.pot is out of date. Run 'yarn i18n:extract' locally and commit the changes."
  exit 1
else
  # bail if pot file contain git merge conflict diff artefact (like <<<<< HEAD)
  if grep -e '<<<' -e '>>>' -e '====' "$POT_FILE"; then
    echo "🍎 messages.pot contains artifacts from git merge conflict."
    exit 1
  fi

  echo "🍏 messages.pot is up to date."
  exit 0
fi
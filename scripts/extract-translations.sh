# https://github.com/lingui/js-lingui/issues/952#issuecomment-765449330
export NODE_ENV=development

lingui extract --clean


# Append newline to every file,
# to match the behavior of the Crowdin GitHub
# action script.
LOCALE_CHANGED_FILES=$(git diff --name-only src/locales)
for FILE in $LOCALE_CHANGED_FILES
do
	echo "" >> $FILE
done

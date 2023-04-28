#! /bin/sh
#
# To install cwebp on...
# MacOS: brew install webp
# Ubuntu: sudo apt install webp
# Arch: sudo pacman -S libwebp

# Change quality from 0-100 to change compression ratio. See https://developers.google.com/speed/webp/docs/cwebp#options
QUALITY=85

if ! command -v cwebp > /dev/null 2>&1; then
  echo "Error: cwebp was not found in your path. See https://developers.google.com/speed/webp/download."
  echo "\`brew install webp\` or "
  exit 1
fi

if [ $(pwd | xargs basename) != "juice-interface" ]; then
  echo "Error: you must run this script from the root juice-interface directory"
  exit 1
fi

IMGS=$(find ./public -type f -name "*.png" -o -name "*.jpg" -o -name "*.jpeg")

for IMG_PATH in $IMGS; do
 cwebp -quiet "$IMG_PATH" -q $QUALITY -o "${IMG_PATH%.*}.webp"
 BASE=$(basename $IMG_PATH)
 REPLACE="${BASE%.*}.webp"
 grep -rl "$BASE" src | xargs -I {} sed -i "s#$BASE#$REPLACE#g" {} 2>/dev/null
 rm $IMG_PATH
done

grep -ri -e "png" -e "jpg" -e "jpeg" src > remaining-references.txt
echo "Remaining references to old filetypes written to remaining-references.txt"

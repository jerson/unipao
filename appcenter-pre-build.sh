#!/bin/sh
cd $APPCENTER_SOURCE_DIRECTORY
echo "Config copied"
cp ./src/Config.js-dist ./src/Config.js
echo "Config loaded"
sed -i '' -e 's/SUPER_SECURE_CODE/'"$SUPER_SECURE_CODE"'/g' Config.js
sed -i '' -e 's/AUTHOR/'"$AUTHOR"'/g' Config.js
cat Config.js
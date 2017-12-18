#!/bin/sh
cd $APPCENTER_SOURCE_DIRECTORY
echo "Config copied"
cp Config.js-dist Config.js
echo "Config loaded"
sed -i 's/SUPER_SECURE_CODE/'"$SUPER_SECURE_CODE"'/g' Config.js
sed -i 's/AUTHOR/'"$AUTHOR"'/g' Config.js
cat Config.js
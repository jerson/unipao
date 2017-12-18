#!/bin/sh
cd $APPCENTER_SOURCE_DIRECTORY
echo "Config copied"
cp Config.js-dist Config.js
echo "Config loaded"
sed 's/SUPER_SECURE_CODE/$SUPER_SECURE_CODE/' Config.js
sed 's/AUTHOR/$AUTHOR/' Config.js

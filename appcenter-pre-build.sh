#!/bin/sh
cd $APPCENTER_SOURCE_DIRECTORY
echo "Config copied"
cp ./src/Config.tsx-dist ./src/Config.tsx
echo "Config loaded"
sed -i '' -e 's/SUPER_SECURE_CODE/'"$SUPER_SECURE_CODE"'/g' ./src/Config.tsx
sed -i '' -e 's/AUTHOR/'"$AUTHOR"'/g' ./src/Config.tsx
cat ./src/Config.tsx
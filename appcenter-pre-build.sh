#!/bin/sh
cp Config.js-dist Config.js
sed -i 's/SUPER_SECURE_CODE/$SUPER_SECURE_CODE/g' Config.js
sed -i 's/AUTHOR/$AUTHOR/g' Config.js

#!/bin/sh
/usr/local/lib/node_modules/typescript/bin/tsc --version
/usr/local/lib/node_modules/typescript/bin/tsc --rootDir /Users/franksiderio/GitHub/OperatingSystems/source/ --outDir /Users/franksiderio/GitHub/OperatingSystems/distrib/ /Users/franksiderio/GitHub/OperatingSystems/source/*.ts /Users/franksiderio/GitHub/OperatingSystems/source/host/*.ts /Users/franksiderio/GitHub/OperatingSystems/source/os/*.ts

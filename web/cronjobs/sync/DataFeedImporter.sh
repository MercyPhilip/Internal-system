#!/bin/bash

## generate a B2B DataFeed csv ########################################
if ps ax | grep -v grep | grep "DataFeedImporter.php" > /dev/null; then
	echo -n "DataFeedImporter is Already Running....... :: "
	date
	echo ""
else
	DIR=/tmp/datafeed/
	#DIR=/tmp/datafeed/test/
	API=https://192.168.1.5/api/
	#API=http://192.168.1.100:8080/api/
	if ls ${DIR}/*.json &>/dev/null
	then
	    echo -n "Start to import json files .... "
	    date
	    	/usr/bin/php /var/www/magentob2b/web/cronjobs/sync/DataFeedImporter.php $API $DIR
	    	#/usr/bin/php /home/philip/bitbucket/magento-b2b/web/cronjobs/sync/DataFeedImporter.php $API $DIR
	    echo -n "DONE"
	    date
	else
		echo -n "NOT json files found under ${DIR}"
	    date
	fi
	echo ""
fi
#!/bin/bash

## generate a B2B DataFeed csv ########################################
if ps ax | grep -v grep | grep "DataFeedImporter.php" > /dev/null; then
	echo -n "DataFeedImporter is Already Running....... :: "
	date
	echo ""
else
	DIR=/tmp/datafeed/
	API=https://hobbymaster.com.au/api/
	if ls ${DIR}/*.json &>/dev/null
	then
	    echo -n "Start to import json files .... "
	    date
	    	/usr/bin/php /var/www/hobbymaster/web/cronjobs/sync/DataFeedImporter.php $API $DIR
	    echo -n "DONE"
	    date
	else
		echo -n "NOT json files found under ${DIR}"
	    date
	fi
	echo ""
fi

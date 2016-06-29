#!/bin/bash

TODAY=`date +%d`
TOMORROW=`date +%d -d "1 day"`

# See if tomorrow's day is less than today's
if [ $TOMORROW -lt $TODAY ]; then
	echo "This is the last day of the month"
	## run reverse xero exporter ########################################
	if ps ax | grep -v grep | grep "ReverseSalesReportRunnerphp" > /dev/null; then
	echo -n "ReverseSalesReportRunner is Already Running....... :: "
	date
	echo -n " "
	else
	/usr/bin/php /var/www/magentob2b/web/cronjobs/report/ReverseSalesReportRunner.php >> /tmp/log/ReverseSalesReportRunner_`date +"%d_%b_%y"`.log
	fi
else
	echo -n "This is not the last day of the month::"
	date
	exit
fi
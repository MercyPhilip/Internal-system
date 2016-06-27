#!/bin/bash

## run reverse xero exporter ########################################
if ps ax | grep -v grep | grep "SalesReverseExportor_Xero.php" > /dev/null; then
echo -n "SalesReverseExportor_Xero is Already Running....... :: "
date
echo -n " "
else
/usr/bin/php /var/www/magentob2b/web/cronjobs/report/ReverseSalesReportRunner.php >> /tmp/log/ReverseSalesReportRunner_`date +"%d_%b_%y"`.log
fi



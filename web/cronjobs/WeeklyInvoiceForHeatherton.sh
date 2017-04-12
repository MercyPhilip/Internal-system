#!/bin/bash

## run Weekly Invoice For Heatherton ########################################
if ps ax | grep -v grep | grep "WeeklyInvoiceForHeatherton.php" > /dev/null; then
echo -n "WeeklyInvoiceForHeatherton is Already Running....... :: "
date
echo -n " "
else
/usr/bin/php /var/www/magentob2b/web/cronjobs/report/WeeklyInvoiceForHeatherton.php >> /tmp/WeeklyInvoiceForHeatherton_`date +"%d_%b_%y"`.log
fi
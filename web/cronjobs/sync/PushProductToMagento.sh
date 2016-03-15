#!/bin/bash

SERVER=backup.budgetpc.com.au
SERVER_PATH=/var/www/html/var/import/
FILE_DIR=/tmp/
FILE_NAME=productUpdate.tar.gz
DESTINATION=/var/pushdata/archive/
RECIPIENTS="larry@budgetpc.com.au"

## generate a MAGENTO product file ########################################
if ps ax | grep -v grep | grep "ProductToMagento.php" > /dev/null; then
	echo -n "ProductToMagento is Already Running....... :: "
	date
	echo
else
	echo -n '== Generating the file ... ::'
	date
	/usr/bin/php /var/www/magentob2b/web/cronjobs/sync/ProductToMagento.php $FILE_DIR
	FILE_PATH=${FILE_DIR}/${FILE_NAME}
	if [ -e "$FILE_PATH" ]
	then
		SERVER_FILE=${SERVER}:${SERVER_PATH}productUpdate_`date "+%Y_%m_%d_%H_%M_%S"`.tar.gz
		echo -n "== coping ${FILE_PATH} TO ${SERVER_FILE} :: "
		date
		scp $FILE_PATH ec2-user@${SERVER_FILE}
		ret=$?
		if [ "${ret}" -ne "0" ] 
		then
			echo "**** scp command erro= "${ret}" "
			## send email to notifiy this error
			echo "**** scp command erro= "${ret}", need to check the connection from .5 to ec2 server " | mail -s "SCP Command Error" ${RECIPIENTS}
		else
		 	echo -n "== copied successfully :: "
			date
		fi
		echo -n "== archiving ${FILE_PATH} :: "
		date
		cp ${FILE_PATH} ${DESTINATION}productUpdate_`date "+%Y_%m_%d_%H_%M_%S"`.tar.gz
		echo -n "== removing ${FILE_PATH} :: "
		date
		rm -f $FILE_PATH
		echo -n "== removed successfully: ${FILE_PATH} :: "
		date
	else
		echo -n "NO SUCH A FILE: ${FILE_PATH} :: "
		date
	fi
	echo
	echo
fi


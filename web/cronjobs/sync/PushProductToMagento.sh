#!/bin/bash

SERVER=hobbymaster.com.au
SERVER_PATH=/var/www/html/var/import/
FILE_DIR=/tmp/
FILE_NAME=productUpdate.tar.gz
DESTINATION=/var/pushdata/archive/
RECIPIENTS="larry@budgetpc.com.au"
SYNCFILE_DIR=/var/www/hobbymaster/web/cronjobs/sync/
PEMFILE_PATH=/home/ubuntu/.ssh/BPC_EC2_keyPair01.pem

## generate a MAGENTO product file ########################################
if ps ax | grep -v grep | grep "ProductToMagento.php" > /dev/null; then
	echo -n "ProductToMagento is Already Running....... :: "
	date
	echo
else
	echo -n '== Generating the file ... ::'
	date
	/usr/bin/php ${SYNCFILE_DIR}ProductToMagento.php $FILE_DIR
	FILE_PATH=${FILE_DIR}/${FILE_NAME}
	if [ -e "$FILE_PATH" ]
	then
		SERVER_FILE=${SERVER}:${SERVER_PATH}productUpdate_`date "+%Y_%m_%d_%H_%M_%S"`.tar.gz
		echo -n "== coping ${FILE_PATH} TO ${SERVER_FILE} :: "
		date
		scp -i ${PEMFILE_PATH} $FILE_PATH ec2-user@${SERVER_FILE}
		ret=$?
		if [ "${ret}" -ne "0" ] 
		then
			echo "**** scp command erro= "${ret}" "
			## send email to notifiy this error
			echo "**** scp command erro= "${ret}", need to check the connection from .5 to ec2 server " | mail -s "Warning: SCP Command failed" ${RECIPIENTS}
			## fingerprint may be changed so try to delete the old one and accept new one
			ssh-keygen -f "/root/.ssh/known_hosts" -R ${SERVER}
			## try scp command one more time with automatically accepting keys
			echo -n "== try one more time coping ${FILE_PATH} TO ${SERVER_FILE} :: "
			date
			scp -o "StrictHostKeyChecking no" $FILE_PATH ec2-user@${SERVER_FILE}
			ret=$?
			if [ "${ret}" -ne "0" ]
			then
			    ##  erro again, need to handle this manually
			    echo "**** scp command erro again= "${ret}", need to check manually" | mail -s "Error: SCP Command Error" ${RECIPIENTS}
			    date
			else
			    ## copied successfully
			    echo "**** scp command tried again and succeeded. " | mail -s "Info: SCP Command OK after re-tried" ${RECIPIENTS}
			    echo -n "== copied successfully :: "	
			    date
			fi
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


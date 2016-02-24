#!/bin/bash
FN=`date +"%d_%m_%Y"`
DBN=bpcinternal
USERNAME=root
PASSWORD=root
DUMPPASSWORD=budget123pc

mysqldump -u $USERNAME -p$PASSWORD $DBN | 7za a -aoa -t7z -m0=lzma2 -mx=9 -mfb=64 -md=32m -ms=on -mhe -p$DUMPPASSWORD -si$FN.sql /tmp/$FN.7z
scp /tmp/$FN.7z admin@192.168.1.2:/share/website_backup/internalSystemBackup/
rm -f /tmp/$FN.sql
rm -f /tmp/$FN.7z

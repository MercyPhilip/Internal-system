DROP TABLE IF EXISTS `salestarget`;
CREATE TABLE `salestarget` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dfrom` date NOT NULL DEFAULT '0001-01-01',
  `dto` date NOT NULL DEFAULT '0001-01-01',
  `dperiod` int(10) unsigned NOT NULL DEFAULT '0',
  `targetrevenue` double(12,4) NOT NULL DEFAULT '0.0000',
  `targetprofit` double(12,4) NOT NULL DEFAULT '0.0000',
  `uid` int(10) unsigned DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `status` varchar(50) NOT NULL DEFAULT '',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE OR REPLACE VIEW totalsales AS
select date_format(`o`.`invDate`,'%Y-%m-%d') AS `YYYYMMDD`, 
sum(`o`.`totalAmount`) AS `totalAmount`,
sum(`o`.`totalPaid`) AS `totalPaid`,
sum(`o`.`totalCreditNoteValue`) AS `totalCreditNoteValue` 
from `order` `o` where ((`o`.`type` = 'INVOICE') and (`o`.`active` = 1)) 
group by date_format(`o`.`invDate`,'%Y-%m-%d');

CREATE OR REPLACE VIEW totalmargin AS
select date_format(`o`.`invDate`,'%Y-%m-%d') AS `YYYYMMDD`, 
sum((case when ((`o`.`totalAmount` = `o`.`totalPaid`) and (`o`.`totalCreditNoteValue` = 0)) then `oi`.`margin` else 0 end)) AS `totalActualMargin`, 
sum(`oi`.`margin`) AS `totalMargin` 
from (`order` `o` join `orderitem` `oi`) 
where ((`o`.`id` = `oi`.`orderId`) and (`o`.`type` = 'INVOICE') and (`o`.`active` = 1) and (`oi`.`active` = 1)) 
group by date_format(`o`.`invDate`,'%Y-%m-%d');

CREATE OR REPLACE VIEW salesdailylog AS
select `totalsales`.`YYYYMMDD` AS `YYYYMMDD`,
`totalsales`.`totalAmount` AS `totalAmount`,
`totalsales`.`totalPaid` AS `totalPaid`,
`totalsales`.`totalCreditNoteValue` AS `totalCreditNoteValue`,
`totalmargin`.`totalMargin` AS `totalMargin`,
`totalmargin`.`totalActualMargin` AS `totalActualMargin` 
from (`totalsales` left join `totalmargin` on((`totalsales`.`YYYYMMDD` = `totalmargin`.`YYYYMMDD`)));

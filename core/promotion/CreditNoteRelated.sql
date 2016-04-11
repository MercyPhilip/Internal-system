DROP TABLE IF EXISTS `creditpool`;
CREATE TABLE `creditpool` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customerId` int(10) unsigned NOT NULL DEFAULT '0',
  `totalCreditLeft` double(10,4) NOT NULL DEFAULT '0.0000',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `customerId` (`customerId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `creditpoolhistory`;
CREATE TABLE `creditpoolhistory` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creditpoolId` int(10) unsigned NOT NULL DEFAULT '0',
  `type` varchar(50) NOT NULL DEFAULT '',
  `typeId`  int(10) unsigned DEFAULT NULL,
  `amount` double(10,4) NOT NULL DEFAULT '0.0000',
  `totalCreditLeft` double(10,4) NOT NULL DEFAULT '0.0000',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `creditpoolId` (`creditpoolId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `creditnotestatus`;
CREATE TABLE `creditnotestatus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creditpoolId` int(10) unsigned NOT NULL DEFAULT '0',
  `creditNoteId` int(10) unsigned NOT NULL DEFAULT '0',
  `creditAmount` double(10,4) NOT NULL DEFAULT '0.0000',
  `creditAmountAvailable` double(10,4) NOT NULL DEFAULT '0.0000',
  `status` varchar(50) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `creditNoteId` (`creditNoteId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `creditappliedhistory`;
CREATE TABLE `creditappliedhistory` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creditNoteId` int(10) unsigned NOT NULL DEFAULT '0',
  `paymentId` int(10) unsigned NOT NULL DEFAULT '0',
  `creditAmount` double(10,4) NOT NULL DEFAULT '0.0000',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `paymentId` (`paymentId`),
  KEY `creditNoteId` (`creditNoteId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

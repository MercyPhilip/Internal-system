DROP TABLE IF EXISTS `newproduct`;
CREATE TABLE `newproduct` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `productId` int(10) unsigned NOT NULL DEFAULT '0',
  `statusId` int(10) unsigned DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `statusId` (`statusId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `newproductstatus`;
CREATE TABLE `newproductstatus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

insert into role (`name`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('Product Manager',  1, NOW(), 10, NOW(), 10);
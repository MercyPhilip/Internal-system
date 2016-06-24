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
insert into newproductstatus (`name`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('NEW',  1, NOW(), 10, NOW(), 10);
insert into newproductstatus (`name`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('COMPLETED',  1, NOW(), 10, NOW(), 10);
insert into newproductstatus (`name`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('DONE',  1, NOW(), 10, NOW(), 10);
    
DROP TABLE IF EXISTS `categoryattribute`;
CREATE TABLE `categoryattribute` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoryId` int(10) unsigned NOT NULL DEFAULT '0',
  `categoryName` varchar(255) NOT NULL DEFAULT '',
  `assetAccNo` int(10) unsigned NOT NULL DEFAULT '0',
  `revenueAccNo` int(10) unsigned NOT NULL DEFAULT '0', 
  `costAccNo` int(10) unsigned NOT NULL DEFAULT '0',  
  `attributesetId` int(10) unsigned DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `createdById` (`createdById`),
  INDEX `updatedById` (`updatedById`),
  INDEX `categoryId` (`categoryId`),
  INDEX `categoryName` (`categoryName`),
  INDEX `assetAccNo` (`assetAccNo`),
  INDEX `revenueAccNo` (`revenueAccNo`),
  INDEX `costAccNo` (`costAccNo`),  
  INDEX `attributesetId` (`attributesetId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


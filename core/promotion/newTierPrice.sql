DROP TABLE IF EXISTS `tierlevel`;
CREATE TABLE `tierlevel` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `magId` int(10) DEFAULT NULL,
  `percentage` double(5,2) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `magId` (`magId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET SESSION sql_mode='NO_AUTO_VALUE_ON_ZERO';
insert into tierlevel (`id`, `name`, `magId`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('0', 'Tier0', null, 1, NOW(), 10, NOW(), 10);
insert into tierlevel (`id`, `name`, `magId`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('1', 'General', 1, 1, NOW(), 10, NOW(), 10);
insert into tierlevel (`id`, `name`, `magId`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('2', 'Tier1', 2, 1, NOW(), 10, NOW(), 10);
insert into tierlevel (`id`, `name`, `magId`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('3', 'Tier2', 3, 1, NOW(), 10, NOW(), 10);
insert into tierlevel (`id`, `name`, `magId`, `active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('4', 'Tier3', 4, 1, NOW(), 10, NOW(), 10);
    
ALTER TABLE `customer` ADD `tierId` int(10) NOT NULL DEFAULT '1' AFTER `terms`, ADD INDEX (`tierId`) ;


DROP TABLE IF EXISTS `tierrule`;
CREATE TABLE `tierrule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `productId` int(10) DEFAULT NULL,
  `manufacturerId` int(10) DEFAULT NULL,
  `categoryId` int(10) DEFAULT NULL,
  `priorityId` int(10) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `priorityId` (`priorityId`),
  KEY `manufacturerId` (`manufacturerId`),
  KEY `categoryId` (`categoryId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `tierprice`;
CREATE TABLE `tierprice` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tierruleId` int(10) DEFAULT NULL,
  `tierLevelId` int(10) DEFAULT NULL,
  `quantity` int(10) DEFAULT NULL,
  `tierpricetypeId` int(10) NOT NULL DEFAULT '1',
  `value` double(10,4) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tierruleId` (`tierruleId`),
  KEY `tierLevelId` (`tierLevelId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `tierpricetype`;
CREATE TABLE `tierpricetype` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
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

insert into tierpricetype (`name`, `description`,`active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('Percentage(%)', 'The price will be UnitCost*Percentage*1.1', 1, NOW(), 10, NOW(), 10);
insert into tierpricetype (`name`, `description`,`active`, `created`, `createdById`, `updated`, `updatedById` ) values
    ('Price(Inc)', 'This is the retail price', 1, NOW(), 10, NOW(), 10);

    
DROP TABLE IF EXISTS `producttierprice`;
CREATE TABLE `producttierprice` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `productId` int(10) DEFAULT NULL,
  `priorityId` int(10) DEFAULT NULL,
  `tierruleId` int(10) DEFAULT NULL,
  `tierLevelId` int(10) DEFAULT NULL,
  `quantity` int(10) DEFAULT NULL,
  `tierpricetypeId` int(10) NOT NULL DEFAULT '1',
  `value` double(10,4) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `priorityId` (`priorityId`),
  KEY `tierruleId` (`tierruleId`),
  KEY `tierLevelId` (`tierLevelId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `productbuyinprice`;
CREATE TABLE `productbuyinprice` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `productId` int(10) DEFAULT NULL,
  `price` double(10,4) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `orderattention`;
CREATE TABLE `orderattention` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `storeId` int(10) NOT NULL DEFAULT '1',
  `orderId` int(10) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  KEY `orderId` (`orderId`),
  KEY `status` (`status`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


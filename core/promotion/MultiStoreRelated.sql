

DROP TABLE IF EXISTS `store`;
CREATE TABLE `store` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
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

-- ----------------------------
-- Table structure for productstockinfo
-- ----------------------------
DROP TABLE IF EXISTS `productstockinfo`;
CREATE TABLE `productstockinfo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `storeId` int(10) NOT NULL DEFAULT '1',
  `productId` int(10) NOT NULL DEFAULT '0',
  `totalOnHandValue` double(10,4) NOT NULL DEFAULT '0.0000',
  `totalInPartsValue` double(10,4) NOT NULL DEFAULT '0.0000',
  `stockOnHand` int(10) NOT NULL DEFAULT '0',
  `stockOnOrder` int(10) NOT NULL DEFAULT '0',
  `stockOnPO` int(10) NOT NULL DEFAULT '0',
  `stockInParts` int(10) NOT NULL DEFAULT '0',
  `stockInRMA` int(10) NOT NULL DEFAULT '0',
  `stockMinLevel` int(10) unsigned DEFAULT NULL,
  `stockReorderLevel` int(10) unsigned DEFAULT NULL,
  `totalRMAValue` double(10,4) NOT NULL DEFAULT '0.0000',
  `statusId` int(10) unsigned DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `productId` (`productId`),
  KEY `stockOnHand` (`stockOnHand`),
  KEY `stockOnOrder` (`stockOnOrder`),
  KEY `statusId` (`statusId`),
  KEY `stockOnPO` (`stockOnPO`),
  KEY `stockInParts` (`stockInParts`),
  KEY `stockInRMA` (`stockInRMA`),
  KEY `stockMinLevel` (`stockMinLevel`),
  KEY `stockReorderLevel` (`stockReorderLevel`),
  KEY `storeId` (`storeId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE bpcinternal.address ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.comments ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.creditappliedlog ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.creditnote ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.creditnoteitem ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.creditnotestatus ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.creditpool ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.creditpoollog ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.customer ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.kit ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.kitcomponent ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.location ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.log ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.`order` ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.orderinfo ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.orderitem ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.payment ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.person ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.preferredlocation ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.productageinglog ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.productqtylog ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.purchaseorder ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.purchaseorderitem ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.receivingitem ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.rma ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.rmaitem ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.salestarget ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.sellingitem ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.shippment ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.task ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.useraccount ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);
ALTER TABLE bpcinternal.message ADD COLUMN `storeId` INT(10) NOT NULL DEFAULT 1 AFTER `id`, ADD INDEX(`storeId`);


insert into productstockinfo(storeId, productId, totalOnHandValue, totalInPartsValue, stockOnHand, stockOnOrder, stockOnPO, stockInParts, stockInRMA, stockMinLevel, stockReorderLevel, totalRMAValue, statusId)
select 1, id, totalOnHandValue, totalInPartsValue, stockOnHand, stockOnOrder, stockOnPO, stockInParts, stockInRMA, stockMinLevel, stockReorderLevel, totalRMAValue, statusId from product;

insert into productstockinfo(storeId, productId, totalOnHandValue, totalInPartsValue, stockOnHand, stockOnOrder, stockOnPO, stockInParts, stockInRMA, stockMinLevel, stockReorderLevel, totalRMAValue, statusId)
select 2, id, 0, 0, 0, 0, 0, 0, 0, stockMinLevel, stockReorderLevel, 0, 4 from product;

insert into productstockinfo(storeId, productId, totalOnHandValue, totalInPartsValue, stockOnHand, stockOnOrder, stockOnPO, stockInParts, stockInRMA, stockMinLevel, stockReorderLevel, totalRMAValue, statusId)
select 3, id, 0, 0, 0, 0, 0, 0, 0, stockMinLevel, stockReorderLevel, 0, 4 from product;
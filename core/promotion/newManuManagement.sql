DROP TABLE IF EXISTS `manualmanage`;
CREATE TABLE `manualmanage` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supplierId` int(10) DEFAULT NULL,
  `manufactureId` int(10) DEFAULT NULL,
  `categoryId` int(10) DEFAULT NULL,
  `productId` int(10) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `supplierId` (`supplierId`),
  KEY `manufactureId` (`manufactureId`),
  KEY `categoryId` (`categoryId`),
  KEY `productId` (`productId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 4, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 23, 18, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 23, 20, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 23, 21, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 39, 94, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 39, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 39, 16, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 65, 18, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 65, 20, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 80, 94, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 80, 18, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 80, 17, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 87, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 87, 94, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 97, 91, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 97, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 123, 94, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 134, 94, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 140, 91, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 140, 94, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 141, 94, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 144, 91, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 168, 94, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 168, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 177, 91, 1, NOW(), 10, NOW(), 10);
  -- HPE
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 99, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 91, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 17, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 23, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 288, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 122, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 195, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 117, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 123, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 40, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 299, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(10, 265, 164, 1, NOW(), 10, NOW(), 10);
-- mmt
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(8, 55, 20, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(8, 55, 18, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(8, 148, 18, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(8, 156, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(8, 159, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(8, 254, 94, 1, NOW(), 10, NOW(), 10);
-- mittoni
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(7, 40, 21, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(7, 61, 31, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)
  values(7, 284, 31, 1, NOW(), 10, NOW(), 10);


---
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,23, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,23, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,23, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,29, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,39, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,39, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,39, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,40, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,61, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,61, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,61, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,65, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,65, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(9,81, 111, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(9,81, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(9,81, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(9,81, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,103, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,103, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,103, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,108, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,108, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,108, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,117, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(1,133, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(74,133, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(8,148, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(8,148, 111, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(8,148, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,153, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,153, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,153, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(1,250, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(1,250, 111, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(1,250, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(1,250, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(8,262, 111, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(8,262, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(10,271, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,278, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,279, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,279, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,279, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,279, 114, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,281, 109, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,281, 112, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,281, 113, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,281, 114, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(7,285, 114, 1, NOW(), 10, NOW(), 10);
insert into manualmanage(`supplierId`, `manufactureId`, `categoryId`, `active`, `created`, `createdById`, `updated`, `updatedById`)  values(1,296, 112, 1, NOW(), 10, NOW(), 10);


  
  
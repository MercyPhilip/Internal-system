

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

insert into store (`name`,  `created`, `createdById`, `updated`, `updatedById` ) values
    ('Mount Waverley', NOW(), 10, NOW(), 10);
insert into store (`name`,  `created`, `createdById`, `updated`, `updatedById` ) values
    ('Moorabbin', NOW(), 10, NOW(), 10);


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

INSERT INTO `useraccount` VALUES ('11', '1', 'b81b7c0ca8a16a5b31bdacfc0e08e6fdc8d1d1ce', 'disabled', '11', '1', '0001-01-01 00:00:00', '10', '2016-05-28 13:36:02', '10');
INSERT INTO `useraccount` VALUES ('12', '2', 'b9e94e700a72f60b2cf0fea69e6b46142166863a', 'disabled', '12', '1', '0001-01-01 00:00:00', '10', '2016-05-28 13:38:14', '10');

INSERT INTO `person` VALUES ('11', '1', 'System', 'MountWaverley', '1', '0001-01-01 00:00:00', '10', '2016-05-28 13:37:11', '10');
INSERT INTO `person` VALUES ('12', '2', 'System', 'Moorabbin', '1', '0001-01-01 00:00:00', '10', '2016-05-28 13:38:24', '10');


insert into productstockinfo(storeId, productId, totalOnHandValue, totalInPartsValue, stockOnHand, stockOnOrder, stockOnPO, stockInParts, stockInRMA, stockMinLevel, stockReorderLevel, totalRMAValue, statusId, createdById, updatedById)
select 1, id, totalOnHandValue, totalInPartsValue, stockOnHand, stockOnOrder, stockOnPO, stockInParts, stockInRMA, stockMinLevel, stockReorderLevel, totalRMAValue, statusId, createdById, updatedById from product;

insert into productstockinfo(storeId, productId, totalOnHandValue, totalInPartsValue, stockOnHand, stockOnOrder, stockOnPO, stockInParts, stockInRMA, stockMinLevel, stockReorderLevel, totalRMAValue, statusId, createdById, updatedById)
select 2, id, 0, 0, 0, 0, 0, 0, 0, stockMinLevel, stockReorderLevel, 0, 8, createdById, updatedById from product;

-- insert into productstockinfo(storeId, productId, totalOnHandValue, totalInPartsValue, stockOnHand, stockOnOrder, stockOnPO, stockInParts, stockInRMA, stockMinLevel, stockReorderLevel, totalRMAValue, statusId, createdById, updatedById)
-- select 3, id, 0, 0, 0, 0, 0, 0, 0, stockMinLevel, stockReorderLevel, 0, 8, createdById, updatedById from product;
DROP TRIGGER IF EXISTS update_stock_status;

DROP TRIGGER IF EXISTS update_sku_map;
DELIMITER $$
CREATE TRIGGER update_sku_map Before UPDATE ON product 
FOR EACH ROW 
BEGIN
  declare $productId int default null;
  if old.sku <> new.sku then
    select productId into $productId from productskumap where productId = old.id and active = 1;
    if (isnull($productId)) then
        insert into productskumap(productId, msku, fsku, created, createdById, updatedById) values( old.id, old.sku, new.sku, now(), new.updatedById, new.updatedById);
    else
        update productskumap set fsku = new.sku, updatedById=new.updatedById where productId =old.id and active = 1;
    end if;
  end if;
END $$
DELIMITER ;

ALTER TABLE bpcinternal.product 
   DROP COLUMN totalOnHandValue, 
   DROP COLUMN totalInPartsValue, 
   DROP COLUMN stockOnHand, 
   DROP COLUMN stockOnOrder, 
   DROP COLUMN stockOnPO,
   DROP COLUMN stockInParts, 
   DROP COLUMN stockInRMA, 
   DROP COLUMN stockMinLevel, 
   DROP COLUMN stockReorderLevel, 
   DROP COLUMN totalRMAValue, 
   DROP COLUMN statusId;

DROP TRIGGER IF EXISTS update_stock_sow;
DELIMITER $$
CREATE TRIGGER update_stock_sow Before UPDATE ON productstockinfo 
FOR EACH ROW 
BEGIN
  declare $min_in_stock_amount int;
  declare $supplier_quantity int;
  declare $mel_quantity int;
  declare $other_quantity int;
  declare $sellOnWeb int;
  select value into $min_in_stock_amount from systemsettings where type='min_in_stock_amount' and active = 1;
  if old.stockOnHand = new.stockOnHand then
    begin
    end;
  else
     begin
     select IFNULL(sum(canSupplyQty),0) into $supplier_quantity from suppliercode where productId = old.productId and active = 1;
     set $mel_quantity  = substr(LPAD(cast($supplier_quantity as char(10)),10,'0'),1,5);
     set $other_quantity = substr(LPAD(cast($supplier_quantity as char(10)),10,'0'),6,5);
     set $mel_quantity = new.stockOnHand + $mel_quantity;
     if $mel_quantity  >= $min_in_stock_amount then
         set new.statusId = 2;
     elseif $mel_quantity >0 then
         set new.statusId = 5;
     elseif  $other_quantity > 0 then
         set new.statusId = 4;
     else
        set new.statusId = 8;
     end if;
     if new.stockOnHand > 1 then
         select sellOnWeb into $sellOnWeb from product where id = old.productId;
         if $sellOnWeb <> 1 then
           update product set sellOnWeb = 1 where id = old.productId;
         end if;
     end if;
     end;
  end if;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS updateproductpricehistory;
delimiter //
CREATE TRIGGER updateproductpricehistory BEFORE UPDATE ON productprice 
FOR EACH ROW 
BEGIN
  if NEW.price <> OLD.price then
    INSERT INTO productprice_history SELECT NULL, h.*, NEW.price, NOW() FROM productprice h WHERE id = OLD.id;
  end if;
END;//


CREATE OR REPLACE VIEW totalsales AS
SELECT
	`o`.storeId,
	date_format(
		convert_tz(
			`o`.`invDate`,
			'UTC',
			'Australia/Victoria'
		),
		'%Y-%m-%d'
	) AS `YYYYMMDD`,
	sum(`o`.`totalAmount`) AS `totalAmount`,
	sum(`o`.`totalPaid`) AS `totalPaid`,
	sum(`o`.`totalCreditNoteValue`) AS `totalCreditNoteValue`
FROM
	`order` `o`
WHERE
	(
		(`o`.`type` = 'INVOICE')
		AND (`o`.`active` = 1)
		AND (`o`.`statusId` <> 2)
	)
GROUP BY
	`o`.storeId,
	date_format(
		convert_tz(
			`o`.`invDate`,
			'UTC',
			'Australia/Victoria'
		),
		'%Y-%m-%d'
	);
CREATE OR REPLACE VIEW totalmargin AS
SELECT
`o`.storeId,
	date_format(
		convert_tz(
			`o`.`invDate`,
			'UTC',
			'Australia/Victoria'
		),
		'%Y-%m-%d'
	) AS `YYYYMMDD`,
	sum(
		(
			CASE
			WHEN (
				(
					`o`.`totalAmount` = `o`.`totalPaid`
				)
				AND (
					`o`.`totalCreditNoteValue` = 0
				)
			) THEN
				`oi`.`margin`
			ELSE
				0
			END
		)
	) AS `totalActualMargin`,
	sum(`oi`.`margin`) AS `totalMargin`
FROM
	(
		`order` `o`
		JOIN `orderitem` `oi`
	)
WHERE
	(
		(`o`.`id` = `oi`.`orderId`)
		AND (`o`.`type` = 'INVOICE')
		AND (`o`.`active` = 1)
		AND (`oi`.`active` = 1)
		AND (`o`.`statusId` <> 2)
		AND (`o`.storeId = `oi`.storeId)
	)
GROUP BY
`o`.storeId,
	date_format(
		convert_tz(
			`o`.`invDate`,
			'UTC',
			'Australia/Victoria'
		),
		'%Y-%m-%d'
	);

CREATE OR REPLACE VIEW salesdailylog AS
SELECT
	`totalsales`.storeId,
	`totalsales`.`YYYYMMDD` AS `YYYYMMDD`,
	`totalsales`.`totalAmount` AS `totalAmount`,
	`totalsales`.`totalPaid` AS `totalPaid`,
	`totalsales`.`totalCreditNoteValue` AS `totalCreditNoteValue`,
	`totalmargin`.`totalMargin` AS `totalMargin`,
	`totalmargin`.`totalActualMargin` AS `totalActualMargin`
FROM
	(
		`totalsales`
		LEFT JOIN `totalmargin` ON (
			(
				`totalsales`.`YYYYMMDD` = `totalmargin`.`YYYYMMDD`
				AND `totalsales`.storeId = `totalmargin`.storeId
			)
		)
	);
	
CREATE OR REPLACE VIEW monthlysales AS
SELECT
	`salesdailylog`.storeId,
	date_format(
		`salesdailylog`.`YYYYMMDD`,
		'%Y-%m'
	) AS `YYYYMM`,
	sum(
		`salesdailylog`.`totalAmount`
	) AS `totalAmount`,
	sum(
		`salesdailylog`.`totalPaid`
	) AS `totalPaid`,
	sum(
		`salesdailylog`.`totalCreditNoteValue`
	) AS `totalCreditNoteValue`,
	sum(
		`salesdailylog`.`totalMargin`
	) AS `totalMargin`,
	sum(
		`salesdailylog`.`totalActualMargin`
	) AS `totalActualMargin`
FROM
	`salesdailylog`
GROUP BY
	`salesdailylog`.storeId,
	date_format(
		`salesdailylog`.`YYYYMMDD`,
		'%Y-%m'
	);

	

DROP TRIGGER IF EXISTS update_stock_status;
delimiter //
CREATE TRIGGER update_stock_status Before UPDATE ON product 
FOR EACH ROW 
BEGIN
  declare $min_in_stock_amount int;
  declare $supplier_quantity int;
  declare $mel_quantity int;
  declare $other_quantity int;
  declare $productId int default null;
  select value into $min_in_stock_amount from systemsettings where type='min_in_stock_amount';
  if old.sku <> new.sku then
    select productId into $productId from productskumap where productId = old.id;
    if  (isnull($productId)) then
        insert into productskumap(productId, msku, fsku, created, createdById, updatedById) values( old.id, old.sku, new.sku, now(), new.updatedById, new.updatedById);
    else
        update productskumap set fsku = new.sku, updatedById=new.updatedById where productId =old.id;
    end if;
  end if;
  if old.stockOnHand = new.stockOnHand then
    begin
    end;
  else
     begin
     select IFNULL(sum(canSupplyQty),0) into $supplier_quantity from suppliercode where productId = old.id and active = 1;
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
     end;
  end if;
END;//

DROP TABLE IF EXISTS `productskumap`;
CREATE TABLE `productskumap` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`productId` int(10) unsigned NOT NULL,
  `msku` varchar(50) NOT NULL DEFAULT '',
  `fsku` varchar(50) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `createdById` (`createdById`),
  INDEX `updatedById` (`updatedById`),
  INDEX `msku` (`msku`),
  INDEX `fsku` (`fsku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
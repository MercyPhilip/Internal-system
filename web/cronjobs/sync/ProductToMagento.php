<?php

require_once dirname(__FILE__) . '/../../bootstrap.php';
ini_set("memory_limit", "-1");
set_time_limit(0);

abstract class ProductToMagento
{
    const TAB = '    ';
    const FILE_NAME = 'productUpdate';
    /**
     * The log file
     *
     * @var string
     */
    private static $_logFile = '';
    /**
     * The output of the file path
     *
     * @var string
     */
    private static $_outputFileDir = '';
    /**
     * The image folder name under .tar.gz
     *
     * @var string
     */
    private static $_imageDirName = 'images';
    /**
     * The run time cache for the settings..etc.
     *
     * @var array
     */
    private static $_cache = array();
    /**
     * The runner
     *
     * @param string $preFix
     * @param string $debug
     */
    public static function run($outputFileDir, $preFix = '', $debug = false)
    {
        $start = self::_log('## START ##############################', __CLASS__ . '::' . __FUNCTION__, $preFix);

		self::$_outputFileDir = trim($outputFileDir);
		self::_log('GEN FILE TO: ' . self::$_outputFileDir, '', $preFix . self::TAB);
		self::$_imageDirName = self::$_imageDirName . '_' . UDate::now()->format('Y_m_d_H_i_s');
    	Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

    	$now = UDate::now();
    	$settings = self::_getSettings($preFix . self::TAB, $debug);
    	$lastUpdatedTime = UDate::zeroDate();
    	if(isset($settings['lastUpdatedTime']) && trim($settings['lastUpdatedTime']) !== '')
    		$lastUpdatedTime = new UDate(trim($settings['lastUpdatedTime']));
    	self::_log('GOT LAST SYNC TIME: ' . trim($lastUpdatedTime), '', $preFix);
    	$products = self::_getData($lastUpdatedTime, $preFix . self::TAB, $debug);
    	if (count($products) > 0) {
			$files= self::_genCSV($lastUpdatedTime, array_values($products), $preFix . self::TAB, $debug);
			self::_zipFile($files, $preFix, $debug);
			self::_setSettings('lastUpdatedTime', trim($now), $preFix, $debug);
    	} else {
    		self::_log('NO changed products found after: "' . trim($lastUpdatedTime) . '".', '', $preFix);
    	}

        self::_log('## FINISH ##############################', __CLASS__ . '::' . __FUNCTION__, $preFix, $start);
    }
    /**
     * Archiving the file
     *
     * @param unknown $filePath
     * @param string $preFix
     * @param string $debug
     * @throws Exception
     */
    private static function _zipFile($files, $preFix = '', $debug = false)
    {
    	$tarFilePath = self::$_outputFileDir . '/' . self::FILE_NAME . '.tar';
    	$start = self::_log('== Archiving the file: ' . $tarFilePath, __CLASS__ . '::' . __FUNCTION__, $preFix);

    	$csvFilePath = '/tmp/' . md5('ProductToMagento_CSV_' . trim(UDate::now())) . '.csv';

    	$tarFile = new PharData($tarFilePath);
    	//add csv file
    	self::_log('Generating the CSV file: ' . $csvFilePath, '', $preFix . self::TAB);
    	$objWriter = PHPExcel_IOFactory::createWriter($files['phpExcel'], 'CSV');
    	$objWriter->save($csvFilePath);
    	self::_log('Adding the CSV file to: ' . $tarFilePath, '', $preFix . self::TAB);
    	$tarFile->addFile($csvFilePath, self::FILE_NAME . '.csv');

    	//add image files
    	if ( isset($files['imageFiles']) && count($files['imageFiles']) > 0) {
    		$imageDir = self::$_imageDirName;
	    	$tarFile->addEmptyDir($imageDir);
    		foreach ($files['imageFiles'] as $index => $imageFile) {
		    	self::_log('Processing file: ' . $index, '', $preFix . self::TAB . self::TAB);
    			if (!isset($imageFile['filePath'])) {
    				self::_log('No File Path SET. SKIP ', '', $preFix . self::TAB . self::TAB . self::TAB);
    				continue;

    			}
    			if (!is_file($imageFile['filePath'])) {
    				self::_log('File NOT FOUND: ' . $imageFile['filePath'], '', $preFix . self::TAB . self::TAB . self::TAB);
    				continue;
    			}
    			$tarFile->addFile($imageFile['filePath'], $imageDir . '/' . $imageFile['fileName']);
    			self::_log('Added File:' . $imageFile['fileName'] . ', from path: ' . $imageFile['filePath'], '', $preFix . self::TAB . self::TAB . self::TAB);
    		}
    	} else {
    		self::_log('No image files to add.', '', $preFix . self::TAB);
    	}

    	// COMPRESS archive.tar FILE. COMPRESSED FILE WILL BE archive.tar.gz
    	self::_log('Compressing file: ' . $tarFilePath, '', $preFix . self::TAB . self::TAB . self::TAB);
    	$tarFile->compress(Phar::GZ);

    	// NOTE THAT BOTH FILES WILL EXISTS. SO IF YOU WANT YOU CAN UNLINK archive.tar
    	self::_log('REMOVING the orginal file: ' . $tarFilePath, '', $preFix . self::TAB);
    	unlink($tarFilePath);
    	self::_log('REMOVED', '', $preFix . self::TAB . self::TAB);
    	//remving temp csv file
    	self::_log('REMOVING the tmp csv file: ' . $csvFilePath, '', $preFix . self::TAB);
    	unlink($csvFilePath);
    	self::_log('REMOVED', '', $preFix . self::TAB . self::TAB);

    	self::_log('== Archived', __CLASS__ . '::' . __FUNCTION__, $preFix, $start);
    }
    /**
     * getting the data
     *
     * @param string $preFix
     * @param string $debug
     *
     * @return array
     */
    private static function _getData(UDate $lastUpdatedTime, $preFix = '', $debug = false)
    {
        self::_log('== Trying to get all the updated price for products:', __CLASS__ . '::' . __FUNCTION__, $preFix);
        //product prices
        $productPrices = ProductPrice::getAllByCriteria('updated >= ?', array(trim($lastUpdatedTime)));
        self::_log('GOT ' . count($productPrices) . ' Price(s) that has changed after "' . trim($lastUpdatedTime) . '".', '', $preFix);
        $products = array();
        foreach ($productPrices as $productPrice) {
            if(!$productPrice->getProduct() instanceof Product || array_key_exists($productPrice->getProduct()->getId(), $products))
                continue;
            $products[$productPrice->getProduct()->getId()] = $productPrice->getProduct();
        }
        //products
        $productArr = Product::getAllByCriteria('updated >= ?', array(trim($lastUpdatedTime)), false);
        self::_log('GOT ' . count($productArr) . ' Product(s) that has changed after "' . trim($lastUpdatedTime) . '".', '', $preFix);
        foreach ($productArr as $product) {
            if(array_key_exists($product->getId(), $products))
                continue;
            $products[$product->getId()] = $product;
        }
        //product stock info
        $productStocks = ProductStockInfo::getAllByCriteria('updated >= ?', array(trim($lastUpdatedTime)), true);
        self::_log('GOT ' . count($productStocks) . ' Product Stock(s) that has changed after "' . trim($lastUpdatedTime) . '".', '', $preFix);
        foreach ($productStocks as $productStock) {
            if(!($product = Product::get($productStock->getProductId())) instanceof Product || array_key_exists($productStock->getProductId(), $products))
                continue;
        	$products[$productStock->getProductId()] = $product;
        }
        //Product_Category
        $productCates = Product_Category::getAllByCriteria('updated >= ?', array(trim($lastUpdatedTime)));
        self::_log('GOT ' . count($productCates) . ' Product_Category(s) that has changed after "' . trim($lastUpdatedTime) . '".', '', $preFix);
        foreach ($productCates as $productCate) {
            if(!$productCate->getProduct() instanceof Product || array_key_exists($productCate->getProduct()->getId(), $products))
                continue;
            $products[$productCate->getProduct()->getId()] = $productCate->getProduct();
        }
        //ProductImage
        $productImages = ProductImage::getAllByCriteria('updated >= ? and active = 1', array(trim($lastUpdatedTime)));
        self::_log('GOT ' . count($productImages) . ' ProductImage(s) that has changed after "' . trim($lastUpdatedTime) . '".', '', $preFix);
        foreach ($productImages as $productImage) {
            if(!$productImage->getProduct() instanceof Product || array_key_exists($productImage->getProduct()->getId(), $products))
                continue;
            $products[$productImage->getProduct()->getId()] = $productImage->getProduct();
        }
        //ProductTierPrice
        $productTierPrices = ProductTierPrice::getAllByCriteria('updated >= ? and tierLevelId > 1', array(trim($lastUpdatedTime)), false);
        self::_log('GOT ' . count($productTierPrices) . ' ProductTierPrice(s) that has changed after "' . trim($lastUpdatedTime) . '".', '', $preFix);
        foreach ($productTierPrices as $productTierPrice) {
        	if(!$productTierPrice->getProduct() instanceof Product || array_key_exists($productTierPrice->getProduct()->getId(), $products))
        		continue;
        	$products[$productTierPrice->getProduct()->getId()] = $productTierPrice->getProduct();
        }
        return $products;
    }
    /**
     * Getting the setting for the last sync
     *
     * @param string $preFix
     * @param string $debug
     *
     * @throws Exception
     * @return multitype:
     */
    private static function _getSettings($preFix = '', $debug = false)
    {
        $paramName = SystemSettings::TYPE_MAGENTO_SYNC;
        self::_log('== Trying to get SystemSettings for :' . $paramName, __CLASS__ . '::' . __FUNCTION__, $preFix);
        if (!isset(self::$_cache[__CLASS__ . ':settings:' . $paramName])) {

            $settingString = SystemSettings::getSettings($paramName);
            self::_log('GOT string: ' . $settingString, '', $preFix . self::TAB);

            self::$_cache[__CLASS__ . ':settings'] = json_decode($settingString, true);
        }
        self::_log('GOT settings: ' . preg_replace('/\s+/', ' ', print_r(self::$_cache[__CLASS__ . ':settings'], true)), '', $preFix . self::TAB);
        self::_log('');
        return self::$_cache[__CLASS__ . ':settings'];
    }
    /**
     * SEtting the value for the system settings
     *
     * @param string $key
     * @param string $value
     * @param string $preFix
     * @param bool   $debug
     */
    private static function _setSettings($key, $value, $preFix = '', $debug = false)
    {
        $paramName = SystemSettings::TYPE_MAGENTO_SYNC;
        self::_log('-- Trying to set SystemSettings for: "' . $paramName . '" with new value: ' . $value, __CLASS__ . '::' . __FUNCTION__, $preFix);
        $settings = self::_getSettings($preFix . self::TAB, $debug);
        if(!is_array($settings))
            $settings = array();
        self::_log('Before setting: ' . preg_replace('/\s+/', ' ', print_r($settings, true)), '', $preFix . self::TAB);
        $settings[$key] = $value;
        self::_log('After setting: ' . preg_replace('/\s+/', ' ', print_r($settings, true)), '', $preFix . self::TAB);
        if (!($settingObj = SystemSettings::getByType($paramName)) instanceof SystemSettings) {
        	$settingObj = new SystemSettings();
        	$settingObj->setType($paramName)
        		->setDescription($paramName);
        }
        $jsonString = json_encode($settings);
        self::_log('Saving new Settings: ' . $jsonString, '', $preFix . self::TAB);
        $settingObj->setValue($jsonString)
        	->save();
        self::_log('DONE', '', $preFix . self::TAB);
        self::_log('');
        self::$_cache[__CLASS__ . ':settings:' . $paramName] = $settings;
    }
    /**
     * Logging
     *
     * @param string $msg
     * @param string $funcName
     * @param string $preFix
     * @param UDate  $start
     * @param string $postFix
     *
     * @return UDate
     */
    private static function _log($msg, $funcName = '', $preFix = "", UDate $start = null, $postFix = "\r\n")
    {
        $now = new UDate();
        $timeElapsed = '';
        if ($start instanceof UDate) {
            $timeElapsed = $now->diff($start);
            $timeElapsed = ' TOOK (' . $timeElapsed->format('%s') . ') seconds ';
        }
        $nowString = '';
        if(trim($msg) !== '')
            $nowString = trim($now) . self::TAB;
        $logMsg = $nowString . $preFix . $msg . $timeElapsed . ($funcName !== '' ? (' ['  . $funcName . '] ') : '') . $postFix;
        echo $logMsg;
        if(is_file(self::$_logFile))
            file_put_contents(self::$_logFile, $logMsg, FILE_APPEND);
        return $now;
    }
	/**
	 * Generating the CSV file
	 *
	 * @param UDate  $lastUpdatedInDB
	 * @param array  $products
	 * @param string $preFix
	 * @param bool   $debug
	 *
	 * @return Array The array of images
	 */
   	private static function _genCSV(UDate $lastUpdatedInDB, array $products, $preFix = '', $debug = false)
   	{
   		// Create new PHPExcel object
   		self::_log("== Create new PHPExcel object", __CLASS__ . '::' . __FUNCTION__, $preFix);
   		$objPHPExcel = new PHPExcel();

   		// Add some data
   		$objPHPExcel->setActiveSheetIndex(0);
   		self::_log("Populating " . count($products) . ' product(s) onto the first sheet.', '', $preFix . self::TAB);
   		$imageFiles = self::_genSheet($lastUpdatedInDB, $objPHPExcel->getActiveSheet(), $products, $preFix, $debug);
   		self::_log("Got " . count($imageFiles) . ' imageFile(s)', '', $preFix . self::TAB);

   		$filePath = self::$_outputFileDir ;
   		self::_log("Saving to :" . $filePath, '', $preFix . self::TAB);

   		self::_log("DONE", '', $preFix . self::TAB);
   		return array('imageFiles' => $imageFiles, 'phpExcel' => $objPHPExcel);
   	}
   	/**
   	 * generating the worksheet
   	 *
   	 * @param UDate              $lastUpdatedInDB
   	 * @param PHPExcel_Worksheet $sheet
   	 * @param array              $data
   	 * @param string             $preFix
   	 * @param bool               $debug
   	 *
   	 * @return Array The array of images
   	 */
   	private static function _genSheet(UDate $lastUpdatedInDB, PHPExcel_Worksheet &$sheet, array $data, $preFix = '', $debug = false)
   	{
   		self::_log('-- Generating the sheets: ', __CLASS__ . '::' . __FUNCTION__, $preFix);
   		$rowNo = 1;
   		$titles = array_keys(self::_getRowWithDefaultValues($lastUpdatedInDB, null, $preFix, $debug));
   		foreach ($titles as $colNo => $colValue) {
   			$sheet->setCellValueByColumnAndRow($colNo, $rowNo, $colValue);
   		}
   		$rowNo += 1;
   		self::_log('Generated title row', '', $preFix . self::TAB);
		$imageFiles = array();
   		foreach ($data as $index => $product) {
       		self::_log('ROW: ' . $index . ', SKU: ' . $product->getSku(), '', $preFix . self::TAB);
   			if (!$product instanceof Product) {
           		self::_log('SKIPPED, invalid product.', '', $preFix . self::TAB . self::TAB);
   				continue;
   			}
   			$rowValue = self::_getRowWithDefaultValues($lastUpdatedInDB, $product, $preFix, $debug);
   			$rowValues = array($rowValue);
   			$images = ProductImage::getAllByCriteria('productId = ? and updated > ?', array($product->getId(), trim($lastUpdatedInDB)));
   			//images
	   		self::_log('Got ' . count($images) . ' ProductImage(s) after "' . trim($lastUpdatedInDB) . '" for productID: ' . $product->getId(), '', $preFix . self::TAB);
   			if (count($images) > 0) {
   				foreach ($images as $index => $image) {
   					if (!($asset = $image->getAsset()) instanceof Asset) {
   						self::_log('No Asset found for Image Index: ' . $index, '', $preFix . self::TAB . self::TAB);
   						continue;
   					}
   					if (!is_file($asset->getPath())) {
   						self::_log('No file found: ' . $asset->getPath(), '', $preFix . self::TAB . self::TAB);
   						continue;
   					}
   					$imageFiles[] = array('fileName' => $asset->getFilename(), 'filePath' => $asset->getPath());
   					self::_log('Added array(fileName=>' . $asset->getFilename() . ', filePath => ' . $asset->getPath() . ') to imageFiles', '', $preFix . self::TAB . self::TAB);
   					$imageFilePath = '{{IMAGE_IMPORT_DIR}}/' . self::$_imageDirName . '/' . $asset->getFilename();
   					self::_log('New Image Path into the CSV("image" column):' . $imageFilePath, '', $preFix . self::TAB . self::TAB);
   					if (intval($index) === 0) {
   						$rowValues[0]['image'] = '+' . $imageFilePath;
   						$rowValues[0]['small_image'] = '+' .  $imageFilePath;
   						$rowValues[0]['thumbnail'] = '+' . $imageFilePath;
   					} else {
   						$rowValues[0]['media_gallery'] =  $rowValues[0]['media_gallery'] . ';' . $imageFilePath;
	   					self::_log('added onto media_gallery: ' . $rowValues[0]['media_gallery'], '', $preFix . self::TAB . self::TAB);
   					}
   				}
   			}
   			//start looping in the outer loop
   			self::_log('There are ' . count($rowValues) . ' row(s) in total.', '', $preFix . self::TAB);
   			foreach ($rowValues as $row) {
	   			foreach (array_values($row) as $colNo => $colValue) {
	   				$sheet->setCellValueByColumnAndRow($colNo, $rowNo, $colValue);
	   			}
	   			$rowNo += 1;
   			}
			self::_log('ADDED.', '', $preFix . self::TAB . self::TAB);
   		}
   		self::_log('-- DONE', __CLASS__ . '::' . __FUNCTION__, $preFix);
   		return $imageFiles;
   	}
   	/**
   	 * The row with default value
   	 *
   	 * @param UDate   $lastUpdatedInDB
   	 * @param Product $product
   	 * @param string  $preFix
   	 * @param bool    $debug
   	 *
   	 * @return multitype:string number
   	 */
   	private static function _getRowWithDefaultValues(UDate $lastUpdatedInDB, Product $product = null, $preFix = '', $debug = false)
   	{
   	    $attributeSetDefault = 'Default';
   	    $attributeSetName = $attributeSetDefault;
   	    $enabled = true;
   	    $totalStockOnHand = 0;
   	    $sku = $statusId = $productName = $rrpPrice = $weight = $shortDescription = $fullDecription = $feature = $supplierName = $supplierCode = $manufacturerName = $asNewFrom = $asNewTo = $specialPrice = $specialPriceFromDate = $specialPriceToDate = '';
   	    $categoryIds = array(2); //default category
   	    $groupPrices =  array();
   	    $tierPrices = array();
   	    $tierLevels = TierLevel::getAllByCriteria('id > 1');
   	    foreach ($tierLevels as $tierLevel)
   	    {
   	    	$keyGroup = 'group_price:' . $tierLevel->getName();
   	    	$keyTier = 'tier_price:' . $tierLevel->getName();
   	    	$groupPrices[$keyGroup] = '';
   	    	$tierPrices[$keyTier] = '';
   	    }
   	    if ($product instanceof Product) {
   	        $sku = trim($product->getSku());
   	        $productName = trim($product->getName());
   	        $shortDescription = trim($product->getShortDescription());
   	        $asNewFrom = $product->getAsNewFromDate() instanceof UDate ? $product->getAsNewFromDate()->format('Y-m-d H:i:sP') : '';
   	        $asNewTo = $product->getAsNewToDate() instanceof UDate ? $product->getAsNewToDate()->format('Y-m-d H:i:sP') : '';
   	        $weight = trim($product->getWeight());
   	        if($product->getAttributeSet() instanceof ProductAttributeSet) {
   	            $attributeSetName = $product->getAttributeSet()->getName();
   	            self::_log('-- attributeSetName ', __CLASS__ . '::' . __FUNCTION__ . "  attributeSetName=$attributeSetName", $preFix);
   	        }
   	        //SRP
   	        if(($srp = $product->getSRP()) instanceof ProductPrice)
   	        {
   	        	$rrpPrice = StringUtilsAbstract::getValueFromCurrency($srp->getPrice());
   	        	$specialPrice = '';
   	        	$specialPriceFromDate = '1990-10-10';
   	        	$specialPriceToDate = '2009-10-10';
   	        }
   	        else
   	        {
	   	        //RRP
	   	        if(($rrp = $product->getRRP()) instanceof ProductPrice)
	   	            $rrpPrice = StringUtilsAbstract::getValueFromCurrency($rrp->getPrice());
	   	        //special price
	   	        if (($specialPriceObj = $product->getNearestSpecialPrice()) instanceof ProductPrice) {
	   	        	$specialPrice = StringUtilsAbstract::getValueFromCurrency($specialPriceObj->getPrice());
	   	        	$specialPriceFromDate = $specialPriceObj->getStart()->format('Y-m-d H:i:sP');
	   	        	$specialPriceToDate = $specialPriceObj->getEnd()->format('Y-m-d H:i:sP');
	   	        	if ($specialPrice == 0)
	   	        	{
	   	        		$specialPrice = '';
	   	        		$specialPriceFromDate = '1990-10-10';
	   	        		$specialPriceToDate = '2009-10-10';
	   	        	}
	   	        }
	   	        else
	   	        {
	   	        	// delete the special price
	   	        	//$specialPrice = StringUtilsAbstract::getValueFromCurrency('99999999');
	   	        	//$specialPrice = '9999999';
	   	        	$specialPrice = '';
	   	        	$specialPriceFromDate = '1990-10-10';
	   	        	$specialPriceToDate = '2009-10-10';
	   	        }
	   	        
	   	        // if it is the daily promotion time then overwrite the special price with the daily special price
	   	        $isDailyPromotionTime = intval(SystemSettings::getSettings(SystemSettings::TYP_ISDAILYPROMOTIONTIME));
	   	        if ($isDailyPromotionTime === 1)
	   	        {
	   	        	// get daily promotion price
	   	           	if (($specialPriceObj = $product->getDailySpecialPrice()) instanceof ProductPrice) {
	   	        		$dailySpecialPrice = StringUtilsAbstract::getValueFromCurrency($specialPriceObj->getPrice());
	   	        		if ($dailySpecialPrice != 0)
	   	        		{
	   	        			$specialPrice = $dailySpecialPrice;
	   	        			$specialPriceFromDate = $specialPriceObj->getStart()->format('Y-m-d H:i:sP');
	   	        			$specialPriceToDate = $specialPriceObj->getEnd()->format('Y-m-d H:i:sP');
	   	        		}
	   	        	}
	   	        }
	   	        
	   	        // if it is the daily promotion time then overwrite the special price with the daily special price
	   	        $isWeekendPromotionTime = intval(SystemSettings::getSettings(SystemSettings::TYP_ISWEEKENDPROMOTIONTIME));
	   	        if ($isWeekendPromotionTime === 1)
	   	        {
	   	        	// get weekend promotion price
	   	        	if (($specialPriceObj = $product->getWeekendSpecialPrice()) instanceof ProductPrice) {
	   	        		$weekendSpecialPrice = StringUtilsAbstract::getValueFromCurrency($specialPriceObj->getPrice());
	   	        		if ($weekendSpecialPrice != 0)
	   	        		{
	   	        			$specialPrice = $weekendSpecialPrice;
	   	        			$specialPriceFromDate = $specialPriceObj->getStart()->format('Y-m-d H:i:sP');
	   	        			$specialPriceToDate = $specialPriceObj->getEnd()->format('Y-m-d H:i:sP');
	   	        		}
	   	        	}
	   	        }  
   	        }
   	        //full description
   	        if (($asset = Asset::getAsset($product->getFullDescAssetId())) instanceof Asset)
   	            //$fullDecription = '"' . $asset->read() . '"';
   	            $fullDecription = $asset->read();
   	        //feature
   	        if (($asset = Asset::getAsset($product->getCustomTabAssetId())) instanceof Asset)
   	            $feature = $asset->read();
   	        //supplier
   	        if (count($supplierCodes = SupplierCode::getAllByCriteria('productId = ?', array($product->getId()), true, 1, 1)) > 0) {
   	            $supplierName = (($supplier = $supplierCodes[0]->getSupplier()) instanceof Supplier) ? $supplier->getName() : '';
   	            $supplierCode = trim($supplierCodes[0]->getCode());
   	        }
   	        //Manufacturer
   	        if ($product->getManufacturer() instanceof Manufacturer)
   	            $manufacturerName = trim($product->getManufacturer()->getName());
   	        //disable or enabled
   	        if (intval($product->getActive()) === 0 || intval($product->getSellOnWeb()) === 0)
   	            $enabled = false;
   	        else if ($product->getStatus() instanceof ProductStatus && intval($product->getStatus()->getId()) === ProductStatus::ID_DISABLED)
   	            $enabled = false;
   	        //categories
   	        if (count($categories = Product_Category::getAllByCriteria('productId = ?', array($product->getId()))) > 0) {
   	            foreach ($categories as $category) {
   	                if(!$category->getCategory() instanceof ProductCategory || ($mageCateId = trim($category->getCategory()->getMageId())) === '')
   	                    continue;
   	                if (trim($attributeSetName) === $attributeSetDefault && ($productAttributeSet = $category->getCategory()->getProductAttributeSet()) instanceof ProductAttributeSet) {
   	                	$attributeSetName = trim($productAttributeSet->getName());
   	                }
   	                $categoryIds[] = $mageCateId;
   	            }
   	        }
   	        //ProductStatus
   	        if($product->getStatus() instanceof ProductStatus) {
   	        	$statusId = $product->getStatus()->getName();
   	        }
   	        //ProductTierPrices
   	        $productTierPrices = ProductTierPrice::getAllByCriteria('productId = ? and tierLevelId > 1', array($product->getId()));
   	        $unitCost = $product->getUnitCost();
   	        // if there is no unit cost 
   	        // then skip this product
   	        if ($unitCost > 0)
   	        {
	   	        foreach($productTierPrices as $productTierPrice)
	   	        {
	   	        	//if (!$productTierPrice->getTierLevel() instanceof  TierLevel) continue;
	   	        	$tierName = $productTierPrice->getTierLevel()->getName();
	   	        	$tierQuantity = intval($productTierPrice->getQuantity());
	   	        	$tierPriceTypeId = $productTierPrice->getTierPriceType()->getId();
	   	        	$tierPriceValue = doubleval($productTierPrice->getValue());
	   	        	if ($tierPriceTypeId == 1)
	   	        	{
	   	        		$tierPriceValue = round(($unitCost * ($tierPriceValue / 100) + $unitCost) * 1.1, 2);
	   	        	}
	   	        	$rrp = $product->getSRP() instanceof ProductPrice? doubleval($product->getSRP()->getPrice()) : $product->getRRP() instanceof ProductPrice ? doubleval($product->getRRP()->getPrice()) : 0;
	   	        	$tierPriceValue = $tierPriceValue > $rrp ? $rrp : $tierPriceValue;
	   	        	if ($tierQuantity == 0)
	   	        	{
	   	        		//group price
	   	        		$key = 'group_price:' . $tierName;
	   	        		$groupPrices[$key] =  $tierPriceValue;
	   	        		
	   	        	}
	   	        	else
	   	        	{
	   	        		//tier price
	   	        		$key = 'tier_price:' . $tierName;
	   	        		if (isset($tierPrices[$key]) && (trim($tierPrices[$key]) !== ''))
	   	        			$tierPrices[$key] = $tierPrices[$key] . ';' . $tierQuantity . ':' . $tierPriceValue;
	   	        		else
	   	        			$tierPrices[$key] = $tierQuantity . ':' . $tierPriceValue;
	   	        	}
   	        	}
   	    	}
	       	$stock1 = $stock2  = 0;
   	        foreach($product->getStocks() as $stock)
   	        {
   	        	switch ($stock->getStore()->getId())
   	        	{
   	        		case 1:
   	        			$stock1 = intval($stock->getStatus()->getId());
   	        			break;
   	        		case 2:
   	        			$stock2 = intval($stock->getStatus()->getId());
   	        			break;
   	        		default:
   	        			break;
   	        	}
   	        }
   	        $totalStockOnHand = $stock2 . $stock1;
   	    }
   	    $categoryIds = array_unique($categoryIds);
   		$result = array("store" => 'admin, default',
   				"websites" => 'base',
   				"attribute_set" => $attributeSetName, //attribute_name
   				"type" => 'simple',
   				"category_ids" => implode(',', $categoryIds), //123,12312
   				"sku" => $sku, //sku
   				"name" => $productName, //product name
   				"price" => $rrpPrice, //unitPrice
   				"special_from_date" => $specialPriceFromDate, //special_from_date
   				"special_to_date" => $specialPriceToDate, //special_to_date
   				"special_price" => $specialPrice, //special_price
   				"news_from_date" => $asNewFrom, //news_from_date
   				"news_to_date" => $asNewTo, //news_to_date
   				"status" => intval($enabled) === 1 ? 1 : 2, //1 - enable, 2 - disable
   				"visibility" => 4, //4 -
   				"tax_class_id" => 2, // 2
   				"description" => $fullDecription, //full description
   				"short_description" => $shortDescription, //short description
   				"supplier" => $supplierName, // the name of the supplier
   				"man_code" => '', //manufacturer code
   				"sup_code" => $supplierCode, //supplier code
   				// "has_options" => '',
   				"meta_title" => '',
   				"meta_description" => '',
   				"manufacturer" => $manufacturerName, //manufacture value
   				"url_key" => '',
   				"url_path" => '',
   				"custom_design" => '',
   				"page_layout" => '',
   				// "options_container" => '',
   				"country_of_manufacture" => '',
   				"msrp_enabled" => '',
   				"msrp_display_actual_price_type" => '',
   				"meta_keyword" => '',
   				"custom_layout_update" => '',
   				"custom_design_from" => '',
   				"custom_design_to" => '',
   				"weight" => $weight,
   				"msrp" => 'Use config', //
   				"gift_wrapping_price" => '',
   				"qty" => 99, //99
   				"min_qty" => 99,  //99
   				"use_config_min_qty" => 99,  //99
   				"is_qty_decimal"  => '',
   				"backorders" => '',
   				"use_config_backorders" => '',
   				"min_sale_qty" => '',
   				"use_config_min_sale_qty" => $totalStockOnHand,
   				"max_sale_qty" => '',
   				"use_config_max_sale_qty" => '',
   				"all_ln_stock" => $statusId,
   				"is_in_stock" => 1, //1 - in-stock, 0 - out of stock
   				"low_stock_date" => '',
   				"notify_stock_qty" => '',
   				"use_config_notify_stock_qty" => '',
   				"manage_stock" => '',
   				"use_config_manage_stock" => '',
   				"stock_status_changed_auto" => '',
   				"use_config_qty_increments" => '',
   				"qty_increments" => '',
   				"use_config_enable_qty_inc" => '',
   				"enable_qty_increments" => '',
   				"is_decimal_divided" => '',
   				"stock_status_changed_automatically" => '',
   				"use_config_enable_qty_increments" => '',
   				"image" => '',
   				"small_image" => '',
   				"thumbnail" => '',
   				"media_gallery" => '',
   				"is_recurring" => '',
   				"customtab" => $feature,
   				"customtabtitle" => $feature != '' ? 'Feature' : '',
   				"media_gallery_reset" => 0);
   		if (count($groupPrices) > 0)
   		{
   			foreach($groupPrices as $key => $groupPrice)
   				$result[$key] = $groupPrice;
   		}
   		if (count($tierPrices) > 0)
   		{
   			foreach($tierPrices as $key => $tierPrice)
   				$result[$key] = $tierPrice;
   		}

   		return $result;
   	}
}

if(!isset($argv) || !isset($argv[1]))
	die('No csv output file path given!');
ProductToMagento::run(trim($argv[1]), '', true);

<?php
/**
 * Boostrapper for the Core module
 * 
 * @package Core
 * @author  lhe
 */
abstract class SystemCoreAbstract
{
    /**
     * autoloading function
     * 
     * @param string $className The class that we are trying to autoloading
     * 
     * @return boolean Whether we loaded the class
     */
	public static function autoload($className)
	{
		$base = dirname(__FILE__);
		$autoloadPaths = array(
			$base . '/conf/',
			$base . '/db/',
			$base . '/entity/',
			$base . '/entity/asset/',
			$base . '/entity/store/',
			$base . '/entity/store/Tools/',
			$base . '/entity/system/',
			$base . '/exception/',
			$base . '/service/',
			$base . '/utils/',
			$base . '/utils/connector/',
			$base . '/utils/connector/magento/',
			$base . '/utils/connector/magento/Order/',
			$base . '/utils/html_parser/',
		);
		foreach ($autoloadPaths as $path)
		{
			if (file_exists($file = trim($path . $className . '.php')))
			{
				require_once $file;
				return true;
			}
		}
		return false;
	}
}
spl_autoload_register(array('SystemCoreAbstract','autoload'));
// Bootstrap the Prado framework
require_once dirname(__FILE__) . '/../3rdParty/framework/prado.php';
//require_once dirname(__FILE__) . '/../3rdParty/PHPExcel/PHPExcel.php';

?>
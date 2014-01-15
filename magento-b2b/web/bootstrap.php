<?php

$incpaths = array(
	dirname(__FILE__)
);

set_include_path(implode(PATH_SEPARATOR, $incpaths));
class Web
{
	public static function autoload($className)
	{
		$autoloadPaths = array(
			dirname(__FILE__) . '/protected/',
			dirname(__FILE__) . '/protected/classes/',
			dirname(__FILE__) . '/protected/classes/AdminPageAbstract/',
			dirname(__FILE__) . '/protected/classes/CrudPageAbstract/',
			dirname(__FILE__) . '/protected/classes/FrontEndPageAbstract/',
			dirname(__FILE__) . '/protected/classes/Soap/',
			dirname(__FILE__) . '/protected/cronjobs/',
			dirname(__FILE__) . '/protected/pages/ContentLoader/'
				);
		
		$found = false;
		
		foreach ($autoloadPaths as $path)
		{
			if (file_exists($path . $className . '.php'))
			{
				require_once $path . $className . '.php';
				$found = true;
				break;
			}
		}
		
		return $found;
	}
}

spl_autoload_register(array('Web','autoload'));

// Bootstrap the core for its autoloader settings
require(dirname(__FILE__) . '/../core/main/bootstrap.php');

?>
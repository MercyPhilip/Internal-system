<?php
/**
 * The jSignature Loader
 *
 * @package    web
 * @subpackage controls
 * @author     lhe<helin16@gmail.com>
 */
class jSignature extends TClientScript
{
	/**
	 * (non-PHPdoc)
	 * @see TControl::onLoad()
	 */
	public function onLoad($param)
	{
		$clientScript = $this->getPage()->getClientScript();
		if(!$this->getPage()->IsPostBack || !$this->getPage()->IsCallback)
		{
			$folder = $this->publishFilePath(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'libs' . DIRECTORY_SEPARATOR);
			$clientScript->registerHeadScriptFile('jSignature.js', $folder . '/jSignature.min.noconflict.js');
			$clientScript->registerHeadScriptFile('modernizr.js', $folder . '/modernizr.js');
		}
	}
}
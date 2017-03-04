<?php
require_once dirname(__FILE__) . '/../../../bootstrap.php';
ini_set("memory_limit", "-1");
set_time_limit(0);

abstract class GetMessageReport
{
	const TAB = '    ';
	/**
	 * The log file
	 *
	 * @var string
	 */
	private static $_logFile = '';
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
	 * The runner
	 *
	 * @param string $preFix
	 * @param string $debug
	 */
	public static function run($accessTokenFile, $preFix = '', $debug = false){
		$start = self::_log('## START ##############################', __CLASS__ . '::' . __FUNCTION__, $preFix);
		
		if (file_exists($accessTokenFile) && ( (time() - filemtime($accessTokenFile)) < 3000 )){
			$access_token = trim(file_get_contents($accessTokenFile));
		} else {
			$access_token = ActOnConnector::getToken();
		}
		
		$msgInfos = ActOnConnector::getMessageLists($access_token);
		
		if($msgInfos[0]['num_created'] == 0){
			self::_log('NO new message created.', '', $preFix);
		} else {
			self::_log('Totally '. $msgInfos[0]['num_created'] . ' new message created.', '', $preFix);
		}
		
		foreach ($msgInfos as $msgInfo){
			$messagesOpened = array();
			$messagesClicked = array();
			$numbersTotal = array();
			$reportsOpened = ActOnConnector::getMessageReport($access_token, $msgInfo, 'OPENED');
			
  			foreach ($reportsOpened as $reportOpened){
  				$messagesOpened[] = $reportOpened[7];
			}
			// get total opened number of each email
			$numbersOpened = array_count_values($messagesOpened);
			
			$reportsClicked = ActOnConnector::getMessageReport($access_token, $msgInfo, 'CLICKED');
			
 			foreach ($reportsClicked as $reportClicked){
				$messagesClicked[] = $reportClicked[9];
			} 
			// get total clicked number of each email
			$numbersClicked = array_count_values($messagesClicked);
			
			foreach ($numbersOpened as $keyOpened => $valueOpened){
				$flag = 0;
				foreach ($numbersClicked as $keyClicked => $valueClicked){
					if($keyOpened == $keyClicked){
						$numbersTotal[] = ['email' => $keyOpened, 'opened' => $valueOpened, 'clicked' => $valueClicked];
						$flag = 1;
						break;
					} 
				}
				if($flag == 0){
					$numbersTotal[] = ['email' => $keyOpened, 'opened' => $valueOpened, 'clicked' => 0];
				}
			}
			
			
			foreach ($numbersTotal as $numberTotal){
				$cust = Customer::getAllByCriteria('email = ?', array($numberTotal['email']), true, 1, 1);
				if(count($cust) === 0){
					self::_log(trim($keyOpened) . ' does not exist in table Customer.', '', $preFix);
					continue;
				} else {
					$cust_msg = CustomerMsg::getAllByCriteria('customerId = ? and msgListId = ?', array($cust[0]->getId(),$msgInfo['id']));
					if(count($cust_msg) === 0){
						$custMsg = CustomerMsg::create($cust[0]->getId(), $numberTotal['email'], $msgInfo['id'], $numberTotal['opened'], $numberTotal['clicked']);
						if(!$custMsg instanceof CustomerMsg)
							throw new Exception('Error creating customer message!');
					} else {
						CustomerMsg::updateByCriteria('opened =' . $numberTotal['opened'] . ', clicked = ' . $numberTotal['clicked'], 'customerId = ? and msgListId = ?', array($cust[0]->getId(),$msgInfo['id']));
					}
				}
			}
		}
		
		self::_log('## FINISH ##############################', __CLASS__ . '::' . __FUNCTION__, $preFix, $start);
	}
	
}

$acctoken_file = '/tmp/access_token.txt';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));
GetMessageReport::run($acctoken_file, '', true);
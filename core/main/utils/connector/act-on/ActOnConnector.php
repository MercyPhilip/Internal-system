<?php
class ActOnConnector
{	
	const ACTONAPIURL = 'https://restapi.actonsoftware.com/';
 	const UPLOADSPECS = '[{
							"columnHeading": "Name",
							"ignoreColumn": "N",
							"columnType": "FIRSTNAME",
							"columnIndex": 0
						},
						{
							"columnHeading": "Email",
							"ignoreColumn": "N",
							"columnType": "EMAIL",
							"columnIndex": 1
						},
				 		{
							"columnHeading": "Contact No",
							"ignoreColumn": "N",
							"columnType": "BIZ_PHONE",
							"columnIndex": 2
						}, 
						{
							"columnHeading": "Company",
							"ignoreColumn": "N",
							"columnType": "COMPANY",
							"columnIndex": 3
						},
						{
							"columnHeading": "Street",
							"ignoreColumn": "N",
							"columnType": "BIZ_STREET",
							"columnIndex": 4
						},
						{
							"columnHeading": "City",
							"ignoreColumn": "N",
							"columnType": "BIZ_CITY",
							"columnIndex": 5
						},				
						{
							"columnHeading": "State",
							"ignoreColumn": "N",
							"columnType": "BIZ_STATE",
							"columnIndex": 6
						},			
						{
							"columnHeading": "Post Code",
							"ignoreColumn": "N",
							"columnType": "BIZ_ZIP",
							"columnIndex": 7
						},				
						{
							"columnHeading": "Country",
							"ignoreColumn": "N",
							"columnType": "BIZ_COUNTRY",
							"columnIndex": 8
						}]';  
	/**
	 * The switch for Act-On functions
	 *
	 * @var string
	 */	
	private  $enable;
	
 	public function __construct(){
		$this->enable = Config::get('Acton','Enable');
	} 
	/**
	 * Getting the enable
	 *
	 * @return string
	 */
	public function getEnable() {
		return trim($this->enable);
	}	
	
	private function extraOpts($access_token) {
		$opts = array(
				CURLOPT_USERAGENT	=> 'Mozilla/5.0 ( compatible; MSIE 10.0; Windows NT 6.1) Firefox/6.0.2',
				CURLOPT_SSL_VERIFYPEER	=> 1,
				CURLOPT_FOLLOWLOCATION	=> 1,
				CURLOPT_HEADER			=> 0,
				CURLOPT_HTTPHEADER	=> array(
				'Authorization: '.$access_token,
				'Cache-Control: no-cache')
		);
		return $opts;
	}
	/**
	 * Request access and refresh tokens from Act-On or 
	 * request new access token after initial authentication
	 *
	 * @return string The access token
	 */
	public static function getToken (){
		
		$reftoken_file = '/tmp/refresh_token.txt';
		$acctoken_file = '/tmp/access_token.txt';
		$url = self::ACTONAPIURL . "token";
		$timeout = 60;
 		if(file_exists($reftoken_file)) {
			$refresh_token = trim(file_get_contents($reftoken_file));
			$postdata = array (
					'grant_type' => 'refresh_token',
					'client_id' => 'eAgsSFjPANv3jMk2R5p4TVwYBnga',
					'client_secret' => 'SaoXPiMM1CKWuwIkWRy5IUFn6ksa',
					'refresh_token' => $refresh_token,
			);			
		} else {  
			$postdata = array (
					'grant_type' => 'password',
					'username' => 'philip.x@budgetpc.com.au',
					'password' => 'welcome',
					'client_id' => 'eAgsSFjPANv3jMk2R5p4TVwYBnga',
					'client_secret' => 'SaoXPiMM1CKWuwIkWRy5IUFn6ksa'
			);
 		}
		$extraOpts = array(
				CURLOPT_USERAGENT	=> 'Mozilla/5.0 ( compatible; MSIE 10.0; Windows NT 6.1) Firefox/6.0.2',
				CURLOPT_SSL_VERIFYPEER	=> 1,
				CURLOPT_FOLLOWLOCATION	=> 1,
				CURLOPT_HEADER			=> 0,
				CURLOPT_HTTPHEADER	=> array(
						'Cache-Control: no-cache',
						'Content-Type: application/x-www-form-urlencoded')
		);
		$result = ComScriptCURL::readUrl($url, $timeout, $postdata, '', $extraOpts);
		
		//Parses Token
		$result_arr = json_decode($result,true);
		if(!array_key_exists('error', $result_arr)) {
			
			file_put_contents($reftoken_file, $result_arr['refresh_token']);
			file_put_contents($acctoken_file, $result_arr['access_token']);
// 			echo $result_arr['access_token'];
			return trim($result_arr['access_token']);
		} else {
			
			throw new Exception($result_arr);
		}
			
	}

	/**
	 * Create a new list in Act-On
	 * 
	 * @param string  $token
     * @param string  $fileName
     * @param string  $listName
     * @param string  $folderName
	 *
	 * @return array  The result from Act-On
	 */
	public static function createList($token, $fileName, $listName, $folderName = '') {
		
		$result_arr = array();
		$access_token = "Bearer ". trim($token);
		$timeout = 600;
		$uploadspecs = self::UPLOADSPECS;
		
		$url = self::ACTONAPIURL . "api/1/list";
		$postdata = array (
				'listname' => trim($listName),
				'foldername' => trim($folderName),
				'headings' => 'Y',
				'fieldseperator' => 'COMMA',
				'quotecharacter' => 'DOUBLE_QUOTE',
				'uploadspecs' => $uploadspecs,
				'file' => new CURLFile(realpath($fileName))
		);
		$http_headers = array(
				'Authorization: '.$access_token,
				'Cache-Control: no-cache'
		);
		
		$result = ComScriptCURL::uploadFile($url, $timeout, $http_headers, '', $postdata);	
		
		$result_arr = json_decode($result, true);

		return $result_arr;

	}
	
	/**
	 * Get listing of lists in Act-On
	 *
	 * @param  string  $token
	 * @param  string  $listName
	 * @param  string  $listType
	 *
	 * @return string  The required list-ID
	 */
	public static function getList($token, $listName, $listType = '') {
		$access_token = "Bearer ". trim($token);
		$timeout = 600;
		if($listType == ''){
			$listType = 'CONTACT_LIST';
		}
		
		$url = self::ACTONAPIURL . 'api/1/list?listingtype=' . trim($listType);
		$extraOpts = self::extraOpts($access_token);
		
		$result = ComScriptCURL::readUrl($url, $timeout, array(), 'GET', $extraOpts);
	
		//Parses Token
		$result_arr = json_decode($result,true);
		if(!array_key_exists('error', $result_arr)) {
			$data = $result_arr['result'];	

			foreach ($data as $key => $value){
				if($value['name'] == trim($listName)){
					return $value['id'];
				}
			}
		} else {
				
			throw new Exception($result_arr);
		}
			
	}
	/**
	 * Update an existing list in Act-On by replace method
	 *
	 * @param string  $token
	 * @param string  $fileName
	 * @param string  $listName
	 * @param string  $folderName
	 *
	 * @return array  The result from Act-On
	 */
	public static function updateList($token, $fileName, $listId) {
		$access_token = "Bearer ". trim($token);
		$timeout = 600;
		$uploadspecs = self::UPLOADSPECS;

		$merge_arr = array(
				'dstListId' => trim($listId),
				'mergeMode' => 'REPLACE',
				'columnMap' => [],
				'mergeKeyHeading' => 'Email'
		);
		$mergespecs = '[' . json_encode($merge_arr). ']';

		$url = self::ACTONAPIURL . "api/1/list/" . trim($listId);
		$postdata = array (
				'headings' => 'Y',
				'fieldseperator' => 'COMMA',
				'quotecharacter' => 'DOUBLE_QUOTE',
				'uploadspecs'	 => $uploadspecs,
				'mergespecs'	 => $mergespecs,
				'file' => new CURLFile(realpath($fileName))
		);
		$http_headers = array(
				'Authorization: '.$access_token,
				'Cache-Control: no-cache'
		);
		
		$result = ComScriptCURL::uploadFile($url, $timeout, $http_headers, 'PUT', $postdata);

		$result_arr = json_decode($result, true);
		
		return $result_arr;
		
	}
	/**
	 * Get sent message list from Act-On
	 *
	 * @param  string  $token
	 * @param  string  $listType
	 *
	 * @return array  The result from Act-On
	 */
	public static function getMessageLists($token, $listType = '') {
		$access_token = "Bearer ". trim($token);
		$timeout = 600;
		if($listType == ''){
			$listType = 'SENT';
		}
	
		$url = self::ACTONAPIURL . 'api/1/message?type=' . trim($listType);
		$extraOpts = self::extraOpts($access_token);
	
		$result = ComScriptCURL::readUrl($url, $timeout, array(), 'GET', $extraOpts);

		$result_arr = json_decode($result,true);
		
		if(is_array($result_arr) && !array_key_exists('error', $result_arr)) {
			$num = 0;	
			$data = $result_arr['msgresult'];
			for($i=0;$i<count($data);$i++){

				$msg = MessageList::getAllByCriteria('msgId = ?', array($data[$i]['msg_id']));
				
				if(count($msg) === 0) {
				
					$msgList = MessageList::create($data[$i]);
					if(!$msgList instanceof MessageList){
						throw new Exception('Error creating message list!');
					}else {
						$data[$i]['id'] = $msgList->getId();
						$num++;
					}
				} else {

					$data[$i]['id'] = $msg[0]->getId();
				}
			}

			foreach ($data as $key => $value){
				$results[] = ['msg_id' => $value['msg_id'], 'title' => $value['title'], 'id' => $value['id'],'num_created' => $num];
			}
					
		} elseif (is_array($result_arr) && array_key_exists('error', $result_arr)){
		
			throw new Exception($result_arr);
		}
		
		return $results;		
	
	}	
	/**
	 * Get message report drilldown from Act-On
	 *
	 * @param  string  $token
	 * @param  array   $messageList
	 * @param  string  $drilldownType
	 *
	 * @return array  The result from Act-On
	 */
	public static function getMessageReport($token, $messageList, $drilldownType) {
		$access_token = "Bearer ". trim($token);
		$timeout = 600;
		$messageId = $messageList['msg_id'];
		$messageListId = $messageList['id'];

		$url = self::ACTONAPIURL . 'api/1/message/' . trim($messageId) . '/report/' . trim($drilldownType) . '?responseformat=CSV';
		$extraOpts = self::extraOpts($access_token);
	
		$result_csv = ComScriptCURL::readUrl($url, $timeout, array(), 'GET', $extraOpts);
		$result = explode("\r\n", $result_csv);
 		$result_arr = array_map('str_getcsv', $result);
 		
 		$num = count($result_arr) - 1;
 		for($i=1;$i<$num;$i++){
 			$data[] = $result_arr[$i];
 		}

		if(!array_key_exists('error', $result_arr)) {
			
			krsort($data);
 			foreach ($data as $value){
 				if($drilldownType == 'OPENED'){
 					$email = trim($value[7]);
 					$timeStamp = trim($value[8]);
 				} else {
 					$email = trim($value[9]);
 					$timeStamp = trim($value[10]);
 				}
				$report = MessageReport::getAllByCriteria('email = ? and timeStamp = ?', array($email, $timeStamp), true , 1, 1);
				if(count($report) === 0){
					$msgReport = MessageReport::create($value, $messageListId, $drilldownType);
					if(!$msgReport instanceof MessageReport)
						throw new Exception('Error creating message report!');
				} else {
					break;
				}
			} 
			return $data;
		} else {
	
			throw new Exception($result_csv);
		}
			
	}
}
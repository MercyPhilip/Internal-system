<?php
/**
 * This is the OrderDetailsController
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class OrderPrintController extends BPCPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'order';
	/**
	 * The order that we are viewing
	 *
	 * @var Order
	 */
	public $order = null;
	/**
	 * Getting The end javascript
	 *
	 * @return string
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		if(isset($_REQUEST['jsmultipages']) && intval($_REQUEST['jsmultipages']) === 1)
			$js .= "pageJs.formatForPDF();";
		return $js;
	}
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::onLoad()
	 */
	public function onLoad($param)
	{
		parent::onLoad($param);
		if(!$this->isPostBack)
		{
			$this->order = Order::get($this->Request['orderId']);
			if(!$this->order instanceof Order)
				die('Invalid Order!');
			if(isset($_REQUEST['pdf']) && intval($_REQUEST['pdf']) === 1)
			{
				$file = EntityToPDF::getPDF($this->order);
				header('Content-Type: application/pdf');
				// The PDF source is in original.pdf
				readfile($file);
				die;
			}
		}
	}
	public function getType()
	{
		return $this->order->getType() === Order::TYPE_INVOICE ? 'TAX ' . Order::TYPE_INVOICE : $this->order->getType();
	}
	public function getOrdDate()
	{
		return $this->order->getOrderDate() == UDate::zeroDate() ? '' : $this->order->getOrderDate()->setTimeZone(UDate::TIME_ZONE_MELB)->format('d/M/Y');
	}
	public function getInvDate()
	{
		return $this->order->getInvDate() == UDate::zeroDate() ? '' : $this->order->getInvDate()->setTimeZone(UDate::TIME_ZONE_MELB)->format('d/M/Y');
	}
	/**
	 * Getting the tr for each row
	 * @param unknown $qty
	 * @param unknown $sku
	 * @param unknown $name
	 * @param unknown $uprice
	 * @param unknown $tprice
	 * @return string
	 */
	public function getRow($qty, $name, $desc, $uprice, $tprice, $rowClass="")
	{
		return "<tr class='$rowClass'><td class='qty' style='text-align:center'>$qty</td><td class='name'>$name</td><td class='desc'>$desc</td><td class='uprice' style='width:10.3%'>$uprice</td><td class='tprice' style='width:11.6%'>$tprice</td></tr>";
	}
	/**
	 *
	 * @return string
	 */
	public function showProducts()
	{
		$html = '';
		$index = 0;
		foreach($this->order->getOrderItems() as  $index => $orderItem)
		{
			$uPrice = '$' . number_format($orderItem->getUnitPrice(), 2, '.', ',');
			$tPrice = '$' . number_format($orderItem->getTotalPrice(), 2, '.', ',');
			$shouldTotal = $orderItem->getUnitPrice() * $orderItem->getQtyOrdered();
			$html .= $this->getRow($orderItem->getQtyOrdered(), $orderItem->getProduct()->getname(), $orderItem->getProduct()->getShortDescription(),$uPrice, $tPrice, 'itemRow');
			if(($sellingItems = $orderItem->getSellingItems()) && count($sellingItems) > 0)
			{
				$html .= $this->getRow('&nbsp;', '&nbsp;', 'Serial Numbers:', '&nbsp;', '', 'itemRow');
				foreach ($sellingItems as $sellingItem)
					$html .= $this->getRow('&nbsp;', '&nbsp;', '&nbsp;&nbsp;&nbsp;&nbsp;' . $sellingItem->getSerialNo(), '&nbsp;', '', 'itemRow');
			}
// 			$html .= $this->getRow('', '<span class="pull-right">Serial No: </span>', '<div style="max-width: 367px; word-wrap: break-word;">' . implode(', ', $sellingItems) . '</div>', '', '', '', 'itemRow itemRow-serials');
		}
		for ( $i = 10; $i > $index; $i--)
		{
			$html .= $this->getRow('&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '', 'itemRow');
		}
		return $html;
	}
	public function getContact()
	{
		$contact = trim($this->order->getCustomer()->getContactNo());
		return empty($contact) ? '' : '(' . $contact . ')';
	}
	public function getAddress($type)
	{
		$method = 'get' . ucfirst($type) . 'Addr';
		$address = $this->order->$method();
		if(!$address instanceof Address)
			return '';
		$html = '';
// 		if(trim($this->order->getCustomer()->getName()) !== trim($address->getContactName()))
// 			$html .= $this->order->getCustomer()->getName() . '<br />';
 		if(trim($address->getCompanyName()) !== '')
	 			$html .= $address->getCompanyName() . '<br />';        
		$html .= $address->getContactName() . '<br />';
		$html .= $address->getStreet() . '<br />';
		$html .= $address->getCity() . ' ' . $address->getRegion() . ' ' . $address->getPostCode() . '<br />';
// 		$html .= locale_get_display_region('-'.$address->getCountry(), 'en'). '<br />';
		$html .= 'Tel: ' . ($this->getContact() === '' ? trim($address->getContactNo()) : $this->getContact());
		return $html;
	}
	public function getPaymentSummary()
	{
		$total = $this->order->getTotalAmount();
		$shippingCostIncGST = StringUtilsAbstract::getValueFromCurrency(implode('', $this->order->getInfo(OrderInfoType::ID_MAGE_ORDER_SHIPPING_COST)));
		$shippingCostExGST = $shippingCostIncGST / 1.1;

		$totalWithOutShipping = $total - $shippingCostIncGST;
		$gstFree = $this->order->getGstFree();
		if ($gstFree == 0){
			$totalWithOutShippingNoGST = $totalWithOutShipping / 1.1;
		}else{
			$totalWithOutShippingNoGST = $totalWithOutShipping;
		}
		
		$subtotalExGST = $totalWithOutShippingNoGST + $shippingCostExGST;
		$gst = $totalWithOutShipping - $totalWithOutShippingNoGST + $shippingCostIncGST - $shippingCostExGST;

		$html = $this->_getPaymentSummaryRow('Total Excl. GST:', '$' . number_format($totalWithOutShippingNoGST, 2, '.', ','), 'grandTotalNoGST');
		$html .= $this->_getPaymentSummaryRow('Shipping Excl. GST:', '$' . number_format((double)$shippingCostExGST, 2, '.', ','), 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Sub Total Excl. GST:', '$' . number_format($subtotalExGST, 2, '.', ','), 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Total GST:', '$' . number_format($gst, 2, '.', ','), 'gst');
		$html .= $this->_getPaymentSummaryRow('<strong>Grand Total Incl. GST:</strong>', '<strong>$' . number_format((double)$total, 2, '.', ',') . '</strong>', 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Paid to Date:', '$' . number_format($this->order->getTotalPaid(), 2, '.', ','), 'paidTotal');
		$overDueClass = $this->order->getTotalDue() > 0 ? 'overdue' : '';
		$html .= $this->_getPaymentSummaryRow('<strong class="text-primary">Balance Due:</strong>', '<strong class="text-primary">$' . number_format($this->order->getTotalDue(), 2, '.', ',') . '</strong>', 'dueTotal ' . $overDueClass);
		return $html;
	}
	private function _getPaymentSummaryRow($title, $content, $class='')
	{
		$html = '<div class="print-row ' . $class . '">';
			$html .= '<span class="details_title inlineblock">';
				$html .= $title;
			$html .= '</span>';
			$html .= '<span class="details_content inlineblock">';
				$html .= $content;
			$html .= '</span>';
		$html .= '</div>';
		return $html;
	}
	public function getComments()
	{
		$comments = Comments::getAllByCriteria('entityId = ? and entityName = ? and type = ?', array($this->order->getId(), get_class($this->order), Comments::TYPE_SALES), true, 1, 1, array('id' => 'desc'));
		return count($comments) === 0 ? '' : $comments[0]->getComments();
	}
	public function getTermsCondition()
	{
		$terms = Config::get('PDFInvoice','TermsCondition');
		$html = '';
		foreach ($terms as $term){
			$html .= '<li>' . $term . '</li>';
		}

		return $html;
	}
	public function getDates()
	{
		$html = '';
		if ($this->getType() === 'TAX INVOICE'){
			$html .= '<div class="dateRow"><span class="rowTitle inlineblock">Tax Invoice No.: </span><span class="rowContent inlineblock">' . $this->order->getInvNo() . '</span></div>';
			$html .= '<div class="dateRow"><span class="rowTitle inlineblock">Invoice Date: </span><span class="rowContent inlineblock">' . $this->getInvDate(). '</span></div>';
			$html .= '<div class="dateRow"><span class="rowTitle inlineblock">Order No.: </span><span class="rowContent inlineblock">' . $this->order->getOrderNo() . '</span></div>';
			$html .= '<div class="dateRow"><span class="rowTitle inlineblock">Order Date: </span><span class="rowContent inlineblock">' . $this->getOrdDate(). '</span></div>';
		}else{
			$html .= '<div class="dateRow"><span class="rowTitle inlineblock">Quote No.: </span><span class="rowContent inlineblock">' . $this->order->getOrderNo() . '</span></div>';
			$html .= '<div class="dateRow"><span class="rowTitle inlineblock">Quote Date: </span><span class="rowContent inlineblock">' . $this->getOrdDate(). '</span></div>';
			$html .= '<div class="dateRow"><span class="rowTitle inlineblock">Tax Invoice No.: </span><span class="rowContent inlineblock">' . $this->order->getInvNo() . '</span></div>';
			$html .= '<div class="dateRow"><span class="rowTitle inlineblock">Invoice Date: </span><span class="rowContent inlineblock">' . $this->getInvDate(). '</span></div>';
		}
		$html .= '<div class="dateRow"><span class="rowTitle inlineblock">PO No.: </span><span class="rowContent inlineblock">' . $this->order->getPONo() . '</span></div>';
		

		return $html;
	}
}
?>
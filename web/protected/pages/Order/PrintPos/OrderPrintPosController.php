<?php
/**
 * This is the OrderPrintPosController
 *
 * @package    Web
 * @subpackage Controller
 * @author     
 */
class OrderPrintPosController extends BPCPageAbstract
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
	 * The total items ordered
	 * @var int
	 */
	public $totalItems = 0;
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
	/**
	 * Get order type
	 * @return string
	 */
	public function getType()
	{
		return $this->order->getType() === Order::TYPE_INVOICE ? 'TAX ' . Order::TYPE_INVOICE : $this->order->getType();
	}
	/**
	 * Get the issued date of the invoice 
	 * @return string
	 */
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
	 * @param unknown $discount
	 * @param unknown $tprice
	 * @param string $rowClass
	 * @return string
	 */
	public function getRow($qty, $sku, $name, $uprice, $discount, $tprice, $rowClass="")
	{
 		$sku = '[ ' . $sku . ' ]';
		if ($qty > 1)
		{
			return "<tr class='$rowClass'><td class='sku'>$sku $name (Qty: $qty @ $uprice each)</td><td class='tprice'>$tprice</td></tr>";
		}
		else
		{
			return "<tr class='$rowClass'><td class='sku'>$sku $name</td><td class='tprice'>$tprice</td></tr>";
		}
	}
	/**
	 * Getting the Serial No for each row
	 * @param string $serial
	 * @param string $rowClass
	 * @return string
	 */
	public function getRowSerial($serial, $rowClass="")
	{
		return "<tr class='$rowClass'><td colspan=2 class='sku'>$serial</td></tr>";
	}
	/**
	 * Get all the products details
	 * @return string
	 */
	public function showProducts()
	{
		$html = '';
		$index = 0;
		$this->totalItems = 0;
		foreach($this->order->getOrderItems() as  $index => $orderItem)
		{
			$uPrice = '$' . number_format($orderItem->getUnitPrice(), 2, '.', ',');
			$tPrice = '$' . number_format($orderItem->getTotalPrice(), 2, '.', ',');
			$shouldTotal = $orderItem->getUnitPrice() * $orderItem->getQtyOrdered();
			$discount = (floatval($shouldTotal) === 0.0000 ? 0.00 : round(((($shouldTotal - $orderItem->getTotalPrice()) * 100) / $shouldTotal), 2));
			$html .= $this->getRow($orderItem->getQtyOrdered(), $orderItem->getProduct()->getSku(), $orderItem->getItemDescription() ?: $orderItem->getProduct()->getname(), $uPrice, ($discount === 0.00 ? '' : $discount . '%'), $tPrice, 'itemRow');
			if(($sellingItems = $orderItem->getSellingItems()) && count($sellingItems) > 0)
			{
				$html .= $this->getRowSerial('&nbsp;&nbsp;&nbsp;&nbsp;Serial Numbers:','itemRow');
				foreach ($sellingItems as $sellingItem)
					$html .= $this->getRowSerial('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $sellingItem->getSerialNo(), 'itemRow');
			}
			$this->totalItems = $this->totalItems + $orderItem->getQtyOrdered();
		}
		return $html;
	}
	/**
	 * Get customer contact details
	 * @return string
	 */
	public function getContact()
	{
		$contact = trim($this->order->getCustomer()->getContactNo());
		return empty($contact) ? '' : '(' . $contact . ')';
	}
	/**
	 * Get the address detail of customer
	 * @param unknown $type
	 * @return string
	 */
	public function getAddress($type)
	{
		$method = 'get' . ucfirst($type) . 'Addr';
		$address = $this->order->$method();
		if(!$address instanceof Address)
			return '';
		$html = '';
 		if(trim($address->getCompanyName()) !== '')
	 			$html .= $address->getCompanyName() . '<br />';        
		$html .= $address->getContactName() . '<br />';
		return $html;
	}
	/**
	 * Get the summary of payment
	 * @return string
	 */
	public function getPaymentSummary()
	{
		$total = $this->order->getTotalAmount();
		$shippingCostIncGST = StringUtilsAbstract::getValueFromCurrency(implode('', $this->order->getInfo(OrderInfoType::ID_MAGE_ORDER_SHIPPING_COST)));
		$totalWithOutShipping = $total - $shippingCostIncGST;
		$totalWithOutShippingNoGST = $totalWithOutShipping / 1.1;
		$gst = $totalWithOutShipping - $totalWithOutShippingNoGST;

		$html = $this->_getPaymentSummaryRow('Total Excl. GST:', '$' . number_format($totalWithOutShippingNoGST, 2, '.', ','), 'grandTotalNoGST');
		$html .= $this->_getPaymentSummaryRow('Total GST:', '$' . number_format($gst, 2, '.', ','), 'gst');
		$html .= $this->_getPaymentSummaryRow('Sub Total Incl. GST:', '$' . number_format($totalWithOutShipping, 2, '.', ','), 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Shipping Incl. GST:', '$' . number_format((double)$shippingCostIncGST, 2, '.', ','), 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('<strong>Grand Total Incl. GST:</strong>', '<strong>$' . number_format((double)$total, 2, '.', ',') . '</strong>', 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Paid to Date:', '$' . number_format($this->order->getTotalPaid(), 2, '.', ','), 'paidTotal');
		$overDueClass = $this->order->getTotalDue() > 0 ? 'overdue' : '';
		$html .= $this->_getPaymentSummaryRow('<strong class="text-primary">Balance Due:</strong>', '<strong class="text-primary">$' . number_format($this->order->getTotalDue(), 2, '.', ',') . '</strong>', 'dueTotal ' . $overDueClass);
		return $html;
	}
	/**
	 * Get each row of the summary of payment
	 * @return string
	 */
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
	/**
	 * Get the comments of the order
	 * @return string
	 */
	public function getComments()
	{
		$comments = Comments::getAllByCriteria('entityId = ? and entityName = ? and type = ?', array($this->order->getId(), get_class($this->order), Comments::TYPE_SALES), true, 1, 1, array('id' => 'desc'));
		return count($comments) === 0 ? '' : $comments[0]->getComments();
	}
}
?>
<?php
/**
 * This is the CreditNotePrintController
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class CreditNotePrintController extends BPCPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'creditnote';
	/**
	 * The credit note that we are viewing
	 *
	 * @var credit note
	 */
	public $creditNote = null;
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
			$this->creditNote = CreditNote::get($this->Request['creditnoteId']);
			if(!$this->creditNote instanceof CreditNote)
				die('Invalid CreditNote!');
			if(isset($_REQUEST['pdf']) && intval($_REQUEST['pdf']) === 1)
			{
				$file = EntityToPDF::getPDF($this->creditNote);
				header('Content-Type: application/pdf');
				// The PDF source is in original.pdf
				readfile($file);
				die;
			}
		}
	}
	public function getType()
	{
		if ($this->creditNote->getOrder() instanceof Order)
		{		
			return $this->creditNote->getOrder()->getType() === Order::TYPE_INVOICE ? 'TAX ' . Order::TYPE_INVOICE : $this->creditNote->getOrder()->getType();
		}
		else 
		{
			return '';
		}
	}
	public function getInvDate()
	{
		if ($this->creditNote->getOrder() instanceof Order)
		{
			return $this->creditNote->getOrder()->getInvDate() == UDate::zeroDate() ? '' : $this->creditNote->getOrder()->getInvDate()->format('d/M/Y');
		}
		else
		{
			return '';
		}
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
	public function getRow($qty, $sku, $name, $uprice, $discount, $tprice, $rowClass="")
	{
		return "<tr class='$rowClass'><td class='qty'>$qty</td><td class='sku'>$sku</td><td class='name'>$name</td><td class='uprice'>$uprice</td><td class='discount' width='8%'>$discount</td><td class='tprice'>$tprice</td></tr>";
	}
	/**
	 *
	 * @return string
	 */
	public function showProducts()
	{
		$html = '';
		$index = 0;
		foreach($this->creditNote->getCreditNoteItems() as  $index => $orderItem)
		{
			$uPrice = '$' . number_format($orderItem->getUnitPrice(), 2, '.', ',');
			$tPrice = '$' . number_format($orderItem->getTotalPrice(), 2, '.', ',');
			$shouldTotal = $orderItem->getUnitPrice() * $orderItem->getQty();
			$discount = (floatval($shouldTotal) === 0.0000 ? 0.00 : round(((($shouldTotal - $orderItem->getTotalPrice()) * 100) / $shouldTotal), 2));
			$html .= $this->getRow('-' . $orderItem->getQty(), $orderItem->getProduct()->getSku(), $orderItem->getItemDescription() ?: $orderItem->getProduct()->getname(), $uPrice, ($discount === 0.00 ? '' : $discount . '%'), $tPrice, 'itemRow');
				
		}
		for ( $i = 5; $i > $index; $i--)
		{
			$html .= $this->getRow('&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '', 'itemRow');
		}
		return $html;
	}
	public function getContact()
	{
		$contact = trim($this->creditNote->getCustomer()->getContactNo());
		return empty($contact) ? '' : '(' . $contact . ')';
	}
	public function getAddress($type)
	{
		if (!$this->creditNote->getOrder() instanceof Order) return '';
		$method = 'get' . ucfirst($type) . 'Addr';
		$address = $this->creditNote->getOrder()->$method();
		if(!$address instanceof Address)
			return '';
		$html = '';
 		if(trim($address->getCompanyName()) !== '')
	 			$html .= $address->getCompanyName() . '<br />';        
		$html .= $address->getContactName() . '<br />';
		$html .= $address->getStreet() . '<br />';
		$html .= $address->getCity() . ' ' . $address->getRegion() . ' ' . $address->getPostCode() . '<br />';
		$html .= 'Tel: ' . ($this->getContact() === '' ? trim($address->getContactNo()) : $this->getContact());
		return $html;
	}
	public function getPaymentSummary()
	{	
		$total = $this->creditNote->getTotalValue();
		$shippingCostIncGST = StringUtilsAbstract::getValueFromCurrency($this->creditNote->getShippingValue());
		$totalWithOutShipping = $total - $shippingCostIncGST;
		$totalWithOutShippingNoGST = $totalWithOutShipping / 1.1;
		$gst = $totalWithOutShipping - $totalWithOutShippingNoGST;

		$html = $this->_getPaymentSummaryRow('Total Excl. GST:', '$' . number_format($totalWithOutShippingNoGST, 2, '.', ','), 'grandTotalNoGST');
		$html .= $this->_getPaymentSummaryRow('Total GST:', '$' . number_format($gst, 2, '.', ','), 'gst');
		$html .= $this->_getPaymentSummaryRow('Sub Total Incl. GST:', '$' . number_format($totalWithOutShipping, 2, '.', ','), 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Shipping Incl. GST:', '$' . number_format((double)$shippingCostIncGST, 2, '.', ','), 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('<strong>Grand Total Incl. GST:</strong>', '<strong>$' . number_format((double)$total, 2, '.', ',') . '</strong>', 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Paid to Date:', '$' . number_format($this->creditNote->getTotalPaid(), 2, '.', ','), 'paidTotal');
		$overDue = $total - $this->creditNote->getTotalPaid();
		$overDueClass = $overDue > 0 ? 'overdue' : '';
		$html .= $this->_getPaymentSummaryRow('<strong class="text-danger">Balance Due:</strong>', '<strong class="text-danger">-$' . number_format($overDue, 2, '.', ',') . '</strong>', 'dueTotal ' . $overDueClass);
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
		$comments = Comments::getAllByCriteria('entityId = ? and entityName = ? and type = ?', array($this->creditNote->getId(), get_class($this->creditNote), Comments::TYPE_SALES), true, 1, 1, array('id' => 'desc'));
		return count($comments) === 0 ? '' : $comments[0]->getComments();
	}
}
?>
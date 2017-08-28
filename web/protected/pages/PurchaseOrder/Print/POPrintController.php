<?php
/**
 * This is the OrderDetailsController
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class POPrintController extends BPCPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'purchaseorders.prints';
	/**
	 * The order that we are viewing
	 *
	 * @var Order
	 */
	public $order = null;
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::onLoad()
	 */
	public function onLoad($param)
	{
		parent::onLoad($param);
		if(!$this->isPostBack)
		{
			$this->order = PurchaseOrder::get($this->Request['POId']);
			if(!$this->order instanceof PurchaseOrder)
				die('Invalid Purchase Order!');
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
	public function getInvDate()
	{
		return $this->order->getInvDate() == UDate::zeroDate() ? '' : $this->order->getInvDate()->format('d/M/Y');
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
	public function getRow($qty, $sku, $suplierCode, $name, $uprice, $tprice, $rowClass="")
	{
		return "<tr class='$rowClass'><td class='qty' style='text-align:center'>$qty</td><td class='sku'>$sku</td><td class='supplier' style='width:14.6%'>$suplierCode</td><td class='name'>$name</td><td class='uprice' style='width:10.5%'>$uprice</td><td class='tprice' style='width:11.6%'>$tprice</td></tr>";
	}
	/**
	 *
	 * @return string
	 */
	public function showProducts()
	{
		$html = '';
		$supplierId = $this->order->getSupplier()->getId();
		$purchaseOrderItems = PurchaseOrderItem::getAllByCriteria('purchaseOrderId = ?', array($this->order->getId() ) );
		foreach($purchaseOrderItems as  $index => $orderItem)
		{
			$supplierCode = count($supplierCodes = SupplierCode::getAllByCriteria('productId = ? and supplierId = ?', array($orderItem->getProduct()->getId(),$supplierId))) > 0 ? $supplierCodes[0]->getCode() : '';
			$uPrice = '$' . number_format($orderItem->getUnitPrice(), 2, '.', ',');
			$tPrice = '$' . number_format($orderItem->getTotalPrice(), 2, '.', ',');
			$html .= $this->getRow($orderItem->getQty(), $orderItem->getProduct()->getSku(), $supplierCode, $orderItem->getProduct()->getname(), $uPrice, $tPrice, 'itemRow');
		}
		for ( $i = 17; $i > $index; $i--)
		{
			$html .= $this->getRow('&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', 'itemRow');
		}
		return $html;
	}
	public function getComments()
	{
		$html = '';
		$comments = Comments::getAllByCriteria('entityName = ? AND type = ? AND entityId = ?', array('PurchaseOrder', Comments::TYPE_PURCHASING, $this->order->getId()), true, 1, 5, array('comm.id'=> 'desc'));
		if(count($comments) === 0)
			return '';
		foreach($comments as $comment)
		{
			$html .= '<div style="max-width: 670px; word-wrap: break-word; font-weight: bold; color: brown;">' . $comment->getComments() . '</div>';
		}
		return $html;
	}
	public function getPaymentSummary()
	{
		$totalAmount = 0;
		$purchaseOrderItems = PurchaseOrderItem::getAllByCriteria('purchaseOrderId = ?', array($this->order->getId() ) );
		foreach($purchaseOrderItems as  $index => $poItem)
		{
			$totalAmount += $poItem->getTotalPrice();
		}
		$total = $this->order->getTotalAmount();
		$totalNoGST = $total / 1.1;
		$discount = ((1 - round(($totalNoGST / $totalAmount),2)) * 100);
		$gst = $total - $totalNoGST;
		$totalDue = $total + $this->order->getShippingCost() + $this->order->getHandlingCost() - $this->order->getTotalPaid();
		$html = $this->_getPaymentSummaryRow('Total Excl. GST:', '$' . number_format($totalAmount, 2, '.', ','), 'grandTotalNoGST');
		$html .= $this->_getPaymentSummaryRow('Discount:', $discount.'%', 'discount');
		$html .= $this->_getPaymentSummaryRow('Subtotal Excl. GST:', '$' . number_format($totalNoGST, 2, '.', ','), 'subtotalNoGST');
		$html .= $this->_getPaymentSummaryRow('GST:', '$' . number_format($gst, 2, '.', ','), 'gst');
		$html .= $this->_getPaymentSummaryRow('SubTotal Incl. GST:', '$' . number_format($total, 2, '.', ','), 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Shipping Fee Incl. GST:', '$' . number_format($this->order->getShippingCost(), 2, '.', ','), 'grandTotal');
		$html .= $this->_getPaymentSummaryRow('Handling Fee Incl. GST:', '$' . number_format($this->order->getHandlingCost(), 2, '.', ','), 'grandTotal');
// 		$html .= $this->_getPaymentSummaryRow('Paid to Date:', '$' . number_format($this->order->getTotalPaid(), 2, '.', ','), 'paidTotal');
		$overDueClass = $totalDue > 0 ? 'overdue' : '';
		$html .= $this->_getPaymentSummaryRow('Balance Due:', '$' . number_format($totalDue, 2, '.', ','), 'dueTotal ' . $overDueClass);
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
}
?>
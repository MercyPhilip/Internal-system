<table class='orderview' cellspacing="0" cellpadding="0">
    <thead>
        <tr class="title_row">
            <td colspan=6>
                <div>
                    <span class="inlineblock logo">
                        <img src={logoUrl} style="padding: 0px; margin: 0px;display: block;"/>
                        <span class="inlineblock orderno">
                            Order No.: {orderNo}
                        </span>
                    </span>
                    <span class="inlineblock info">
                        <div class="cname">BUDGET PC PTY LTD</div>
                        <div class="abn">ABN 29 133 654 761</div>
                        <span class="inlineblock dates">
                            <div class="dateRow"><span class="rowTitle inlineblock">Order Date: </span><span class="rowContent inlineblock">{OrderDate}</span></div>
                            <div class="dateRow"><span class="rowTitle inlineblock">Invoice No.: </span><span class="rowContent inlineblock">{InvNo}</span></div>
                            <div class="dateRow"><span class="rowTitle inlineblock">Invoice Date.: </span><span class="rowContent inlineblock">{InvDate}</span></div>
                            <div class="dateRow"><span class="rowTitle inlineblock">PO No.: </span><span class="rowContent inlineblock">{PONo}</span></div>
                        </span>
                    </span>
                </div>
                <div class="sep">
                </div>
            </td>
        </tr>
        <tr class="addr_info">
            <td colspan=6>
                <span class="inlineblock half">
                    <div class="title">Billing To:</div>
                    <div class="addr">{AddressBilling}</div>
                </span>
                <span class="inlineblock half">
                    <div class="title">Shipping To:</div>
                    <div class="addr">{AddressShipping}</div>
                </span>
            </td>
        </tr>
        {headerRow}
    </thead>
    <tbody>
        {productDiv}
    </tbody>
    <tfoot>
        <tr>
            <td colspan=6>
                <div class="order_payments">
                    <span class="payment_details inlineblock">
                        <div class="bank_details box">
                            <span class="bank_title">Budget PC Bank Details: </span>
                            <span class="bank_details_name"><span class="details_title">Account Name: </span>Budget PC Pty Ltd</span>
                            <span class="bank_details_acc_bsb"><span class="details_title">BSB:</span>013 471</span>
                            <span class="bank_details_acc_no"><span class="details_title">ACC:</span>4796 74364</span>
                        </div>
                        <div class="shipping_details box">
                            <div class="print-row">
                                <span class="inlineblock half"><span class="inlineblock title">Salesperson:</span><span class="inlineblock details">{UpdatedByPerson}</span></span>
                                <span class="inlineblock half"><span class="inlineblock title">Payment:</span><span class="inlineblock details"></span></span>
                            </div>
                            <div class="print-row">
                                <span class="inlineblock half"><span class="inlineblock title">Delivery Via:</span><span class="inlineblock details"></span></span>
                                <span class="inlineblock half"><span class="inlineblock title">comments:</span><span class="inlineblock details"></span></span>
                            </div>
                        </div>
                    </span>
                    <span class="payment_summary inlineblock box">
                        {PaymentSummary}
                    </span>
                </div>
                <div class="order_tc box">
                    <div class="tc_title">Terms and conditions of sale</div>
                    <div class="tc_details">
                        <ol>
                            <li>All prices on Budget PC price list are specified to be in Australian dollars and are subject to alteration without notice.</li>
                            <li>All New Systems have 2 years, New Parts 1 year, Used Systems 3 months, and Used Parts 1month warranty coverred.</li>
                            <li>All All warranties are on a "RETURN TO FACTORY" basis only.</li>
                            <li>Warranty does not cover any damage to other equipment used in the RA unit.</li>
                            <li>This invoice must be presented for warranty. A $20 labor fee will be charged if the goods are found to be no issue.</li>
                            <li>Refund on sale of systems and parts will only be made within 7 days from teh date of purchase. A 15% restock fee will applied for such refund.</li>
                            <li>Purchaser assumes all responsibility for payment of shipping charges.</li>
                        </ol>
                    </div>
                </div>
                <div class="order_receiver_signature">
                    <span class="printName inlineblock third"><span class="details_title">Print Name: </span></span>
                    <span class="signature inlineblock third"><span class="details_title">Signature: </span></span>
                    <span class="received_date inlineblock third"><span class="details_title">Received on: </span>___ / ____ / _____</span>
                </div>
                <div class="order_company_details">
                    <div class="addr">
                        <span class="addr"><span class="details_title">Mount Waverley</span>Unit 111, 45 Gilby Rd, Mt Waverley</span>
                        <span class="phone"><span class="details_title">PH</span>+61 3 9541 9000</span>
                        <span class="addr"><span class="details_title">Stawell</span>1 Horsham Rd, Stawell</span>
                        <span class="phone"><span class="details_title">PH</span>+61 3 5358 4288</span>
                    </div>
                    <div class="url details_title">
                        www.budgetpc.com.au
                    </div>
                </div>
            </td>
        </tr>
    </tfoot>
</table>
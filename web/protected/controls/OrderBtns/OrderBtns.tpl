<com:TCallback ID="sendEmailBtn" OnCallback="sendEmail" />
<div class="col-md-3" id="storeId" value=<%=Core::getUser()->getStore()->getId()%> ></div>
<div class="col-md-3" id="userId" value=<%=Core::getUser()->getId()%> ></div>
<div class="col-md-3" id="userEmail" value=<%= UserAccount::get(Core::getUser()->getId())->getEmail() %> ></div>

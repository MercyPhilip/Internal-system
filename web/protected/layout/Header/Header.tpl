<div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".mainMenu">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="/"><%= Config::get('PDFInvoice','CompanyDetail')['Name'] %></a>
    </div>
    <div class="collapse navbar-collapse mainMenu">
	    <com:Application.layout.Menu.Menu ID="Menu"/>
		<ul class="nav navbar-nav navbar-right">
			<li><a href='/me.html'> <%= Core::getUser()->getStore()->getName() %></a></li>
			<li><a href='/me.html'><%= Core::getRole()->getName() %>: <%= Core::getUser()->getPerson() %></a></li>
			<li><com:TLinkButton Text="Logout" onClick="logout" CssClass="logoutBtn"/></li>
		</ul>
	</div>
	<div class="col-md-3" id="storeId" value=<%=Core::getUser()->getStore()->getId()%> >
	</div>
	<div class="col-md-3" id="userId" value=<%=Core::getUser()->getId()%> >
	</div>
</div>

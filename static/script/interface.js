var CurrentMenuID = null;                                                        
var CurrentEntryID = null;                                                       
var MenuHeight = 24;                                                             
var EntryHeight = 19;
var oRefreshTimer = -1;
var iRefreshPeriod = 10;
var session_valid;
var helpwin;

function getContentWdoc()
{
	var oDoc = document.getElementById("ContentFrame").contentWindow.document;
	if (oDoc.forms.length > 0) {
		return(oDoc);
	}
}

function Logout(confirm)
{
	if (!confirm)
	{
		window.top.document.location.replace( "/logout" );
	}
	else if (window.confirm(LogoutConfirmation))
	{
		window.top.document.location.replace( "/logout" );
	}
}

function adjust()                                                                
{                                                                                
	var c_Width = document.documentElement.clientWidth;
	var c_Height = document.documentElement.clientHeight;

	$("#MenuBar").height(c_Height - 140 - 20);
	$("#oLogout").css("left", $("#IdentityInformation")[0].clientWidth + 10);

	$("#PageBar").width(c_Width);           
	if ((!CurrentCategory && (CurrentPage == 1 || CurrentPage == 8|| CurrentPage == 11))
		|| CurrentCategory == 2 || (CurrentCategory == 3 && CurrentPage == 1)
		|| login_group == "monitor")
	{
		$("#PageName").css("right",
			$("#oReload")[0].clientWidth + $("#oHelp")[0].clientWidth + 92
		);
	}
	else
	{
		$("#PageName").css("right",
			$("#oApply")[0].clientWidth + $("#oReload")[0].clientWidth + $("#oHelp")[0].clientWidth + 97
		);
	}

	$("#oApply").css("right",
		$("#oReload")[0].clientWidth + $("#oHelp")[0].clientWidth + 92
	);
	$("#oReload").css("right", $("#oHelp")[0].clientWidth + 87);
	$("#oHelp").css("right", 82);

	$("#ContentHeader").height(c_Height - 111 - 12);
	$("#ContentFrame").css({
		width : c_Width - 262,
		height : c_Height - 196
	});

	$("#PageTailer").width(c_Width - 15 - 10);

	if (!CurrentCategory && CurrentPage == 3)
	{
		// network page
		$("#HeaderFrame").width(parseInt($("#ContentFrame").width()) * 1/2);
		if (parseInt($("#HeaderFrame").width()) < 450)
			$("#HeaderFrame").width(450);
	}

	return;
}

function collapseAll( _sourceID )
{
	if(! _sourceID) _sourceID = null;
	if((CurrentMenuID != null) && (CurrentMenuID != _sourceID)){
		var _target = document.getElementById(CurrentMenuID);
		var _item = _target.getElementsByTagName("DIV")[0];
		_item.style.display = "none";

		//recover menu
		menu_idx = CurrentMenuID.match(/\d+/);
		_span = _target.getElementsByTagName("SPAN")[0];
		_span.className = "ItemClose";
		height = (MenuHeight * (parseInt(menu_idx) + 1));
		sibling_node = _target.nextSibling;
		while (sibling_node)
		{
			sibling_node.style.top = height + "px";
			sibling_node = sibling_node.nextSibling;
			height += MenuHeight;
		}
	}
	CurrentMenuID = _sourceID;
	return;
}

function expand( _source )
{
	var _target, _span;
	if (CurrentMenuID != _source.id)
	{
		collapseAll(_source.id);
		CurrentMenuID = _source.id;
		_target = _source.getElementsByTagName("div")[0];
		if (_target.style.display == "none")
		{
			menu_idx = _source.id.match(/\d+/);
			_span = _source.getElementsByTagName("span")[0];
			_span.className = "ItemOpen";
			height = parseInt(_target.style.height) + (MenuHeight * (parseInt(menu_idx) + 1)) + 1;
			sibling_node = _source.nextSibling;
			while (sibling_node)
			{
				sibling_node.style.top = height + "px";
				sibling_node = sibling_node.nextSibling;
				height += MenuHeight;
			}
			
			_target.style.display = "";
		}	
	}

	if (_source.id.match(/\d+/) == CurrentCategory){
		//Show ContentDialog
		$('#ContentDialog').show();
	}else {
		//Don't show ContentDialog
		$('#ContentDialog').hide();
	}
	return;
}

function adjustContentDialog()
{
	//Summary page
	if (!CurrentCategory && CurrentPage == 1)
		$('#ContentDialog').css("top", 144);
	else
		$('#ContentDialog').css("top", 141 + (CurrentCategory * MenuHeight) + ((CurrentPage-1) * EntryHeight));
} 

function NewContent()
{
	$('#PageName span:eq(0)').html(MainMenu[CurrentCategory][0]);
	$('#PageName span:eq(1)').html(MainMenu[CurrentCategory][CurrentPage]);

	if ((!CurrentCategory && (CurrentPage == 1 || CurrentPage == 8 || CurrentPage == 12))
		|| CurrentCategory == 2 || (CurrentCategory == 3 && CurrentPage == 1) || is_expired
		|| login_group == "monitor")
	{
		$('#oApply').hide();
		$("#PageName").css("right",
			$("#oReload")[0].clientWidth + $("#oHelp")[0].clientWidth + 92
		);
	}
	else
	{
		$('#oApply').show();
		$("#PageName").css("right",
			$("#oApply")[0].clientWidth + $("#oReload")[0].clientWidth + $("#oHelp")[0].clientWidth + 97
		);
	}

	$('#ContentFrame').attr("src",
		 "/" + PageMenu[CurrentCategory][0] + "/" + PageMenu[CurrentCategory][CurrentPage]);

	//HeaderFrame
	if(!CurrentCategory && CurrentPage == 3)
	{
		// network page
		$('#HeaderFrame')
		.attr("src", "/system/network_header")
		.width(parseInt($("#ContentFrame").width()) * 1/2)
		.show();
		if (parseInt($('#HeaderFrame').width()) < 450)
			$("#HeaderFrame").width(450);
	}
	else
	{
		$('#HeaderFrame').hide();
	}

	if (typeof(helpwin) == "object" && ! helpwin.closed)
	{
		var help_url = "/help/" + CurrentLanguageStr + "/" + PageMenu[CurrentCategory][0]
			 + "_" + PageMenu[CurrentCategory][CurrentPage] + ".html";
		helpwin.location.replace(help_url, null,
			"menubar=0, scrollbars=1, resizable=1, status=0, titlebar=0, toolbar=0");
	}
}

function NewPage( oEntry )
{
	var iCategory, iPage;
	var OldEntry;
	var anchor = oEntry.id.match(/\d+/);
	
	iCategory = Math.floor( anchor / 100 );
	iPage = anchor % 100;

	if (CurrentEntryID)
	{
		OldEntry = document.getElementById(CurrentEntryID);
		OldEntry.style.backgroundColor = MenuItemLeaveBackColor;
		OldEntry.style.color = MenuItemLeaveForeColor;
		OldEntry.getElementsByTagName("span")[0].style.fontWeight = "normal";
	}
	
	oEntry.style.backgroundColor = MenuItemSelectedBackColor;
	oEntry.style.color = MenuItemOnForeColor;
	oEntry.getElementsByTagName("span")[0].style.fontWeight = "bolder";
	CurrentEntryID = oEntry.id;

	if (iCategory == MainMenu.length - 1)
	{
		$('[name="CurrentCategory"]').val( CurrentCategory );
		$('[name="CurrentPage"]').val( CurrentPage );
		$('[name="CurrentLanguage"]').val( parseInt(iPage) - 1 );
		$('#ofmResult').submit();
	}
	else
	{
		check_session();

		CurrentCategory = iCategory;
		CurrentPage = iPage;
		$('#ContentDialog').hide();
		adjustContentDialog();
		NewContent();
	}
}

function check_session()
{
	$.ajax({
		url: 'refresh',
		type: 'POST',
		error: function() {
			var bApply = document.getElementById("oApply");
			if (!bApply.disabled) {
				// logout when user doesn't apply
				Logout(false);
			}
		},
		success: function(response) {
			session_valid = response;
		}
	});

	if (session_valid == "Delete")
	{
		// some one delete your account
		alert(del_acc_msg);
		Logout(false); 
	}
	else if (session_valid == "False")
	{
		// lose session or session invalid
		Logout(false);
	}
}

function Refresh()
{
	var bApply = document.getElementById("oApply");
	if (!bApply.disabled) {
		check_session();
	}
	oRefreshTimer = window.setTimeout( "Refresh()", iRefreshPeriod * 1000 );
}

function Initialize()
{
	var _index;                                                              
	var _item;                                                               
	var _top, _top0;                                                         
	var _count;                                                              
	var _entry;                                                              
	var _i, _set;
	var c_Width = document.documentElement.clientWidth;
	var c_Height = document.documentElement.clientHeight;

	window.onresize = adjust;
	
	$("#CompanyAnchor").attr("target", '_blank');
	$("#PageBar").width(c_Width);

	$("#ContentFrame").css({
		width : c_Width - 262,
		height : c_Height - 196
	});

	$('#ItemTemplate').click(function(){
		expand(this);
	});

	$('#EntryTemplate').mousemove(function(){
		highlight(this);
	}).mouseout(function(){
		restore(this);
	}).click(function(){
		NewPage(this);
	});

	$('#oLogout').click(function(){
		Logout(true);
	});

	$('#oApply').click(function(){
		Apply(this);
	});

	$('#oReload').click(function(){
		Reload(this);
	});

	$('#oLogout, #oApply, #oReload, #oHelp').mousemove(function(){
		$(this).addClass("button_mouseover");
	}).mouseout(function(){
		$(this).removeClass("button_mouseover");
	});

	$('#oHelp').click(function(){
		var help_url = "/help/" + CurrentLanguageStr + "/" + PageMenu[CurrentCategory][0]
			 + "_" + PageMenu[CurrentCategory][CurrentPage] + ".html";
		if (typeof(helpwin) != "object" || helpwin.closed)
		{
			helpwin=window.open(help_url, null,
				"menubar=0, scrollbars=1, resizable=1, status=0, titlebar=0, toolbar=0");
		}
		else
		{
			helpwin.location.replace(help_url);
		}
	});

	_top0 = 0;
	for (_index = 0; _index < MainMenu.length; _index++)
	{
		_item = $("#ItemTemplate").clone(true).appendTo('#MenuBar');
		_item.attr("id", "MenuItem"+_index)
		.css("top", _top0).show()
		.children('span')
		.html("&nbsp;&nbsp;" + MainMenu[_index][0] + "&nbsp;&nbsp;");

		_top = 0
		for(_count = 1; _count < MainMenu[_index].length; _count++)
		{
			$("#EntryTemplate").clone(true)
			.appendTo(_item.children('div'))
			.attr("id", "MenuEntry" + String(_index*100 + _count))
			.css("top", _top).show()
			.children('span')
			.html("&nbsp;&nbsp;" + MainMenu[_index][_count] + "&nbsp;&nbsp;");
			
			_top += EntryHeight;
		}
		
		_item.children('div').width(255).height(_top).hide();
		
		_top0 += MenuHeight;
	}

	adjust();

	NewPage(document.getElementById("MenuEntry" + String(CurrentCategory*100 + CurrentPage)));
	//Enpand menu
	expand(document.getElementById("MenuItem" + CurrentCategory));
	//Refresh and check session
	oRefreshTimer = window.setTimeout( "Refresh()", iRefreshPeriod * 1000 );
}

function finalize()
{
	if (typeof(helpwin) == "object" && !helpwin.closed)
		helpwin.close();

	window.onresize = null;

	if( -1 != oRefreshTimer )
	{
		window.clearTimeout( oRefreshTimer );
	}
	return;
}

function highlight(_target)
{
	if (CurrentEntryID != _target.id)
	{
		_target.style.backgroundColor = MenuItemOnBackColor;
		_target.style.color = MenuItemOnForeColor;
	}
	
	return;	
}

function restore(_target)
{
	if (CurrentEntryID != _target.id)
	{
		_target.style.backgroundColor = MenuItemLeaveBackColor;
		_target.style.color = MenuItemLeaveForeColor;
	}
	
	return;	
}

function button_disable()
{
	var bApply = document.getElementById("oApply");
	var bReload = document.getElementById("oReload");

	// for IE
	bApply.disabled = true;
	bReload.disabled = true;

	bApply.style.color = "#A9A9A9";
	bReload.style.color = "#A9A9A9";
}

function Apply()
{
	var oDoc = getContentWdoc();
	var bApply = document.getElementById("oApply");

	if ( !bApply.disabled )
	{
		if ((oDoc.forms.length > 0)
			&& (oDoc.forms["fmResult"].no_submit.value != "yes")
			&& ( window.confirm( ApplyConfirmation ) )
			&& !is_expired)
		{
			button_disable();
			if ( oDoc.forms["fmResult"].onsubmit != null )
				oDoc.forms["fmResult"].onsubmit();
			oDoc.forms["fmResult"].submit();
		}
	}
}

function Reload()
{
	var bReload = document.getElementById("oReload");

	if ( !bReload.disabled )
	{
		$("#ContentFrame").attr("src",
			 "/" + PageMenu[CurrentCategory][0] + "/" + PageMenu[CurrentCategory][CurrentPage]);
	}
}

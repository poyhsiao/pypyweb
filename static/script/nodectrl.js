var ipv4_addr_demo = "xxx.xxx.xxx.xxx";
var ipv4_range_demo = "xxx.xxx.xxx.xxx-yyy.yyy.yyy.yyy";
var ipv4_subnet_demo = "xxx.xxx.xxx.xxx/yyy.yyy.yyy.yyy";
var ipv4_addr_pattern = /^([1-9][0-9]{0,2})+\.([0-9]{0,3})+\.([0-9]{0,3})+\.([0-9]{0,3})+$/;
var ipv4_range_pattern = /^([1-9][0-9]{0,2})+\.([0-9]{0,3})+\.([0-9]{0,3})+\.([0-9]{0,3})-([1-9][0-9]{0,2})+\.([0-9]{0,3})+\.([0-9]{0,3})+\.([0-9]{0,3})+$/;
var ipv4_subnet_pattern = /^([1-9][0-9]{0,2})+\.([0-9]{0,3})+\.([0-9]{0,3})+\.([0-9]{0,3})\/([1-9][0-9]{0,2})+\.([0-9]{0,3})+\.([0-9]{0,3})+\.([0-9]{0,3})+$/;
var service_proto = "proto@";
var service_tcp = "tcp@";
var service_udp = "udp@";
var service_proto_pattern = /^proto@\d{1,5}/;
var service_tcp_pattern = /^tcp@\d{1,5}/;
var service_udp_pattern = /^udp@\d{1,5}/;

function ToggleEnable(node)
{
	if( node.hasClass('itemEnabled') )
	{
		node.removeClass('itemEnabled').addClass('itemDisabled');
	}
	else
	{
		node.removeClass('itemDisabled').addClass('itemEnabled');
	}
}

function InitSelection(oSel, vArray)
{
	var i;
	oSel.empty();
	for( i = 0; i < vArray.length ; i++ )
	{
		oSel.append('<option>' + vArray[i] + '</option>');
	}
}

function InitServiceSelection($sel, vArray)
{
	InitSelection($sel, vArray);
	
	for (var key in vKnownServices)
	{
		$sel.append('<option value="'+key+'">'+vKnownServices[key]+' ('+key+')</option>');
	}
}

function enable_sibling_input(org, value, select_bool)
{
	var node = org.closest('tr').find('td input');
	if (select_bool)
		node.removeAttr('disabled').val( value ).show().select().focus();
	else
		node.removeAttr('disabled').val( value ).show().focus();
}

function disable_sibling_input(org, value)
{
	org.closest('tr').find('td input').attr('disabled', true).val('').hide();
}

function add_input_node(node)
{
	var input_node = '<input type="text" class="tb_input" disabled>';
	node.closest('tr').find('td:last').html(input_node);
}

function gen_ipgroup_sel_node(ipgroup_list)
{
	var ipgroup_sel = "<select>";
	for (var i = 0; i < ipgroup_list.length; i++)
	{
		if (!ipgroup_list[i])
			ipgroup_list[i]['label'] = "";

		ipgroup_sel += "<option>" + vFwSourceList[7] + (i+1) +"(" + ipgroup_list[i]['label'] + ")</option>";
	}
	ipgroup_sel += "</select>";

	return ipgroup_sel;
}

function gen_srvgroup_sel_node(srvgroup_list)
{
	var srvgroup_sel = "<select>";
	for (var i = 0; i < srvgroup_list.length; i++)
	{
		if (!srvgroup_list[i])
			srvgroup_list[i]['label'] = "";

		srvgroup_sel += "<option>" + vServiceList[4] + (i+1) +"(" + srvgroup_list[i]['label'] + ")</option>";
	}
	srvgroup_sel += "</select>";

	return srvgroup_sel;
}


function gen_fqdn_sel_node(fqdn_list)
{
	var fqdn_sel = "<select>";
	for (var i = 0; i < fqdn_list.length; i++)
	{
		if(!fqdn_list[i])
			fqdn_list[i] = "";

		fqdn_sel += "<option>" + vFwSourceList[8] + (i+1) +"(" + fqdn_list[i] + ")</option>";
	}
	fqdn_sel += "</select>";

	return fqdn_sel;
}

function show_error(node)
{
	node.addClass('error_input');
	node.effect('pulsate', {times: 3}, 'slow');
	node.removeClass('error_input', 'slow');
	node.focus();
}

function check_ipaddr(node)
{
	if ( !node.val().match(ipv4_addr_pattern ) )
	{
		show_error(node);
		return false;
	}
	return true;
}

function check_addr(select, value)
{
	return ( (select.val() == vCheckAddrList[0] && value.match(ipv4_addr_pattern)) ||
		(select.val() == vCheckAddrList[1] && value.match(ipv4_range_pattern)) ||
		(select.val() == vCheckAddrList[2] && value.match(ipv4_subnet_pattern)) ||
		(select.val() == vCheckAddrList[3]) || (select.val() == vCheckAddrList[4]) )
}

function check_service(select, value)
{
	if ( select.val() == vCheckServiceList[3] )
		return true;

	var service_type = value.split("@")[0] + "@";
	var service_num = value.split("@")[1];
	if ( service_type == vCheckServiceList[0] ) 
		return (service_num > 0 && service_num < 65535);
	else if	( (service_type == vCheckServiceList[1])
			|| (service_type == vCheckServiceList[2]) )
	{
		if (service_num.match(/-/))
		{
			var start_num = service_num.split("-")[0];
			var end_num = service_num.split("-")[1];
			return (start_num > 0 && start_num < 65535 &&
				end_num > 0 && end_num < 65535 &&
				parseInt(start_num) < parseInt(end_num));
		}
		else
			return (service_num > 0 && service_num < 65535);
	}
}

function check_error(select, node, type)
{
	var value = node.val();
	if ( !node.attr('disabled') )
	{
		if ( (type == "addr" && (value == '' || !check_addr(select, value)))
			|| (type == "service" && (value == '' || !check_service(select, value))) )
		{
			show_error(node);
			return true;
		}
	}
	return false; // no error
}

function button_mousemove()
{
	$('button').mousemove(function(){
		$(this).addClass("button_mouseover");
	}).mouseout(function(){
		$(this).removeClass("button_mouseover");
	});
}

function sort_setting(checkNode, tbNode)
{
	if (checkNode.hasClass('itemDisabled'))
	{
		checkNode.removeClass('itemDisabled').addClass('itemEnabled');
		tbNode.sortable('enable');
	}
	else
	{
		checkNode.removeClass('itemEnabled').addClass('itemDisabled');
		tbNode.sortable('disable');
	}
}

function button_enable(window)
{
	window.parent.document.getElementById("oApply").disabled = false;
	window.parent.document.getElementById("oReload").disabled = false;
	window.parent.document.getElementById("oApply").style.color = "black";
	window.parent.document.getElementById("oReload").style.color = "black";
}

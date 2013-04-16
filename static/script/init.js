/**
 * Initial javascript
 * 
 * Auther: Kim Hsiao 
 */
 
$.getJSON('/data/menuitem.json', function(d) {
    console.log(d.items);
    $.each(d.items, function(k, v) {
        extraData(v, 'menu_root')
    });
    
	$('div.MenuItem').each(function(k, v) {
	   $(this).on('click', function() {
	       var child = $(this).children('span');
	       if(child.hasClass('ItemClose')) {
	           child.removeClass('ItemClose').addClass('ItemOpen');
	       } else {
	           child.addClass('ItemClose').removeClass('ItemOpen');	       
	         } 
	    });
	});
});

var extraData = function(d, cls) {
    var container = $('#menu-template');
    if(d.hasOwnProperty('subitems')) {
        cl = 'menu_' + d.title;
        var div = $('<div/>').addClass('MenuItem').appendTo(container.find('div.' + cls));
        $('<span/>').text(' ' + d.title + ' ').addClass('ItemClose').appendTo(div);
        $('<div/>').addClass(cl + ' MenuPage_div').appendTo(div);
        for(var x in d.subitems) {
            extraData(d.subitems[x], cl);
           }
     } else {
        var div = $('<div/>').text(d.title).attr('link', d.src).addClass('MenuEntry').appendTo(container.find('div.' + cl));
        $('<span/>').text(' ' + d.title + ' ').addClass('EntryName').appendTo(div);
       }
}

/* 
var extraData = function(d, cls) {
    var template = $('#menu-template'), cl = ('undefined' == typeof(cls)) ? 'ul_topmenu' : cls;
    if(d.hasOwnProperty('subitems')) {
        var li = $('<li/>').text(d.title).appendTo(template.find('ul.' + cl));
        cl = 'ul_' + d.title;
        $('<ul/>').addClass(cl).appendTo(li);
        for(var x in d.subitems) {
            extraData(d.subitems[x], cl);
           }
    } else {
        $('<li/>').text(d.title).wrapInner('<a href=' + d.src + ' />').appendTo(template.find('ul.' + cl));
     }
};
*/
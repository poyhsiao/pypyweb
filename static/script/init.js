/**
 * Initial javascript
 * 
 * Auther: Kim Hsiao 
 */
 
$.getJSON('/data/menuitem.json', function(d) {
    $.each(d.items, function(k, v) {
        //extraData(v, 'menu_root');
        extraData(v, 'ul_topmenu');
    });
    
	$('div.MainMenu').on('click', function() {
	    if($(this).hasClass('closeMenu')) {
	        $('div.MainMenu').each(function(k, v) {
	            if($(this).hasClass('openMenu')) {
	                $(this).removeClass('openMenu').addClass('closeMenu').siblings('ul.inactive').slideUp('slow');
	                /* check and close the other open menu items */
                    }
	           });
	        $(this).removeClass('closeMenu').addClass('openMenu').siblings('ul.inactive').slideDown('slow');
	        /* open selected closed menu item */
	        if('undefined' == typeof($('span.maintitle').attr('opt')) || $(this).attr('opt') == $('span.maintitle').attr('opt')) {
               $('div.borderArrow').show('slow');
           } else {
               $('div.borderArrow').hide();
	           }
           /* when switch to other menu item, hide arrow item */
          }
	});
	
	$('div.SubMenu').on('click', function() {
	    var me = $(this), main;
	    $('div.borderArrow').css({
	        top: function() {
	            return me.position().top + 'px';
	        },
	        left: function() {
	            return me.position().left + me.width() + 'px';
	        },
	        position: 'absolute',
	        "z-index": '1',
	    }).addClass('hidden-phone').show();
	    
	    $('div.selectItem').removeClass('selectItem').removeClass('itemHover').addClass('SubMenu');
	    me.addClass('selectItem');
	    /* change the style and add arrow */
	   main = me.parents('ul.inactive').siblings('.MainMenu');
	   $('span.maintitle').attr('opt', main.attr('opt')).text(main.text()).css('cursor', 'pointer').on('click', function() {
	       $('div[opt=' + main.attr('opt') + ']').trigger('click');
	   });
	   $('span.subtitle').attr('opt', me.attr('opt')).text(me.text()).css('cursor', 'pointer').on('click', function() {
           $('div[opt=' + main.attr('opt') + ']').trigger('click');
       });
       /* add pagenation and also add click to go back original page option */
	}).on('mouseenter mouseleave', function() {
	    if(!$(this).hasClass('selectItem')) {
	       $(this).toggleClass('itemHover').toggleClass('SubMenu');
	      }
	});
	
	(function() {
	    var main = $('div.MainMenu')[0];
	    $(main).trigger('click');
	    $(main).siblings().find('div:first').addClass('itemHover').trigger('click').removeClass('SubMenu');
	})();
	// initial open the first menu item
});
 
var extraData = function(d, cls) {
    var template = $('#menu-template'), cl = ('undefined' == typeof(cls)) ? 'ul_topmenu' : cls;
    if(d.hasOwnProperty('subitems')) {
        var li = $('<li/>').text(d.title).wrapInner('<div class="MainMenu closeMenu" opt="' + d.title + '" />').appendTo(template.find('ul.' + cl));
        cl = 'ul_' + d.title;
        $('<ul/>').addClass(cl + ' inactive').appendTo(li);
        for(var x in d.subitems) {
            extraData(d.subitems[x], cl);
           }
    } else {
        $('<li/>').text(d.title).wrapInner('<div class="SubMenu" opt="' + d.src + '" />').appendTo(template.find('ul.' + cl));
     }
};

$(window).on('resize', function() {
    var arrow = $('div.borderArrow'), actopt = $('span.subtitle').attr('opt'), itm = $('div[opt=' + actopt +']');
    if($(this).width() > 768 && !arrow.is(':hidden')) {
        /* this only work on Desktop environment and the arrow is shown */
       console.log(itm.position());
       arrow.css({
           top: function() {
               var o = itm.position().top + 'px';
               console.log(o);
           },
           left: function() {
               var q = itm.position().left + itm.width() + 'px';
               console.log(q);
           }
       });
    }
});

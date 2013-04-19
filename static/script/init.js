/**
 * Initial javascript
 * 
 * Auther: Kim Hsiao 
 */
$.when(
    $.getScript('/script/jquery-ui.js'),
    //$.getScript('/script/bootstrap.js'),
    $.getScript('/script/underscore.js'),
    $.getScript('/script/backbone.js'),
    /* load all necessary javascript once */
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
    	    changeResolution.changeArrow(me).addClass('hidden-phone').fadeIn();
    	    changeResolution.changePopC(me).fadeIn('slow');
    	    
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

    })).done(function() {
        var main = $('div.MainMenu')[0];
        $(main).trigger('click');
        $(main).siblings().find('div:first').addClass('itemHover').trigger('click').removeClass('SubMenu');
        // initial open the first menu item
});
 
var extraData = function(d, cls) {
    /* handling main menu as tree structure */
    var template = $('#menu-template'), cl = ('undefined' == typeof(cls)) ? 'ul_topmenu' : cls;
    if(d.hasOwnProperty('subitems')) {
        var li = $('<li/>').addClass('boxShadow').text(d.title).wrapInner('<div class="MainMenu closeMenu" opt="' + d.title + '" />').appendTo(template.find('ul.' + cl));
        cl = 'ul_' + d.title;
        $('<ul/>').addClass(cl + ' inactive').appendTo(li);
        for(var x in d.subitems) {
            extraData(d.subitems[x], cl);
           }
    } else {
        $('<li/>').addClass('boxShadow').text(d.title).wrapInner('<div class="SubMenu" opt="' + d.src + '" />').appendTo(template.find('ul.' + cl));
     }
};

var changeResolution = {
    /* define relative DOM position for initial or change resolution */
    pop: $('div.popContent'),
    arrow: $('div.borderArrow'),
    changePopC: function(op) {
        /* for the height of popContent adjustment */
       this.pop.css({
           height: function() {
               var border = 20;
               /* this is work for define all the border width */
               return $(window).height() - $('div.head').outerHeight() - $('div.info').outerHeight() - $('div.footer').outerHeight() - border + 'px';
           }
       });
       (ckWindow.notDesktop()) ? this.pop.css('margin', '0px') : this.pop.css('margin', '0 0 0 -60px');
       /* if the device is not the desktop, then remove margin */
       return (op) ? this.pop : true;
    },
    
    changeArrow: function(op) {
        /* change the position of the arrow image, if op is given as the jquery obj, the position will be located based on given op */
        var actopt = $('span.subtitle').attr('opt'),
        itm = op || $('div[opt=' + actopt +']'),
        offset = ('wild' == ckWindow.text()) ? 50 : 60;
        /* the bias of the dialog, only wild will be 50, the other's are 60 */
        this.arrow.css({
               top: function() {
                   return itm.position().top + 'px';
               },
               left: function() {
                   return itm.position().left + itm.width() - offset + 'px';
                   /* this work for wild screen */
               }
           });
       return op ? this.arrow : true;
    }
};

var ckWindow = {
    /* check if the device resolution */
    text: function() {
        if($(window).width() >= 1200) {
            /* it's wild or large display*/
           return 'wild';
        } else if($(window).width() <= 980 && $(window).width() >= 768) {
            /* it's display between desktop and tablet */
           return 'big';
        } else if($(window).width() < 768 && $(window).width() > 480) {
            /* it's tablet */
            return 'tablet';
        } else if($(window).width() <= 480) {
            /* it's mobile phone */
           return 'phone';
        } else {
            /* it's default and normal display */
           return 'normal';
        }
    },
    
    isDesktop: function() {
        return $(window).width() >= 980;
    },
    isTablet: function() {
        return ($(window).width() > 480 && $(window).width() < 980);
    },
    isPhone: function() {
        return ($(window).width() <= 480);
    },
    notDesktop: function() {
        return ($(window).width() < 768);
    },
    notTablet: function() {
        return (($(window).width() < 768 && $(window).width() > 480) || ($(window).width() > 980));
    },
    notPhone: function() {
        return ($(window).width() > 480);
    }
};

$(window).on('resize', function() {
    /* window resize handler */
    if(!ckWindow.notDesktop() && !$('div.borderArrow').is(':hidden')) {
        /* this only work on Desktop environment and the arrow is shown */
       changeResolution.changeArrow();
     }
     
    if(ckWindow.isPhone()) {
        $('div.popContent').css('height', '400px');
        /* in mobile device, set the height to fixed 400px */
    } else {
        /* if the device is not mobile phone*/
       changeResolution.changePopC();
    }
});

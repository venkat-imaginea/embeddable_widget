/////// Google Analytics event tracking ///////
//targeted selector to avoid script running on links that aren't being tracked
if ((typeof(jQuery) == 'function') && (typeof(ga) !== 'undefined')) {
	_satellite.notify('GA Verifiy onload',2);
	jQuery(document).on('click', '#header_links a, .footer_links a, #portfolio a, #margin a, #index_list a, #rotating_panel a, #breadcrumbs a, #gfr_contact_info .phoneNum a, .gfr_content .phoneNum a', function()
	{
		_satellite.notify('GA Verifiy on click',2);

		//GA available
		if ( (typeof(ga) !== 'undefined') && (ga.hasOwnProperty('loaded') && ga.loaded === true) && gaLinkCheck(this) && ga_size_check(this)) {
      
			var timeout;
			var ga_category = getGaParent(this);
			var ga_label = getGaLink(this);

			_satellite.notify('ga_category='+ga_category,2);
			_satellite.notify('ga_label='+ga_label,2);

			//set callback to go to link's target
			//_gaq.push(['_set', 'hitCallback', function(){ window.clearTimeout(timeout); window.location.href = ga_label; }]);
			ga("5c247b9625969314870c7e0f4960f5ae.send", {hitType: "event", eventCategory: ga_category, eventAction: "click", eventLabel: ga_label, 'hitCallback' : function(){ window.clearTimeout(timeout); window.location.href = ga_label;} })

			//push eventtrack
			//_gaq.push(['_trackEvent', ga_category, 'click', ga_label]);

			timeout = setTimeout(function(){ window.location.href = ga_label; }, 350)

			_satellite.notify('GA event track-end',2);
		
			return false;
		}
	});
}

function getGaParent(link)
{
	//finds parent element for link clicked -- returns label for GA event tracking, takes "this" keyword for clicked link
	//.is() works for #id and .class
	var locations = ['#header_links', '#main_menu', '.footer_links', '#portfolio', '#margin', '#index_list', '#rotating_panel', '#breadcrumbs', '#gfr_contact_info', '.gfr_content'];
	var labels = ['header_links', 'main_menu', 'footer', 'portfolio_links', 'margin', 'index_item', 'rotating_panel', 'breadcrumbs', 'gfr_detail', 'gfr_list'];

	var i = 0;
	var found = false;
	while(i < locations.length)
	{
		if(jQuery(link).parents().is(locations[i])) { 
			return labels[i];
		}
		i++;
	}
}

function getGaLink(link)
{
	//determines whether to return the file path or the full href for clicked link
	if(link.pathname == '/' || link.protocol == 'tel:')
	{
		return link.href;
	}
	else
	{
		//check for leading slash in pathname and add if necessary (IE, etc)
		var path = link.pathname.substring(0,1) == '/' ? link.pathname : '/' + link.pathname;

		//append pound string if present
		if(link.href.indexOf('#') != -1)
		{
			var hash = link.hash.substring(1);
			if(hash.indexOf('?') != -1)
			{
				var hashString = hash.split('?');
				hash = hashString[0];
			}
			path = path + '#' + hash;
		}
		//
		//append query string if present
		if(link.href.indexOf('?') != -1)
		{
			var queryString = link.href.split('?');
			path = path + '?' + queryString[1];
		}

		return path;

	}
}


function gaLinkCheck(link)
{
	//checks to see if link is local or external, returns true for internal
	if(link.hostname == window.location.hostname || link.protocol == 'tel:')
	{
		//return false if link's href is #
		if(jQuery(link).attr('href') == '#') {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}

}

function ga_size_check(link)
{
	//check to see if this is part of the hamburger menu on small/medium sizes -- don't apply GA tracking if link has .parent class
	if(jQuery('#shield_small').is(':visible') && jQuery(link).parent().hasClass('parent')) {
		return false;
	} else {
		return true;
	}
}

//GUA MORE slider tracking
if ((typeof(jQuery) == 'function') && (typeof(ga) !== 'undefined')) {
	jQuery(document).ready(function () {
		//Click tracking
		var slider_num = 0;
		var slide_num = 0;
		var slider_id_old = '';
		_satellite.notify('GUA MORE onload',1);

		if ((ga.hasOwnProperty('loaded') && ga.loaded === true)){
			_satellite.notify('GUA MORE gua loaded',1);

			//sliders
			jQuery('.smart-slider-canvas').each(function(index, value) {
				var slider_id = jQuery(this).parents("div[id^='nextend-smart-slider-']").attr('id');
				if (slider_id != slider_id_old) {
					slider_num++;
					slide_num = 1;
					slider_id_old = slider_id;
				}
				var onclickorig = jQuery(this).attr('onclick');
				var re = /'([^']*)'/i;
				var onclicklinkarray = onclickorig.match(re);
				var onclicklink = onclicklinkarray[1];
				//jQuery(this).attr('onclick', "var timeout; _gaq.push(['_set', 'hitCallback', function(){ window.clearTimeout(timeout); " + onclickorig + "; }]); _gaq.push(['_trackEvent', 'more-slider" + slider_num + "', 'click', 'Position: " + slide_num + " " + onclicklink + "']); timeout = setTimeout(function(){ " + onclickorig + "; }, 350); return false;");
				var gua_more_event_label = 'Position: ' + slide_num + ' ' + onclicklink;
				var gua_more_category = 'more-slider' + slider_num;

				jQuery(this).attr('onclick', "ga('5c247b9625969314870c7e0f4960f5ae.send', {hitType: 'event', eventCategory: '"+gua_more_category+"', eventAction: 'click', eventLabel: '"+gua_more_event_label+"', 'hitCallback' : function(){window.clearTimeout(setTimeout(window.location.href='"+onclicklink+"', 350)); window.location.href = '"+onclicklink+"';} })" );
				slide_num++;
			});

		}
		_satellite.notify('GUA MORE end',1);
	});
}
//GUA MORE slider tracking

/////// end Google Analytics event tracking ///////


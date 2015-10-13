$(document).ready(function(){

	//////////////////////////////////////
	// GFR market listing randomization //
	//////////////////////////////////////

	var $div_array = [];
	var $div_length = $('.gfr_agent').length;

	for (var i = 0; i <= $div_length; i++) {
		
		$div_array[i] = $('.gfr_agent')[i];
	}

	$('.gfr_agent').remove();
	
	$div_array.sort(function() {
		return 0.5 - Math.random()
	});

	for (var i = 0; i <= $div_length; i++) {
		$( '#gfr_gecko' ).after( $div_array[i] );
	}


	/////////////////////////////////////////
	// hide & show select dropdown content //
	/////////////////////////////////////////

    //reset all select dropdowns on page load
    $('select.show-hide').find('option:first').attr('selected', 'selected');

    //show corresponding content on select change
    $('select.show-hide').change(function(){
    	//class selector for containers of content associated with the <select>
    	var content_selector = ".select-content";

    	//class to show/hide visibility of content associated with the <select>
    	var show = "show";

    	//create array of <select> values, this will be used to evaluate which content to hide on the next <select> change
    	var select_values = [];
    	$(this).find('option').each(function() {
            select_values.push($(this).val());
        });

    	//get number of nested levels by looking for any parents with the content_selector class
    	var levels = $(this).parents(content_selector).length + 1;

    	//repeat class selector in content_selector if there are nested dropdowns 
    	//(ex. 2 levels deep: .select-content .select-content)
		if(levels > 1){
		    content_selector += Array(levels).join(' '+content_selector);
		}

    	//look for any content at the current level that is visible (has .show class)
    	$(content_selector+'.'+show).each(function(){
    		var content_selector_id = $(this).attr('id');

    		//if the ID of the visible content is in the original array of <select> values, hide the associated content
    		if($.inArray(content_selector_id, select_values) !== -1)
    		{
    			$('#'+content_selector_id).removeClass(show).hide();
    		}
    	});

    	//show the selected content
    	$('#'+$(this).val()).addClass(show).fadeIn();
    });

});
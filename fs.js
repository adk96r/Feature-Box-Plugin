/*
	Authored by : Adk96r
	Licensed under: Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
	
	You are free to:
		Share — copy and redistribute the material in any medium or format
		Adapt — remix, transform, and build upon the material

	The licensor cannot revoke these freedoms as long as you follow the license terms.
	Complete License : https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode

	Thankyou.
*/




settings = null;
var featureBox;

function initFeatureBox(featureSettings){

	settings = featureSettings
	if(settings.gap == undefined) settings.gap = 1;
	if(settings.time == undefined) settings.time = 1;
	if(settings.classes == undefined) settings.classes = [];
	if(settings.opq == undefined) settings.opq = false;
	if(settings.opqt == undefined) settings.opqt = 0.5;
	settings.gap *= 1000;
	settings.ftop = null;
	settings.fbot = null;
	settings.maxHeight = 0;
	settings.maxWidth = 0;
	settings.flen = 0;
	settings.list = []	

	/*
	 * Create the list of features.
	 * Consecutive pairs will be taken 
	 * out of this settings.list.
	 */

	
	featureBox = $('#' + settings.fbid);
	if(featureBox.length == 0) return;

	settings.list = featureBox.children();
	settings.flen = settings.list.length;

	/*
	 * Compute and store the max height for uniform box sizing.
	 * Remove the feature from the box, as they are 
	 * already stored in var settings.list. Only 2 elements are needed
	 * at a time for this animation.
	 */
	$(featureBox).children().each(function(){
		settings.maxHeight = Math.max(settings.maxHeight, $(this).height());		
		settings.maxWidth = Math.max(settings.maxWidth, $(this).width());
		$(this).remove();
	});

	/*
	 * Set the Feature Box's dimensions
	 * and the two elements inside it
	 * ( one below the other ) such that
	 * only the top one's visible
	 */


	featureBox.css({'width': settings.maxWidth,
					'height': settings.maxHeight,
					'display': 'inline-block',
					'position': 'relative',
					'overflow': 'hidden'});
	 
	settings.ftop = getFeature(true, settings.list[0].innerText);
	settings.fbot = getFeature(false, settings.list[1].innerText);
	
	$(featureBox).append(settings.ftop);
	$(featureBox).append(settings.fbot);

	startAnim();
}

function startAnim(){

	var i = 1;

	setInterval(function(){

		// Push the top up and bring the bottom to the
		// location of top.
		$(settings.ftop).css({'top': -settings.maxHeight});
		if(settings.opq){
			$(settings.ftop).css({'opacity': 0});
		} 

		$(settings.fbot).css({'top': 0});

		if(settings.opq){
			$(settings.fbot).css({'opacity': 1});
		} 

		// Animtion would continue for the GAP time
		setTimeout(function(){
			// Remove the top which has been pushed up.
			$($(featureBox).children()[0]).remove();

			// Make top the current item ( i.e bottom which replaced the old top)
			settings.ftop = $(featureBox).children()[0];

			// Create a new bottom feature element for replacing the current top.
			settings.fbot = getFeature(false, settings.list[(++i)%settings.flen].innerText);
			
			if(settings.opq){
				$(settings.fbot).css({'opacity': 0});
			}

			$(featureBox).append(settings.fbot);

		},700);

	}, settings.gap);

}

function getFeature(top, featureText){

	/*
	 * Returns an html element of the form
	 * 		<div class = "feature [every_style in classes_arg]"
	 *			style = "top: 0 (or) settings.maxHeight"> featureText </div>
	 *
	 * Basically creates the next feature.
	 */

	var t = document.createElement('div');
	t.innerText = featureText;
	$(t).addClass('feature');
	$(t).css({'opacity': 1,
		'transition': 'top ' + settings.time + 's, ' + 'opacity ' + settings.opqt + 's'});

	settings.classes.forEach(function(custom_class){$(t).addClass(custom_class)});
	$(t).css({'position': 'absolute'});


	if(top){
		$(t).css({'top': 0});
	}else{
		$(t).css({'top': settings.maxHeight});
	}
	return t;
}
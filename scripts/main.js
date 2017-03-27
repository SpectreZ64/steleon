//--------------------------------------------------------------------------------------------
//Проверка на мобильный вид
function isMobile(){
	if ($(window).width() < 536)
		return true
	else
		return false;
}
//--------------------------------------------------------------------------------------------
//Объект игры
var steleon = {
	mode: 0,
	screens: {},
	players: [],
	unitCards: [],
	curScreen: null,
	init: function(){
		steleon.screens.modeSelector = jQuery('#mode_selector');
		steleon.screens.playerCreator = jQuery('#player_creator');
		steleon.screens.armyEditor = jQuery('#army_editor');
		steleon.openScreen(steleon.screens.modeSelector);
		jQuery('.mode_btn').click(function(){
			if (jQuery(this).hasClass('disabled')) return;
			steleon.setMode(jQuery(this).attr('data-mode'));
		});
		jQuery('#setPlayer').click(function(){
			if (jQuery(this).hasClass('disabled')) return;
			steleon.setPlayer();
		});
		steleon.loadUnitCards();
	},
	loadUnitCards: function(){
		jQuery('.unit_card').each(function(i, elem){
			card = jQuery.parseJSON(jQuery(elem).attr('data-params'));
			steleon.unitCards.push(card);
			jQuery(elem).css('background-image', 'url("images/units/' + card.picture + '.png")');
			console.log('url:("images/units/' + card.picture + '.png")');
		});
	},
	openScreen: function(screen){
		if (!(steleon.curScreen == null)) steleon.curScreen.addClass('closed');
		steleon.curScreen = screen;
		steleon.curScreen.removeClass('closed');
	},
	createBone: function(){
		var a = Math.round(Math.random() * 5 + 1);
		var bone = jQuery(document.createElement('div'));
		bone.addClass('bone bone' + a);
		bone.appendTo('#bones_place');
		return a;
	},
	setPlayer: function(){
		var player = {
			name: jQuery('#player_name').val()
		};
		steleon.players.push(player);
		steleon.openScreen(steleon.screens.armyEditor);
	},
	removeBones: function(){
		jQuery('.bone').remove();
	},
	setMode: function(val){
		mode = val;
		steleon.openScreen(steleon.screens.playerCreator);
	}
};

jQuery(document).ready(function(){
	steleon.init();
});
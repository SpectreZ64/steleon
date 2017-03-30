jQ = jQuery;
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
	curPlayer: 0,
	unitCards: [],
	curScreen: null,
	//Инициализация
	init: function(){
		var s = steleon;
		//Экраны
		s.screens.modeSelector = jQ('#mode_selector');
		s.screens.playerCreator = jQ('#player_creator');
		s.screens.armyEditor = jQ('#army_editor');
		s.screens.gameStarter = jQ('#game_starter');
		s.screens.playersOrder = jQ('#players_order');
		s.screens.phaseMagic = jQ('#phase_magic');
		//--------------
		s.openScreen(s.screens.modeSelector);
		//События кнопок
		jQ('.mode_btn').click(function(){//Режим игры
			if (jQ(this).hasClass('disabled')) return;
			s.setMode(jQ(this).attr('data-mode'));
		});
		jQ('#set_player').click(function(){//Создание игрока
			if (jQ(this).hasClass('disabled')) return;
			s.setPlayer();
		});
		jQ('#start_game').click(function(){//Начало игры
			if (jQ(this).hasClass('disabled')) return;
			s.setPlayersOrder();
		});
		//--------------
		//РЕДАКТОР АРМИИ
		//Нажатие на боевых единиц общего списка
		jQ('.common_unit').click(function(){
			var sourceNum = jQ(this).attr('data-num');//Индекс в общем списке боевых единиц
			var unit = s.unitCards[sourceNum];
			s.players[s.curPlayer].army.push(unit);
			var num = s.players[s.curPlayer].army.length - 1;
			jQ('#player_army').append('<div class="unit_card player_unit" data-source="' + sourceNum + '" data-num="' + num + '"></div>');
			jQ('.player_unit').last().css('background-image', 'url("images/units/' + unit.picture + '.png")');
			jQ(this).hide();
			//Нажатие на боевых единиц армии игрока
			jQ('.player_unit').click(function(){
				var num = jQ(this).attr('data-source');
				s.players[s.curPlayer].army.splice(num, 1);
				jQ('#common_army').find('[data-num="' + num + '"]').show();
				jQ(this).remove();
				s.hideTooltip();
			});
			s.bindUnitsTooltip('player');
		});
		s.bindUnitsTooltip('common');
		jQ('#set_army').click(function(){
			if (jQ(this).hasClass('disabled')) return;
			s.openScreen(s.screens.gameStarter);
			jQ('#player_army').html('');
		});
		//--------------
		jQ('#add_player').click(function(){//Переход к добавлению игрока
			s.openScreen(s.screens.playerCreator);
		});
		//--------------
		s.loadUnitCards();
	},
	//Назначить события всплывающей подсказки
	bindUnitsTooltip: function(target){//Назначить всплывающие подсказки
		jQ('.unit_card').mouseover(function(){
			var s = steleon;
			var num = 0;
			if (target == 'player') num = jQ(this).attr('data-source')
			else num = jQ(this).attr('data-num');
			var text = '<div class="tooltip"><p>'+ s.unitCards[num].name +'</p><p><span>Артефакт:</span><span>'+ s.unitCards[num].artefact +'</span></p><p><span>Рукопашный бой:</span><span>'+ s.unitCards[num].power +'</span></p><p><span>Маневр:</span><span>'+ s.unitCards[num].speed +'</span></p><p><span>Стрельба:</span><span>'+ s.unitCards[num].accuracy +'</span></p><p><span>Броня:</span><span>'+ s.unitCards[num].armor +'</span></p><p><span>Допуск:</span><span>'+ s.unitCards[num].admission +'</span></p><p><span>Стоимость:</span><span>'+ s.unitCards[num].price +'</span></p></div>';
			s.showTooltip(text);
		});
		jQ('.unit_card').mouseleave(function(){
			steleon.hideTooltip();
		});
	},
	showTooltip: function(text){
		jQ('#tooltip').html(text);
		jQ('#tooltip').show();
	},
	hideTooltip: function(){
		jQ('#tooltip').html('');
		jQ('#tooltip').hide();
	},
	//Построить разметку списка боевых единиц игрока
	makeUnitsList: function(playerNum, target){
		var i = 0;
		for (var unit in steleon.players[playerNum].army){
			jQ(target).append('<div class="unit_card" data-num="' + i + '"></div>');
			jQ(target + ' .unit_card').last().css('background-image', 'url("images/units/' + unit.picture + '.png")');
			i++;
		};
	},
	//Загрузить карты боевых единиц в массив
	loadUnitCards: function(){
		jQ('.unit_card').each(function(i, elem){
			card = jQ.parseJSON(jQ(elem).attr('data-params'));
			steleon.unitCards.push(card);
			jQ(elem).css('background-image', 'url("images/units/' + card.picture + '.png")');
		});
	},
	//Открыть экран
	openScreen: function(screen){
		if (!(steleon.curScreen == null)) steleon.curScreen.addClass('closed');
		steleon.curScreen = screen;
		steleon.curScreen.removeClass('closed');
	},
	//Бросить игровую кость
	createBone: function(){
		var a = Math.round(Math.random() * 5 + 1);
		var bone = jQ(document.createElement('div'));
		bone.addClass('bone bone' + a);
		bone.appendTo('#bones_place');
		return a;
	},
	//Записать информацию об игроке
	setPlayer: function(){
		var player = {
			name: jQ('#player_name').val(),
			army: []
		};
		steleon.players.push(player);
		steleon.curPlayer = steleon.players.length - 1;
		steleon.openScreen(steleon.screens.armyEditor);
		jQ('#player_name').val('');
	},
	//Определить последовательность ходов игроков
	setPlayersOrder: function(){
		steleon.players.shuffle();
		jQ('#players_order .info_text').appendTo('<p></p>')
		steleon.openScreen(steleon.screens.playersOrder);
	},
	startGame: function(){
		steleon.openScreen(steleon.screens.phaseMagic);
	},
	//Убрать кости
	removeBones: function(){
		jQ('.bone').remove();
	},
	//Установить режим игры
	setMode: function(val){
		mode = val;
		steleon.openScreen(steleon.screens.playerCreator);
	}
};
//Перемешивание элементов массива
Array.prototype.shuffle = function() {
	return this.sort(function() {
		return 0.5 - Math.random();
	});
};
//Загрузка страницы
jQ(document).ready(function(){
	steleon.init();
	console.log(steleon);
});
jQ = jQuery;
magicAnswers6 = ['Прорыв в магических исследованиях!', 'Ваши маги добились больших успехов!', 'Магия окажет вам помощь дважды!'];
magicAnswers4 = ['Маги вашей армии преуспели!', 'Магия благосклонна к вам.', 'Ваши маги заслуживают награды за свои труды.', 'Магические силы внимают вашей воле.'];
magicAnswers1 = ['Ваши маги ничего не добились.', 'Магия противится вашим магам.', 'Возможно, в битве вам повезет больше.', 'Магия не подчинилась вам.', 'Маги вашей армии бессильны.'];
//--------------------------------------------------------------------------------------------
//Проверка на мобильный вид
function isMobile(){
	if ($(window).width() < 536)
		return true
	else
		return false;
}
//--------------------------------------------------------------------------------------------
//ЛОГИКА
var steleon = {
	mode: 0,
	players: [],
	curPlayer: 0,
	unitCards: [],
	magicCards: [],
	magicCardsTrash: [],
	//Инициализация
	init: function(){
		var s = steleon;
		view.init();
		view.openScreen(view.screens.modeSelector);
		//--------------
		s.loadUnitCards();
		s.loadMagicCards();
		view.bindUnitsTooltip('.common_unit', s.unitCards);
	},
	//Смена игрока
	changePlayer: function(firstTurn){
		var s = steleon;
		if (firstTurn == true){
			s.curPlayer = 0;
		}
		else{
			s.resetMods(s.curPlayer);//Сброс модификаторов
			s.curPlayer = s.curPlayer + 1;
			if (s.curPlayer = s.players.length) s.curPlayer = 0;
		};
		view.showPlayerParams();
		s.stageMagic();
	},
	//Загрузить карты боевых единиц в массив
	loadUnitCards: function(){
		jQ('.unit_card').each(function(i, elem){
			card = jQ.parseJSON(jQ(elem).attr('data-params'));
			steleon.unitCards.push(card);
			jQ(elem).css('background-image', 'url("images/units/' + card.picture + '.png")');
		});
	},
	//Загрузить карты магии в массив
	loadMagicCards: function(){
		jQ('#magic_cards_data .magic_card_data').each(function(i, elem){
			card = jQ.parseJSON(jQ(elem).attr('data-params'));
			steleon.magicCards.push(card);
		});
		shuffle(steleon.magicCards);
	},
	//Бросить игровую кость
	createBone: function(target){
		var a = Math.round(Math.random() * 5 + 1);
		var bone = jQ(document.createElement('div'));
		bone.addClass('bone bone' + a);
		bone.appendTo(target + ' .bones_wrapper');
		return a;
	},
	//Записать информацию об игроке
	addPlayer: function(){
		var player = {
			name: jQ('#player_name').val(),
			magicCards: [],
			army: []
		};
		steleon.players.push(player);
		steleon.curPlayer = steleon.players.length - 1;
		steleon.getMagicCard(steleon.curPlayer);
		view.openScreen(view.screens.armyEditor);
		jQ('#player_name').val('');
	},
	//Установка модификаторов боевых единиц
	setUnitsMods: function(player, mods){
		steleon.players[player].army.forEach(function(unit, i){
			unit.mods = mods;
		});
	},
	//Установка модификаторов игрока
	setPlayerMods: function(player, mods){
		steleon.players[player].mods = mods;
	},
	resetMods: function(player){
		var playerMods = {
			magicLuck: 0,
			phases: {
				all: 1,
				magic: 1,
				move: 1,
				fight: 1,
				shoot: 1
			}
		};
		steleon.setPlayerMods(steleon.curPlayer, playerMods);//сброс модификаторов игрока
		var unitsMods = {
			inc: {
				move: 0,
				fight: 0,
				armor: 0,
				shoot: 0
			},
			coef: {
				move: 1,
				fight: 1,
				armor: 1,
				shoot: 1
			},
			rep: {
				move: null,
				fight: null,
				armor: null,
				shoot: null
			},
			coefBonus: {
				move: 1,
				fight: 1,
				armor: 1,
				shoot: 1
			}
		};
		steleon.setUnitsMods(steleon.curPlayer, unitsMods);//сброс модификаторов боевых единиц
	},
	//Определить последовательность ходов игроков
	setPlayersOrder: function(){
		shuffle(steleon.players);
		view.showPlayersOrder();
		view.openScreen(view.screens.playersOrder);
	},
	//Выдать магическую карту
	getMagicCard(player){
		if (steleon.magicCards.length == 0){
			if (steleon.magicCardsTrash.length == 0){
				view.showMessage('Магические карты закончились!');
				return false;
			};
			console.log('!!');
			steleon.magicCards.concat(steleon.magicCardsTrash);//Возврат используемых карт магии
			steleon.magicCardsTrash = [];
			shuffle(steleon.magicCrads);
		};
		steleon.players[player].magicCards.push(steleon.magicCards[0]);
		steleon.magicCards.splice(0, 1);
		return true;
	},
	//Начать фазу магии
	stageMagic: function(){
		view.openScreen(view.screens.phaseMagic);
	},
	//Установить режим игры
	setMode: function(val){
		mode = val;
		view.openScreen(view.screens.playerCreator);
	},
	//ФАЗЫ ИГРЫ
	//Получение карты магии
	phaseMagic_GetCard: function(){
		view.removeBones();
		var bone = steleon.createBone('#phase_magic_get');
		if (bone == 6){
			steleon.getMagicCard(s.curPlayer);
			steleon.getMagicCard(s.curPlayer);
			view.makeMagicList(s.curPlayer, '.magic_cards_stack');
			view.showInfo(view.getRandomPhrase(magicAnswers6) + '<br>Вы получили сразу две карты магии!', '#phase_magic_get .info_text')
		}
		else if(bone > 3){
			steleon.getMagicCard(s.curPlayer);
			view.makeMagicList(s.curPlayer, '.magic_cards_stack');
			view.showInfo(view.getRandomPhrase(magicAnswers4) + '<br>Вы получили карту магии!', '#phase_magic_get .info_text')
		}
		else{
			view.showInfo(view.getRandomPhrase(magicAnswers1) + '<br>Вы не получили карту магии.', '#phase_magic_get .info_text')
		};
	},
	//Применение карты магии
	phaseMagic_SpellMagic: function(){
		
	}
};
//------------------------------------------------------------------------------------------------
//ПРЕДСТАВЛЕНИЕ
var view = {
	screens: {},
	curScreen: null,
	init: function(){
		v = view;
		s = steleon;
		//Экраны
		v.screens.modeSelector = jQ('#mode_selector');
		v.screens.playerCreator = jQ('#player_creator');
		v.screens.armyEditor = jQ('#army_editor');
		v.screens.gameStarter = jQ('#game_starter');
		v.screens.playersOrder = jQ('#players_order');
		v.screens.phaseMagic = jQ('#phase_magic');
		v.screens.getMagicCard = jQ('#phase_magic_get');
		//События кнопок
		jQ('.mode_btn').click(function(){//Режим игры
			if (jQ(this).hasClass('disabled')) return;
			s.setMode(jQ(this).attr('data-mode'));
		});
		jQ('#set_player').click(function(){//Создание игрока
			if (jQ(this).hasClass('disabled')) return;
			s.addPlayer();
		});
		jQ('#start_game').click(function(){//Начало игры
			if (jQ(this).hasClass('disabled')) return;
			s.setPlayersOrder();
		});
		jQ('#first_turn').click(function(){//Начало игры
			if (jQ(this).hasClass('disabled')) return;
			s.changePlayer(true);
		});
		jQ('#set_army').click(function(){//Назначение армии игрока
			if (jQ(this).hasClass('disabled')) return;
			s.resetMods(s.curPlayer);//Сброс модификаторов
			v.openScreen(v.screens.gameStarter);
			jQ('#player_army').html('');
		});
		jQ('#add_player').click(function(){//Переход к добавлению игрока
			v.openScreen(v.screens.playerCreator);
		});
		jQ('#get_magic_card').click(function(){
			v.openScreen(v.screens.getMagicCard);
			s.phaseMagic_GetCard();
		});
		jQ('.next_phase').click(function(){
			s.phaseMagic_GetCard();
		});
		//--------------
		//РЕДАКТОР АРМИИ
		//Нажатие на боевых единиц общего списка
		jQ('.common_unit').click(function(){
			var sourceNum = jQ(this).attr('data-num');//Индекс в общем списке боевых единиц
			var unit = s.unitCards[sourceNum];
			s.players[s.curPlayer].army.push(unit);
			var num = s.players[s.curPlayer].army.length - 1;
			jQ('#player_army').append('<div class="unit_card player_unit" data-num="' + num + '" data-source="' + sourceNum + '"></div>');
			jQ('.player_unit').last().css('background-image', 'url("images/units/' + unit.picture + '.png")');
			jQ(this).hide();
			//Нажатие на боевых единиц армии игрока
			jQ('.player_unit').click(function(){
				var num = jQ(this).attr('data-num');
				s.players[s.curPlayer].army.splice(num, 1);
				num = jQ(this).attr('data-source');
				jQ('#common_army').find('[data-num="' + num + '"]').show();
				jQ(this).remove();
				v.hideTooltip();
			});
			v.bindUnitsTooltip('.player_unit', s.players[s.curPlayer].army);
		});
	},
	//Открыть экран
	openScreen: function(screen){
		if (!(view.curScreen == null)) view.curScreen.addClass('closed');
		view.curScreen = screen;
		view.curScreen.removeClass('closed');
	},
	//Отобразить последовательность ходов игроков
	showPlayersOrder: function(){
		for (var i in steleon.players){
			jQ('<p class="player_name">' + (Number(i)+1) + ':  ' + steleon.players[i].name + '</p>').appendTo('#players_order .info_text');
		};
		jQ('<span> ' + steleon.players[0].name + '</span>').appendTo('#first_turn');
	},
	showPlayerParams: function(){
		jQ('.current_player_name').text(steleon.players[s.curPlayer].name);
		view.makeUnitsList(steleon.curPlayer, '.units_list');
		view.makeMagicList(steleon.curPlayer, '.magic_cards_stack')
	},
	//Построить разметку списка боевых единиц игрока
	makeUnitsList: function(playerNum, target){
		jQ(target).html('');
		steleon.players[playerNum].army.forEach(function(unit, i){
			jQ(target).append('<div class="unit_card" data-num="' + i + '"></div>');
			jQ(target + ' .unit_card').last().css('background-image', 'url("images/units/' + unit.picture + '.png")');
		});
		view.bindUnitsTooltip(target + ' .unit_card', steleon.players[playerNum].army);
	},
	//Построить разметку списка карт магии игрока
	makeMagicList: function(playerNum, target){
		jQ(target).html('');
		steleon.players[playerNum].magicCards.forEach(function(card, i){
			jQ(target).append('<div class="magic_card" data-num="' + i + '"></div>');
		});
	},
	//Назначить события всплывающей подсказки
	bindUnitsTooltip: function(target, source){//Назначить всплывающие подсказки
		jQ(target).mouseover(function(){
			num = jQ(this).attr('data-num');
			var text = '<div class="tooltip"><p>'+ source[num].name +'</p><p><span>Артефакт:</span><span>'+ source[num].artefact +'</span></p><p><span>Рукопашный бой:</span><span>'+ source[num].power +'</span></p><p><span>Маневр:</span><span>'+ source[num].speed +'</span></p><p><span>Стрельба:</span><span>'+ source[num].accuracy +'</span></p><p><span>Броня:</span><span>'+ source[num].armor +'</span></p><p><span>Допуск:</span><span>'+ source[num].admission +'</span></p><p><span>Стоимость:</span><span>'+ source[num].price +'</span></p></div>';
			view.showTooltip(text);
		});
		jQ('.unit_card').mouseleave(function(){
			view.hideTooltip();
		});
	},
	//Отобразить всплывающую подсказку
	showTooltip: function(text){
		jQ('#tooltip').html(text);
		jQ('#tooltip').show();
	},
	//Скрыть всплывающую подсказку
	hideTooltip: function(){
		jQ('#tooltip').html('');
		jQ('#tooltip').hide();
	},
	//Вывод текста в элемент
	showInfo: function(text, elem){
		jQ(elem).html('');
		jQ(elem).html(text);
	},
	showMessage: function(){//Вывод окна с подсказкой...
		//
	},
	//Убрать кости
	removeBones: function(){
		jQ('.bone').remove();
	},
	getRandomPhrase: function(source){
		var num = Math.round(Math.random() * (source.length - 1));
		return source[num];
	}
};

//=================================================================================================
//Перемешивание элементов массива
function shuffle(array){
	return array.sort(function() {
		return 0.5 - Math.random();
	});
};
//Загрузка страницы
jQ(document).ready(function(){
	steleon.init();
	console.log(steleon);
});
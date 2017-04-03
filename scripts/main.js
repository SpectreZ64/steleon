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
var s = {
	mode: 0,
	players: [],
	curPlayer: 0,
	unitCards: [],
	magicCards: [],
	magicCardsTrash: [],
	modes: [
		{
			name: 'Традиция',
			className: 'mode_traditional',
			enabled: true
		},
		{
			name: 'Ультра',
			className: 'mode_ultra',
			enabled: false
		},
		{
			name: 'Бронепехота',
			className: 'mode_marines',
			enabled: false
		}
	],
	//Инициализация
	init: function(){
		e.modeMenu();
		//Загрузка данных из таблиц
		s.loadUnitCards();
		s.loadMagicCards();
	},
	//Смена игрока
	changePlayer: function(firstTurn){
		if (firstTurn == true){
			s.curPlayer = 0;
		}
		else{
			if (s.players[s.curPlayer].mods.phases.all > 0){
				s.resetMods(s.curPlayer);//Сброс модификаторов
				e.message('Силами магии игрок <span class="important_text">' + s.players[s.curPlayer].name + '</span> получает право ходить ещё раз!');
				return;
			};
			s.resetMods(s.curPlayer);//Сброс модификаторов
			s.curPlayer = s.curPlayer + 1;
			if (s.curPlayer == s.players.length) s.curPlayer = 0;
		};
		v.showPlayerParams();
		var phases = s.players[s.curPlayer].mods.phases;
		if(phases.all <= 0){
			e.message('<p>Ход игрока <span class="important_text">' + s.players[s.curPlayer].name + '</span>!</p>' + '<p>Магия вашего противника препятствует всем вашим действиям в этом ходе.</p>');
			return;
		}
		else if(phases.magic <= 0) e.message('<p>Ход игрока <span class="important_text">' + s.players[s.curPlayer].name + '</span>!</p>' + '<p>Заклинания вашего противника лишают вас возможности применить и изучить магию в этом ходе.</p>')
		else if(phases.move <= 0) e.message('<p>Ход игрока <span class="important_text">' + s.players[s.curPlayer].name + '</span>!</p>' + '<p>Заклинания противника препятствуют вашим манёврам в этом ходе.</p>')
		else if(phases.fight <= 0) e.message('<p>Ход игрока <span class="important_text">' + s.players[s.curPlayer].name + '</span>!</p>' + '<p>Магия вашего противника лишает вас возможности вести рукопашный бой в этом ходе.</p>')
		else if(phases.shoot <= 0) e.message('<p>Ход игрока <span class="important_text">' + s.players[s.curPlayer].name + '</span>!</p>' + '<p>Магия противника препятствует вашим войскам вести стрельбу в этом ходе.</p>')
		else e.message('Ход игрока <span class="important_text">' + s.players[s.curPlayer].name + '</span>!');
	},
	//Загрузить карты боевых единиц в массив
	loadUnitCards: function(){
		jQ('.unit_card_data').each(function(i, elem){
			card = jQ.parseJSON(jQ(elem).attr('data-params'));
			card.used = false;
			s.unitCards.push(card);
		});
	},
	//Загрузить карты магии в массив
	loadMagicCards: function(){
		jQ('#magic_cards_data .magic_card_data').each(function(i, elem){
			card = jQ.parseJSON(jQ(elem).attr('data-params'));
			s.magicCards.push(card);
		});
		shuffle(s.magicCards);
	},
	//Бросить игровую кость
	createBones: function(count = 1){
		var result = 0;
		if (jQ('.bones_wrapper').length == 0) jQ('<div class="bones_wrapper"></div>').appendTo('.content_wrapper');
		for (var i = 0; i < count; i++){
			var a = Math.round(Math.random() * 5 + 1);
			var bone = jQ(document.createElement('div'));
			bone.addClass('bone bone' + a);
			bone.appendTo('.bones_wrapper');
			result = result + a;
		};
		return result;
	},
	//Записать информацию об игроке
	addPlayer: function(){
		var player = {
			name: jQ('#player_name').val(),
			magicCards: [],
			army: []
		};
		s.players.push(player);
		s.curPlayer = s.players.length - 1;
		s.getMagicCard(s.curPlayer);
	},
	//Установка модификаторов боевых единиц
	setUnitsMods: function(player, mods){
		s.players[player].army.forEach(function(unit, i){
			unit.mods = mods;
		});
	},
	//Установка модификаторов игрока
	setPlayerMods: function(player, mods){
		s.players[player].mods = mods;
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
		s.setPlayerMods(s.curPlayer, playerMods);//сброс модификаторов игрока
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
		s.setUnitsMods(s.curPlayer, unitsMods);//сброс модификаторов боевых единиц
	},
	//Выдать магическую карту
	getMagicCard(player){
		if (s.magicCards.length == 0){
			if (s.magicCardsTrash.length == 0){
				e.message('Магические карты закончились!');
				return false;
			};
			s.magicCards = JSON.parse(JSON.stringify(s.magicCardsTrash))
			s.magicCardsTrash = [];
			shuffle(s.magicCards);
		};
		s.players[player].magicCards.push(s.magicCards[0]);
		s.magicCards.splice(0, 1);
		return true;
	},
	//Начать фазу
	changePhase: function(){
		var playerPhases = s.players[s.curPlayer].mods.phases;
		if (playerPhases.all < 1){
			s.changePlayer();
			return;
		};
		if (playerPhases.magic > 0){//Переход к фазе магии
			e.phaseMagic();
			playerPhases.magic--;
			return;
		};
		if (playerPhases.move > 0){//Переход к фазе магии
			e.phaseMove();
			playerPhases.move--;
			return;
		};
		if (playerPhases.fight > 0){//Переход к фазе магии
			e.phaseFight();
			playerPhases.fight--;
			return;
		};
		if (playerPhases.shoot > 0){//Переход к фазе магии
			e.phaseShoot();
			playerPhases.shoot--;
			return;
		};
		playerPhases.all--;
		s.changePlayer();
	},
	//Получить стоимость армии игрока
	getArmyPrice(player){
		price = 0;
		s.players[player].army.forEach(function(unit, i){
			price = price + Number(unit.price);
		});
		return price;
	},
	//Модификаторы параметров
	modifiers: {
		init: function(player, card){
			switch(card[1]){
				case 'playerMod': 
					s.modifiers.player(player, card);//установка модификаторов для игрока
					break;
			};
		},
		player: function(player, card){
			var phases = s.players[player].mods.phases;
			if(card[2] == 'turn'){
				phases.all = (card[4] == 'null') ? phases.all : phases.all + Number(card[4]);
				phases.magic = (card[5] == 'null') ? phases.magic : phases.magic + Number(card[5]);
				phases.move = (card[6] == 'null') ? phases.move : phases.move + Number(card[6]);
				phases.fight = (card[7] == 'null') ? phases.fight : phases.fight + Number(card[7]);
				phases.shoot = (card[8] == 'null') ? phases.shoot : phases.shoot + Number(card[8]);
			};
		},
		units: function(type, player, units, params){
			//
		},
		magic: function(type, player, count, condition){
			//
		}
	}
};
//------------------------------------------------------------------------------------------------
//ПРЕДСТАВЛЕНИЕ
var v = {
	//Создание разметки меню режимов игры
	modeMenuInit: function(){
		s.modes.forEach(function(mode, i){
			var disabled = ' disabled';
			if (mode.enabled) disabled = '';
			jQ('.content_wrapper').append('<div class="button mode_btn '+ mode.className + disabled +'" data-num="'+ i +'">'+ mode.name +'</div>');
		});
		jQ('.mode_btn').click(function(){
			s.mode = (jQ(this).attr('data-num'));
			e.newPlayer();
		});
	},
	//Установить заголовок
	setHeader: function(text){
		jQ('.header_panel').html(text);
	},
	//Установить контент
	setContent(content){
		jQ('.content_wrapper').html('');
		jQ('.content_wrapper').append(content);
	},
	//Установить кнопки
	setButtons(source, id){
		jQ('.bottom_panel').html('');
		if (typeof(source) == 'string'){//Одна кнопка
			jQ('.bottom_panel').append('<div id="'+ id +'" class="button orange">'+ source +'</div>')
		}
		else{
			source.forEach(function(text, i){//Много кнопок
				jQ('.bottom_panel').append('<div id="'+ id[i] +'" class="button orange">'+ text +'</div>')
			});
		};
	},
	//Отобразить параметры игрока
	showPlayerParams: function(){
		jQ('.current_player_name').text(s.players[s.curPlayer].name);
		v.makeUnitsList(s.curPlayer, '.units_list');
		v.updateMagicStack();
		jQ('#spell_magic').show();
		if(s.players[s.curPlayer].magicCards.length == 0) jQ('#spell_magic').hide();
	},
	//Обновить список карт игрока в интерфейсе
	updateMagicStack: function(){
		v.makeMagicList(s.curPlayer, '.magic_cards_stack');
	},
	//Построить разметку списка боевых единиц игрока
	makeUnitsList: function(playerNum, target){
		jQ(target).html('');
		if (playerNum == -1){//Общий список войск
			s.unitCards.forEach(function(unit, i){
				if (unit.used) return;
				jQ(target).append('<div class="unit_card common_unit" data-num="' + i + '"></div>');
				jQ(target + ' .unit_card').last().css('background-image', 'url("images/units/' + unit.picture + '.png")');
			});
			v.bindUnitsTooltip(target + ' .unit_card', s.unitCards);
		}
		else{//Для конкретного игрока
			s.players[playerNum].army.forEach(function(unit, i){
				jQ(target).append('<div class="unit_card player_unit" data-num="' + i + '" data-source="'+ s.unitCards.indexOf(unit) +'"></div>');
				jQ(target + ' .unit_card').last().css('background-image', 'url("images/units/' + unit.picture + '.png")');
			});
			v.bindUnitsTooltip(target + ' .unit_card', s.players[playerNum].army);
		};
	},
	//Построить разметку списка карт магии игрока
	makeMagicList: function(playerNum, target){
		jQ(target).html('');
		s.players[playerNum].magicCards.forEach(function(card, i){
			jQ(target).append('<div class="magic_card" data-num="' + i + '"></div>');
		});
	},
	//Построить разметку списка игроков-противников
	makeEnemysList: function(card){
		v.setContent('<div id="enemys_list"></div>');
		s.players.forEach(function(enemy, i){
			if (i == s.curPlayer) return;
			jQ('#enemys_list').append('<div class="button orange" data-num="' + i + '">'+ enemy.name +'</div>');
		});
		jQ('#enemys_list .button').click(function(){//нажатие на элемент списка игроков
			var selectedPlayer = jQ(this).attr('data-num');
			s.modifiers.init(selectedPlayer, card);
			s.changePhase();
		});
	},
	//Назначить события всплывающей подсказки
	bindUnitsTooltip: function(target, source){//Назначить всплывающие подсказки
		jQ(target).unbind('mouseover');
		jQ(target).unbind('mouseleave');
		jQ(target).mouseover(function(){
			var num = jQ(this).attr('data-num');
			var text = '<div class="tooltip"><p>'+ source[num].name +'</p><p><span>Артефакт:</span><span>'+ source[num].artefact +'</span></p><p><span>Рукопашный бой:</span><span>'+ source[num].power +'</span></p><p><span>Маневр:</span><span>'+ source[num].speed +'</span></p><p><span>Стрельба:</span><span>'+ source[num].accuracy +'</span></p><p><span>Броня:</span><span>'+ source[num].armor +'</span></p><p><span>Допуск:</span><span>'+ source[num].admission +'</span></p><p><span>Стоимость:</span><span>'+ source[num].price +'</span></p></div>';
			v.showTooltip(text);
		});
		jQ('.unit_card').mouseleave(function(){
			v.hideTooltip();
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
	//Получить случайную фразу из массива фраз
	getRandomPhrase: function(source){
		var num = Math.round(Math.random() * (source.length - 1));
		return source[num];
	}
};
//------------------------------------------------------------------------------------------------
//ОКРУЖЕНИЯ
var e = {
	//Меню выбора режима игры
	modeMenu: function(){
		v.setHeader('выберите режим игры');
		v.modeMenuInit();
	},
	//Добавление нового игрока
	newPlayer: function(){
		v.setHeader('новый игрок');
		v.setContent('<div class="info_text">Введите имя игрока:</div><input type="text" id="player_name"></input>');
		v.setButtons('Выбрать армию', 'next_stage');
		jQ('#next_stage').click(function(){
			s.addPlayer();
			e.selectArmy();
		});
	},
	//Выбор арамии игрока
	selectArmy: function(){
		v.setHeader('выбор армии игрока <span class="important_text">' + s.players[s.curPlayer].name + '</span>');
		v.setContent('<div class="side_panel"><p class="label">Доступные войска:</p><div class="army_panel" id="common_army"></div></div><div class="side_panel"><p class="label">Армия игрока. Стоимость: <span id="price" class="important_text">0</span></p><div class="army_panel" id="player_army"></div>');
		v.makeUnitsList(-1, '#common_army');
		v.makeUnitsList(s.curPlayer, '#player_army');
		if (s.players.length < 2) v.setButtons('Добавить игрока', 'add_player')
		else v.setButtons(['Добавить игрока', 'Начать игру'], ['add_player', 'next_stage']);
		jQ('#add_player').click(function(){s.resetMods(s.curPlayer); e.newPlayer()});
		jQ('#next_stage').click(function(){s.resetMods(s.curPlayer); e.playersOrder()});
		//--------------
		//РЕДАКТОР АРМИИ
		//Нажатие на боевых единиц общего списка
		jQ('.common_unit').click(function(){
			var sourceNum = jQ(this).attr('data-num');//Индекс в общем списке боевых единиц
			var unit = s.unitCards[sourceNum];
			unit.used = true;
			s.players[s.curPlayer].army.push(unit);
			v.makeUnitsList(s.curPlayer, '#player_army');
			jQ(this).hide();
			jQ('#price').text(s.getArmyPrice(s.curPlayer));
			//Нажатие на боевых единиц армии игрока
			selectUnit = function(){
				var num = jQ(this).attr('data-num');
				unit = s.players[s.curPlayer].army[num];
				unit.used = false;
				s.players[s.curPlayer].army.splice(num, 1);
				num = jQ(this).attr('data-source');
				jQ('#common_army').find('[data-num="' + num + '"]').show();
				v.makeUnitsList(s.curPlayer, '#player_army');
				jQ('.player_unit').click(selectUnit);
				price = s.getArmyPrice(s.curPlayer);
				jQ('#price').text(price);
				v.hideTooltip();
			};
			jQ('.player_unit').click(selectUnit);
			v.bindUnitsTooltip('.player_unit', s.players[s.curPlayer].army);
		});
	},
	//Отображение последовательности ходов игроков
	playersOrder: function(){
		v.setHeader('');
		var content = '<div class="info_text"><p>Последовательность ходов игроков<br>выбрана случайным образом:</p>';
		shuffle(s.players);
		s.players.forEach(function(player, i){
			content = content + '<p class="player_name">' + (i+1) + ':  ' + player.name + '</p>';
		});
		content = content + "</div>";
		v.setContent(content);
		v.setButtons('Играть!', 'next_stage');
		jQ('#next_stage').click(function(){s.changePlayer(true)});
	},
	//===================== ФАЗЫ ИГРЫ ========================
	//Фаза магии
	phaseMagic: function(){
		v.setHeader('фаза магии');
		var content = '<div id="get_magic_card" class="button orange">Изучить магию</div>';
		if (s.players[s.curPlayer].magicCards.length > 0){
			content = content + '<div id="spell_magic" class="button orange">Использовать магию</div>';
		};
		v.setContent(content);
		v.setButtons('Пропустить фазу', 'next_phase');
		jQ('#get_magic_card').click(function(){e.phaseMagicGet()});
		jQ('#spell_magic').click(function(){e.phaseMagicSpell()});
		jQ('#next_phase').click(function(){s.changePhase()});
	},
	//Фаза магии - получение карты
	phaseMagicGet: function(){
		v.setHeader('');
		v.setContent('<div id="message" class="info_text"></div>');
		buttons = ['Следующая фаза'];
		ids = ['next_phase'];
		var lucky = s.createBones(1);
		if (lucky == 6){
			s.getMagicCard(s.curPlayer);
			s.getMagicCard(s.curPlayer);
			v.updateMagicStack();
			jQ('#message').html(v.getRandomPhrase(magicAnswers6) + '<br>Вы получили сразу две карты магии!', '#phase_magic_get .info_text');
			buttons.push('Применить магию');
			ids.push('spell_magic');
		}
		else if(lucky > 2){
			s.getMagicCard(s.curPlayer);
			v.updateMagicStack();
			jQ('#message').html(v.getRandomPhrase(magicAnswers4) + '<br>Вы получили карту магии!', '#phase_magic_get .info_text');
			buttons.push('Применить магию');
			ids.push('spell_magic');
		}
		else{
			jQ('#message').html(v.getRandomPhrase(magicAnswers1) + '<br>Вы не получили карту магии.', '#phase_magic_get .info_text');
		};
		v.setButtons(buttons, ids);
		jQ('#next_phase').click(function(){s.changePhase()});
		jQ('#spell_magic').click(function(){e.phaseMagicSpell()});
	},
	//Применение карты магии
	phaseMagicSpell: function(){
		v.setHeader('');
		var card = s.players[s.curPlayer].magicCards[0];
		var content = '<div class="info_text">' + card[0] + '</div>';
		if (card[1] == 'moving'){//перемещение
			if (card[2] == 'simple'){//простое
				content = content + '<div class="info_text"><p class="help">выполните действия на игровом поле</p></div>';
				v.setButtons('Выполнено', 'next_phase');
			};
		};
		if (card[1] == 'playerMod'){//модификация параметров игрока
			if (card[3] == 'select'){
				if (s.players.length == 2){
					s.modifiers.init(s.players.length - 1 - s.curPlayer, card)//если только 2 игрока
					v.setButtons('Следующая фаза', 'next_phase');
				}
				else v.setButtons('Выбрать противника', 'pick_enemy');//если игроков более двух
			};
			if (card[3] == 'self'){
				s.modifiers.init(s.curPlayer, card);
				v.setButtons('Следующая фаза', 'next_phase');
			};
		};
		v.setContent(content);
		s.magicCardsTrash.push(card);
		s.players[s.curPlayer].magicCards.splice(0, 1);
		v.updateMagicStack();
		jQ('#next_phase').click(function(){s.changePhase()});
		jQ('#pick_enemy').click(function(){
			v.makeEnemysList(card);
			jQ('.bottom_panel').html('');
		});
	},
	phaseMove: function(){
		v.setContent('Фаза манёвра');
		v.setButtons('Следующая фаза', 'next_phase');
		jQ('#next_phase').click(function(){s.changePhase()});
	},
	phaseFight: function(){
		v.setContent('Фаза рукопашного боя');
		v.setButtons('Следующая фаза', 'next_phase');
		jQ('#next_phase').click(function(){s.changePhase()});
	},
	phaseShoot: function(){
		v.setContent('Фаза стрельбы');
		v.setButtons('Следующая фаза', 'next_phase');
		jQ('#next_phase').click(function(){s.changePhase()});
	},
	//Окно сообщения
	message: function(text){
		v.setContent('<div class="info_text">' + text + '</div>');
		v.setButtons('Понятно', 'next_phase');
		jQ('#next_phase').click(function(){s.changePhase()});
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
	s.init();
	console.log(s);
	jQ(window).resize(function(){
		jQ('.board').width(0.97 * jQ('.board').height());
	});
	jQ(window).resize();
});
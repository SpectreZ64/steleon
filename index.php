<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Project Steleon</title>
		<link rel = "stylesheet" type = "text/css" href = "styles.css">
		<script type = "text/javascript" src = "scripts/jquery2.2.0.js"></script>
		<script type = "text/javascript" src = "scripts/main.js"></script>
	</head> 
	<body>
		<div id="loader_data" class="hidden">
			<div id="magic_cards_data">
				<?php
					//Построение списка боевых единиц
					$row = 1;
					$number = 0;
					if (($handle = fopen("data/magicCards.csv", "r")) !== FALSE) {
						while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
							$num = count($data);
							$params = [];
							$count = 0;
							for ($c=0; $c < $num; $c++) {//Сбор массива параметров
								if ($data[$c] == '') continue;
								array_push($params, $data[$c]);
							};
							echo ('<div class="magic_card_data" data-num="' . $row . '" data-params="');
							echo (htmlspecialchars(json_encode($params, JSON_UNESCAPED_UNICODE)));
							echo ('"></div>');
							$row++;
						};
						fclose($handle);
					};
				?>
			</div>
		</div>
		<div class="background"></div>
		<div id="tooltip"></div>
		<div class="board">
			<div class="content_wrapper">
				<div class="closed page" id="mode_selector"><!--Выбор режима игры-->
					<div class="button mode_btn mode_traditional" data-mode="0">Традиция</div>
					<div class="button mode_btn mode_ultra disabled" data-mode="1">Ультра</div>
					<div class="button mode_btn mode_marines disabled" data-mode="2">Бронепехота</div>
				</div>
				<div class="closed page" id="player_creator"><!--Создание игрока-->
					<div>
						<p class="label">Имя игрока</p>
						<input type="text" id="player_name"></input>
						<br>
					</div>
					<div class="bottom_panel">
						<div class="button orange" id="set_player">Выбрать Армию</div>
					</div>
				</div>
				<div class="closed page" id="army_editor"><!--Выбор армии игрока-->
					<div class="side_panel">
						<p class="label">Доступные войска:</p>
						<div class="army_panel" id="common_army">
							<div class="scroll_wrapper">
								<?php
									//Построение списка боевых единиц
									$row = 1;
									$number = 0;
									if (($handle = fopen("data/units.csv", "r")) !== FALSE) {
										$headers = [];
										while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
											$num = count($data);
											if ($row == 1){//Создание массива заголовков
												for ($c=0; $c < $num-1; $c++){
													array_push($headers, $data[$c]);
												}
												$row++;
												continue;
											};
											$params = [];
											$count = 0;
											for ($c=0; $c < $num; $c++) {//Сбор массива параметров
												if ($c < $num-1) $params[$headers[$c]] = $data[$c];
												else $count = $data[$c];
											};
											for ($i=0; $i < $count; $i++){
												echo ('<div class="unit_card common_unit" data-num="' . $number . '" data-params="');
												echo (htmlspecialchars(json_encode($params)));
												echo ('"></div>');
												$number++;
											};
											$row++;
										};
										fclose($handle);
									};
								?>
							</div>
						</div>
					</div>
					<div class="side_panel">
						<p class="label">Армия игрока:</p>
						<div class="army_panel"><div class="scroll_wrapper" id="player_army"></div></div>
					</div>
					<div style="height: 80px;"></div>
					<div class="bottom_panel">
						<div class="button orange" id="set_army">Готово</div>
					</div>
				</div>
				<div class="closed page" id="game_starter"><!--Добавление нового игрока или старт игры-->
					<div class="button green" id="add_player">Добавить игрока</div>
					<div class="button orange" id="start_game">Начать игру</div>
				</div>
				<div class="closed page" id="players_order"><!--Информация о порядке ходов игроков-->
					<div class="info_text">
						<p>Порядок ходов игроков определен<br>случайным образом:</p>
					</div>
					<div class="bottom_panel">
						<div class="button orange" id="first_turn">Ход игрока</div>
					</div>
				</div>
				<div class="closed page" id="phase_magic"><!--Фаза магии-->
					<div class="button green" id="make_magic">Применить магию</div>
					<div class="button orange" id="get_magic_card">Изучить магию</div>
				</div>
				<div class="closed page phase_magic" id="phase_magic_get">
					<div class="info_text"></div>
					<div class="bones_wrapper"></div>
					<div class="bottom_panel">
						<div class="button orange next_phase">Готово</div>
					</div>
				</div>
			</div>
		</div>
		<div class="current_player_name"></div>
		<div class="magic_cards_stack"></div>
		<div class="active_spells"></div>
		<div class="units_list"></div>
	</body> 
</html>
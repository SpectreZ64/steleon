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
		<div class="background"></div>
		<div class="board">
			<div id="bones_place" class="bones_wrapper"></div>
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
						<div class="button orange" id="setPlayer">Выбрать Армию</div>
					</div>
				</div>
				<div class="closed page" id="army_editor"><!--Выбор армии игрока-->
					<div class="side_panel">
						<p class="label">Доступные войска:</p>
						<div class="army_panel">
							<?php
								//Построение списка боевых единиц
								$row = 1;
								if (($handle = fopen("data/units.csv", "r")) !== FALSE) {
									$headers = [];
									while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
										$num = count($data);
										if ($row == 1){//Создание массива заголовков
											for ($c=0; $c < $num; $c++){
												array_push($headers, $data[$c]);
											}
											$row++;
											continue;
										};
										$params = [];
										for ($c=0; $c < $num; $c++) {//Сбор массива параметров
											$params[$headers[$c]] = $data[$c];
										};
										echo ('<div class="unit_card" data-params="');
										echo (htmlspecialchars(json_encode($params)));
										echo ('"></div>');
										$row++;
									};
									fclose($handle);
								};
							?>
						</div>
					</div>
					<div class="side_panel">
						<p class="label">Армия игрока:</p>
						<div class="army_panel"></div>
					</div>
				</div>
			</div>
		</div>
	</body> 
</html>
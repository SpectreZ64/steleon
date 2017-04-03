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
			<div id="units_data" class="hidden">
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
								echo ('<div class="unit_card_data" data-num="' . $number . '" data-params="');
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
		<div class="background"></div>
		<div id="tooltip"></div>
		<div class="board">
			<div class="header_panel"></div>
			<div class="content_wrapper"></div>
			<div class="bottom_panel"></div>
		</div>
		<div class="current_player_name"></div>
		<div class="magic_cards_stack"></div>
		<div class="active_spells"></div>
		<div class="units_list"></div>
	</body> 
</html>
INSERT INTO puns_core.game_words (word) VALUES
	('kot w butach'),
	('cicha woda brzegi rwie'),
	('kevin sam w domu'),
	('pinokio'),
	('czerwony kapturek'),
	('złota rączka'),
	('rzucać słowa na wiatr'),
	('gwiezdne wojny'),
	('przeciągać strunę'),
	('zarabiać kokosy'),
	('wulkan energii'),
	('biochemia'),
	('czarne myśli'),
	('taniec towarzyski'),
	('recepcjonistka'),
	('eskimos'),
	('słowo honoru'),
	('lustro'),
	('reakcja łańcuchowa'),
	('mumia'),
	('czapka'),
	('woda'),
	('grawitacja'),
	('zakazany owoc'),
	('pamięć krótkotrwała'),
	('incepcja'),
	('jaka to melodia'),
	('wysokie napięcie'),
	('wybuch kontrolowany'),
	('morderstwo'),
	('westworld'),
	('titanic'),
	('helikopter w ogniu'),
	('albert einstein'),
	('taniec z gwiazdami'),
	('strach ma wielkie oczy'),
	('piękna i bestia'),
	('as w rękawie'),
	('szklana pułapka'),
	('wirtualna rzeczywistość'),
	('autobiografia'),
	('wojna'),
	('autostrada'),
	('co dwie głowy to nie jedna'),
	('karabin'),
	('uniwersytet'),
	('jechać na gapę'),
	('płynąć z prądem'),
	('igła w stogu siana'),
	('batman');

INSERT INTO puns_core.media (id, file_name, storage_path, creation_time) VALUES
	(uuid_generate_v4(), 'test.png', 'example1.png', NOW()),
	(uuid_generate_v4(), 'test.png', 'example2.png', NOW()),
	(uuid_generate_v4(), 'test.png', 'example3.png', NOW()),
	(uuid_generate_v4(), 'test.mp4', 'example4.mp4', NOW());

INSERT INTO puns_core.players (email, nick, creation_time, password, role, active, avatar_media_id) VALUES
	('ninja@example.com', 'Ninja', NOW(), '$2a$10$CfMRntrvhBJ5XRSuJZNa4ODnwwPZnokA.j5JrbBpnU8K4qDOq.EEG', 'ROLE_PLAYER', TRUE, NULL),
	('grzegorz@example.com', 'Grzegorz', NOW(), '$2a$10$erZEjGi1.aTwAPiZ73UvEeQJNRV5XKS3oUu8LLwB8v9wzMJuoF/0y', 'ROLE_PLAYER', TRUE, NULL),
	('randall@example.com', 'Randall', NOW(), '$2a$10$8awPvqdEzGHp6WatysjAvu8TOn6Uqhd1rTaQrZCbzwgwwHiD3wiye', 'ROLE_PLAYER', TRUE, NULL),
	('holmes@example.com', 'Holmes', NOW(), '$2a$10$Z6VJ8eD4b7QXkNFN1ttkS.OG8WqmNJCxBPtcQIOy/tHt37.Det8RG', 'ROLE_PLAYER', TRUE, NULL),
	('carl@example.com', 'Carl', NOW(), '$2a$10$Ou26/wAvmNuPtWlnR7pxheIlgn4CxH0Ot9GcaWz6gtDSDv.rk4Vje', 'ROLE_PLAYER', TRUE, NULL),
	('henry@example.com', 'Henry', NOW(), '$2a$10$ez1kxlgBp5QGJme5D0TBeexjvYSGeNtZWi4uFt8e3NoxcD1VllYT2', 'ROLE_PLAYER', TRUE, NULL),
	('scott@example.com', 'Scott', NOW(), '$2a$10$/2ehk30CvFUPmdI5CLqzf.JNIjjCkMZw4DA/u84FlC0y4d9EBMZxu', 'ROLE_PLAYER', TRUE, NULL),
	('lukasz@example.com', 'Łukasz', NOW(), '$2a$10$FSI90kET.e6At1libFP5SOszEbt3r9L0QVzk3Ge3j0Ax9ej881gN.', 'ROLE_PLAYER', TRUE, NULL),
	('abraham@example.com', 'Abraham', NOW(), '$2a$10$oSkzrPBjgWRxTZBmKdsos.jflKwmJspiEAf0DwWcL/wTnoHXekeLK', 'ROLE_PLAYER', TRUE, NULL);



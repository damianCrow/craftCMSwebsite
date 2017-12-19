//  THIS JS IS THE SAME AS APP>JS EXCEPT INSTEAD OF USING FETCH TO GET THE JSON, THE OBJECT IS INCLUDED IN THE FILE. \\

const time = 750;
let section3Idx = 0;
let section4Idx = 0;

const spriteObj = {"frames": [
	{
		"filename": "A_Football_00000.png",
		"frame": {"x":1,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00001.png",
		"frame": {"x":203,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00002.png",
		"frame": {"x":405,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00003.png",
		"frame": {"x":607,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00004.png",
		"frame": {"x":809,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00005.png",
		"frame": {"x":1011,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00006.png",
		"frame": {"x":1213,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00007.png",
		"frame": {"x":1415,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00008.png",
		"frame": {"x":1617,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00009.png",
		"frame": {"x":1819,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00010.png",
		"frame": {"x":2021,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00011.png",
		"frame": {"x":2223,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00012.png",
		"frame": {"x":2425,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00013.png",
		"frame": {"x":2627,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00014.png",
		"frame": {"x":2829,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00015.png",
		"frame": {"x":3031,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00016.png",
		"frame": {"x":3233,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00017.png",
		"frame": {"x":3435,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00018.png",
		"frame": {"x":3637,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00019.png",
		"frame": {"x":3839,"y":1,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00020.png",
		"frame": {"x":1,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00021.png",
		"frame": {"x":203,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00022.png",
		"frame": {"x":405,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00023.png",
		"frame": {"x":607,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00024.png",
		"frame": {"x":809,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00025.png",
		"frame": {"x":1011,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00026.png",
		"frame": {"x":1213,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00027.png",
		"frame": {"x":1415,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00028.png",
		"frame": {"x":1617,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00029.png",
		"frame": {"x":1819,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00030.png",
		"frame": {"x":2021,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00031.png",
		"frame": {"x":2223,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00032.png",
		"frame": {"x":2425,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00033.png",
		"frame": {"x":2627,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00034.png",
		"frame": {"x":2829,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00035.png",
		"frame": {"x":3031,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00036.png",
		"frame": {"x":3233,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00037.png",
		"frame": {"x":3435,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "A_Football_00038.png",
		"frame": {"x":3637,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00001.png",
		"frame": {"x":3839,"y":178,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00002.png",
		"frame": {"x":1,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00003.png",
		"frame": {"x":203,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00004.png",
		"frame": {"x":405,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00005.png",
		"frame": {"x":607,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00006.png",
		"frame": {"x":809,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00007.png",
		"frame": {"x":1011,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00008.png",
		"frame": {"x":1213,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00009.png",
		"frame": {"x":1415,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00010.png",
		"frame": {"x":1617,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00011.png",
		"frame": {"x":1819,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00012.png",
		"frame": {"x":2021,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00013.png",
		"frame": {"x":2223,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00014.png",
		"frame": {"x":2425,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00015.png",
		"frame": {"x":2627,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00016.png",
		"frame": {"x":2829,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00017.png",
		"frame": {"x":3031,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00018.png",
		"frame": {"x":3233,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00019.png",
		"frame": {"x":3435,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00020.png",
		"frame": {"x":3637,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00021.png",
		"frame": {"x":3839,"y":355,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00022.png",
		"frame": {"x":1,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00023.png",
		"frame": {"x":203,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00024.png",
		"frame": {"x":405,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00025.png",
		"frame": {"x":607,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00026.png",
		"frame": {"x":809,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00027.png",
		"frame": {"x":1011,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00028.png",
		"frame": {"x":1213,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00029.png",
		"frame": {"x":1415,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00030.png",
		"frame": {"x":1617,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00031.png",
		"frame": {"x":1819,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00032.png",
		"frame": {"x":2021,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00033.png",
		"frame": {"x":2223,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00034.png",
		"frame": {"x":2425,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00035.png",
		"frame": {"x":2627,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00036.png",
		"frame": {"x":2829,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00037.png",
		"frame": {"x":3031,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Baseball_00038.png",
		"frame": {"x":3233,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00001.png",
		"frame": {"x":3435,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00002.png",
		"frame": {"x":3637,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00003.png",
		"frame": {"x":3839,"y":532,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00004.png",
		"frame": {"x":1,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00005.png",
		"frame": {"x":203,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00006.png",
		"frame": {"x":405,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00007.png",
		"frame": {"x":607,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00008.png",
		"frame": {"x":809,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00009.png",
		"frame": {"x":1011,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00010.png",
		"frame": {"x":1213,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00011.png",
		"frame": {"x":1415,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00012.png",
		"frame": {"x":1617,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00013.png",
		"frame": {"x":1819,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00014.png",
		"frame": {"x":2021,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00015.png",
		"frame": {"x":2223,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00016.png",
		"frame": {"x":2425,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00017.png",
		"frame": {"x":2627,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00018.png",
		"frame": {"x":2829,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00019.png",
		"frame": {"x":3031,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00020.png",
		"frame": {"x":3233,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00021.png",
		"frame": {"x":3435,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00022.png",
		"frame": {"x":3637,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00023.png",
		"frame": {"x":3839,"y":709,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00024.png",
		"frame": {"x":1,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00025.png",
		"frame": {"x":203,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00026.png",
		"frame": {"x":405,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00027.png",
		"frame": {"x":607,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00028.png",
		"frame": {"x":809,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00029.png",
		"frame": {"x":1011,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00030.png",
		"frame": {"x":1213,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00031.png",
		"frame": {"x":1415,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00032.png",
		"frame": {"x":1617,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00033.png",
		"frame": {"x":1819,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00034.png",
		"frame": {"x":2021,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00035.png",
		"frame": {"x":2223,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00036.png",
		"frame": {"x":2425,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00037.png",
		"frame": {"x":2627,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Basketbal_00038.png",
		"frame": {"x":2829,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00001.png",
		"frame": {"x":3031,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00002.png",
		"frame": {"x":3233,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00003.png",
		"frame": {"x":3435,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00004.png",
		"frame": {"x":3637,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00005.png",
		"frame": {"x":3839,"y":886,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00006.png",
		"frame": {"x":1,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00007.png",
		"frame": {"x":203,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00008.png",
		"frame": {"x":405,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00009.png",
		"frame": {"x":607,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00010.png",
		"frame": {"x":809,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00011.png",
		"frame": {"x":1011,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00012.png",
		"frame": {"x":1213,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00013.png",
		"frame": {"x":1415,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00014.png",
		"frame": {"x":1617,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00015.png",
		"frame": {"x":1819,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00016.png",
		"frame": {"x":2021,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00017.png",
		"frame": {"x":2223,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00018.png",
		"frame": {"x":2425,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00019.png",
		"frame": {"x":2627,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00020.png",
		"frame": {"x":2829,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00021.png",
		"frame": {"x":3031,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00022.png",
		"frame": {"x":3233,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00023.png",
		"frame": {"x":3435,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00024.png",
		"frame": {"x":3637,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00025.png",
		"frame": {"x":3839,"y":1063,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00026.png",
		"frame": {"x":1,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00027.png",
		"frame": {"x":203,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00028.png",
		"frame": {"x":405,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00029.png",
		"frame": {"x":607,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00030.png",
		"frame": {"x":809,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00031.png",
		"frame": {"x":1011,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00032.png",
		"frame": {"x":1213,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00033.png",
		"frame": {"x":1415,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00034.png",
		"frame": {"x":1617,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00035.png",
		"frame": {"x":1819,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00036.png",
		"frame": {"x":2021,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00037.png",
		"frame": {"x":2223,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Fan_00038.png",
		"frame": {"x":2425,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Idle_00000.png",
		"frame": {"x":2627,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00001.png",
		"frame": {"x":2829,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00002.png",
		"frame": {"x":3031,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00003.png",
		"frame": {"x":3233,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00004.png",
		"frame": {"x":3435,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00005.png",
		"frame": {"x":3637,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00006.png",
		"frame": {"x":3839,"y":1240,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00007.png",
		"frame": {"x":1,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00008.png",
		"frame": {"x":203,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00009.png",
		"frame": {"x":405,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00010.png",
		"frame": {"x":607,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00011.png",
		"frame": {"x":809,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00012.png",
		"frame": {"x":1011,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00013.png",
		"frame": {"x":1213,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00014.png",
		"frame": {"x":1415,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00015.png",
		"frame": {"x":1617,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00016.png",
		"frame": {"x":1819,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00017.png",
		"frame": {"x":2021,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00018.png",
		"frame": {"x":2223,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00019.png",
		"frame": {"x":2425,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00020.png",
		"frame": {"x":2627,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00021.png",
		"frame": {"x":2829,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00022.png",
		"frame": {"x":3031,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00023.png",
		"frame": {"x":3233,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00024.png",
		"frame": {"x":3435,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00025.png",
		"frame": {"x":3637,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00026.png",
		"frame": {"x":3839,"y":1417,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00027.png",
		"frame": {"x":1,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00028.png",
		"frame": {"x":203,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00029.png",
		"frame": {"x":405,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00030.png",
		"frame": {"x":607,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00031.png",
		"frame": {"x":809,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00032.png",
		"frame": {"x":1011,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00033.png",
		"frame": {"x":1213,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00034.png",
		"frame": {"x":1415,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00035.png",
		"frame": {"x":1617,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00036.png",
		"frame": {"x":1819,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00037.png",
		"frame": {"x":2021,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	},
	{
		"filename": "Tennis_00038.png",
		"frame": {"x":2223,"y":1594,"w":200,"h":175},
		"rotated": false,
		"trimmed": false,
		"spriteSourceSize": {"x":0,"y":0,"w":200,"h":175},
		"sourceSize": {"w":200,"h":175},
		"pivot": {"x":0.5,"y":0.5}
	}],
	"meta": {
		"app": "http://www.codeandweb.com/texturepacker",
		"version": "1.0",
		"image": "Fantastec Sprite Sheet.png",
		"format": "RGBA8888",
		"size": {"w":4040,"h":1770},
		"scale": "1",
		"smartupdate": "$TexturePacker:SmartUpdate:e7f5817d22ecd816ded8d5d234d3ee8e:c8ce16db3797c837a6267eb95fb8f2b2:8fa1dae79340e641b0252cb01d09603b$"
	}
}

// let FootballFrames, TennisFrames, BaseballFrames, BasketballFrames, FanFrames, IdleFrame;
let tennisAnimation, footballAnimation, basketballAnimation, baseballAnimation, fanAnimation;

const masterObj = {
	section2CurrentIdx: 0, 
	section1CurrentIdx: 0,
	basketball: {loopAmount: 1, loopId: basketballAnimation},
	football: {loopAmount: 1, loopId: footballAnimation},
	tennis: {loopAmount: 1, loopId: tennisAnimation},
	baseball: {loopAmount: 1, loopId: baseballAnimation},
	fan: {loopAmount: 1, loopId: fanAnimation}
};
const homepageMobImages = [
	'assets/images/homepageMob/basketball.jpg',
	'assets/images/homepageMob/football.jpg',
	'assets/images/homepageMob/tennis.jpg', 
	'assets/images/homepageMob/baseball.jpg', 
	'assets/images/homepageMob/fan.jpg' 
]

$(document).ready(() => {
// WAIT FOR gfyCatEmbed VIDEO TO START PLAYING ON MOBILE, THEN HIDE THE LOADING ANIMATION. \\

	const filterByValue = (array, string) => {
    return array.filter(o => typeof o['filename'] === 'string' && o['filename'].toLowerCase().includes(string.toLowerCase()));
	}

	const animatorSetup = () => {
			
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
	}

	const animator = (animationObj) => {
						
		var dancingIcon,
			spriteImage,
			canvas;					

		function gameLoop () {
			$('#loading').addClass('hidden');
		  animationObj.loopId = window.requestAnimationFrame(gameLoop);
		  dancingIcon.update();
		  dancingIcon.render();
		}
		
		function sprite (options) {
		
			var that = {},
				frameIndex = 0,
				tickCount = 0,
				loopCount = 0,
				ticksPerFrame = options.ticksPerFrame || 0,
				numberOfFrames = options.numberOfFrames || 1;
			
			that.context = options.context;
			that.width = options.width;
			that.height = options.height;
			that.image = options.image;
			that.loops = options.loops;
			
			that.update = function () {

        tickCount += 1;

        if (tickCount > ticksPerFrame) {

					tickCount = 0;
          // If the current frame index is in range
          if (frameIndex < numberOfFrames - 1) {	
          // Go to the next frame
            frameIndex += 1;
          } else {
        		loopCount++
            frameIndex = 0;

            if(loopCount === that.loops) {
            	window.cancelAnimationFrame(animationObj.loopId);
            }
          }
	      }
	    }
			
			that.render = function () {
			
			  // Clear the canvas
			  that.context.clearRect(0, 0, that.width, that.height);
			  
			  that.context.drawImage(
			    that.image,
			    animationObj.animationArray[frameIndex].frame.x,
			    animationObj.animationArray[frameIndex].frame.y,
			    200,
			    175,
			    0,
			    0,
			    window.innerWidth / 3.846,
			    window.innerWidth / 4.1)
			};
			
			return that;
		}
		
		// Get canvas
		canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth / 3.846;
		canvas.height = window.innerWidth / 2.2;
		
		// Create sprite sheet
		spriteImage = new Image();	
		
		// Create sprite
		dancingIcon = sprite({
			context: canvas.getContext("2d"),
			width: 4040,
			height: 1770,
			image: spriteImage,
			numberOfFrames: animationObj.animationArray.length,
			ticksPerFrame: 4,
			loops: animationObj.loopAmount
		});
		
		// Load sprite sheet
		spriteImage.addEventListener("load", gameLoop);
		spriteImage.src = 'assets/images/Fantastec_Sprite_Sheet.png';
	} 

// INITIALISE AND SETUP CURRENT PAGE. EXECUTE TRANSITIONS AND REMOVE TINT IF RELEVANT \\

	const	pageLoader = (index) => {
		if(index === 5) {
			$('.tint').removeClass('removeTint');
			$('.backgroundWrapper').removeClass('scaleBackground');
			$('#section5').find('.heading').addClass('show fadeIn');
			$('.subSection').addClass('scaleBackground');
			$('.subSection').find('.tint').addClass('removeTint');
			$('#section5').find('.textWrapper').addClass('show');
			setTimeout(() => {
				$('.subSection > .textWrapper').find('.heading').addClass('fadeIn');
			}, 1000);
		} 
		else {
			$('.tint').removeClass('removeTint');
			$('.subSection').removeClass('scaleBackground');
			$(`.backgroundWrapper:not(#section${index}Background)`).removeClass('scaleBackground');
			$(`.section.active`).find(`.backgroundWrapper`).addClass('scaleBackground');
			$(`section.active`).find('.tint').addClass('removeTint');

			if($(`.section${index}PaginatorButton`).length && $(`.section${index}PaginatorButton.active`).length < 1) {
				$(`.section${index}PaginatorButton`).get(0).click();
			}
		}
	};

// HIDE ALL BECKGROUNDS IN THE SECTION EXCEPT THE SPECIFIED INDEX, WHICH IS SCALED AND SHOWN. \\

	const initializeSection = (sectionNumber, idx) => {
		$(`#section${sectionNumber}Background${idx}`).siblings('.backgroundWrapper').map((ix, ele) => {
			$(ele).css({opacity: 0});
		});

		$(`#section${sectionNumber}Background${idx}`).css({
			'transform': 'scale(1.1)',
			'opacity': 1
		});
	};

// INITIATE initializeSection ON SECTIONS 3 AND 4. \\
	initializeSection(1, 0);
	initializeSection(3, 0);
	initializeSection(4, 0);

// SECTIONS 2 (ABOUT US SECTION) BACKGROUND IMAGE TRANSITION HANDLER. \\

	const imageControler = (idxObj, sectionNumber) => {
		let relevantAnimation;

		if(sectionNumber === 1) {
			switch(idxObj.section1CurrentIdx) {
				case 0:
					relevantAnimation = masterObj.basketball;
				break;
				case 1:
					relevantAnimation = masterObj.football;
				break;
				case 2:
					relevantAnimation = masterObj.tennis;
				break;
				case 3:
					relevantAnimation = masterObj.baseball;
				break;
				case 4:
					relevantAnimation = masterObj.fan;
				break;
			}
		}

		$(`#section${sectionNumber}`).find('.tint').removeClass('removeTint');
		$(`#section${sectionNumber}Background${idxObj[`section${sectionNumber}CurrentIdx`]}`).removeClass('scaleBackground');
		initializeSection(sectionNumber, idxObj[`section${sectionNumber}CurrentIdx`]);
		
		setTimeout(() => {
			if(sectionNumber === 1) {
				animator(relevantAnimation);
			}

			$(`#section${sectionNumber}`).find(`.backgroundWrapper`).addClass('scaleBackground');
			$(`#section${sectionNumber}`).find('.tint').addClass('removeTint');
		}, 500);

		if(idxObj[`section${sectionNumber}CurrentIdx`] === $(`#section${sectionNumber}`).find(`.backgroundWrapper`).length - 1) {
			idxObj[`section${sectionNumber}CurrentIdx`] = 0;
		} else {
			idxObj[`section${sectionNumber}CurrentIdx`] += 1;
		}
	}

	imageControler(masterObj, 2);

	setInterval(() => {
		imageControler(masterObj, 2);
	}, 15000);

	if(window.innerWidth < 800) {
		
		// fetch('assets/js/Fantastec_Sprite_Sheet.json').then(function(response) { 
		// 	return response.json();
		// }).then(function(spriteObj) {
			const IdleFrame = filterByValue(spriteObj.frames, 'idle');
			masterObj.football.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'football')];
			masterObj.tennis.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'tennis')];
			masterObj.baseball.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'baseball')];
			masterObj.basketball.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'basket')];
			masterObj.fan.animationArray = [...IdleFrame, ...filterByValue(spriteObj.frames, 'fan')];
			
			animatorSetup();
			imageControler(masterObj, 1);

			setInterval(() => {
				imageControler(masterObj, 1);
			}, 5000);
		// });
	}

// PAGINATION BUTTONS CLICK HANDLER FOR SECTIONS 3 AND 4. \\

	const handlePaninationButtonClick = (e) => {

		const idx = parseInt($(e.target).attr('data-index'));
		const sectionId = $(e.target).closest('section').attr('id');
		let relevantDataArray;

		if(sectionId === 'section3') {
			section3Idx = idx;
		}

		if(sectionId === 'section4') {
			section4Idx = idx;
		}

		$(`#${sectionId}`).find('.tint').removeClass('removeTint');
		$(`#${sectionId}`).find('.textWrapper').removeClass('show');
		$(`#${sectionId}`).find(`#textWrapper${idx}`).addClass('show');
		$(`#${sectionId}Background${idx}`).removeClass('scaleBackground');
		$(`.${sectionId}PaginatorButton`).removeClass('active');
		$(e.target).addClass('active');

		initializeSection(parseInt($(`#${sectionId}`).attr('data-index')), idx);

		setTimeout(() => {
			pageLoader(parseInt($(`#${sectionId}`).attr('data-index')));
		}, 500);

		if(sectionId !== 'section2'){
			$(`#${sectionId}`).find('.heading, p').addClass('fadeIn');
			$(`#${sectionId}`).on('transitionend webkitTransitionEnd oTransitionEnd', (es) => {
	    	$(`#${sectionId}`).find('.heading, p').removeClass('fadeIn');
			});
		}
	};

// CLICK LISTENER FOR PAGINATION BUTTONS ON SECTIONS 3 AND 4. \\

	$('.section3PaginatorButton, .section4PaginatorButton').click((e) => {
		handlePaninationButtonClick(e);
	});

// INITIALIZE ONEPAGESCROLL IF NOT IN CMS PREVIEW. \\

	if(!$(location).attr('href').includes('index.php')) {
		$('#scrollerWrapper').onepage_scroll({
			sectionContainer: "section",    
			easing: "ease-out",                 
			animationTime: time,            
			pagination: true,               
			updateURL: true,               
			beforeMove: (index) => {}, 
			afterMove: (index) => {
// INITIALIZE THE CURRENT PAGE. \\

				pageLoader(index);
			},  
			loop: false,                    
			keyboard: true,                 
			responsiveFallback: false,                                    
			direction: "vertical"          
		});

		$('#scrollerWrapper').moveTo(1);
	}

// CONTROL CLICKS ON WORK WITH US SECTION (SECTION5). \\

	$('.clickable').click((e) => {
		let currentSection = $(e.target).closest($('.subSection'));

		if(currentSection.hasClass('open')) {
			currentSection.removeClass('open');
			currentSection.find('.button, p').removeClass('fadeIn');
			currentSection.siblings('.subSection').map((idx, section) => {
				$(section).removeClass('closed');
				$(section).find('.tint').removeClass('addTint').addClass('removeTint');
			});
		} else {
			currentSection.removeClass('closed').addClass('open');
			currentSection.on('transitionend webkitTransitionEnd oTransitionEnd', (es) => {
	    	$('.subSection.open').find('.button, p').addClass('fadeIn');
			});
			currentSection.siblings('.subSection').map((idx, section) => {
				$(section).removeClass('open').addClass('closed');
				$(section).find('.tint').removeClass('removeTint').addClass('addTint');
				$(section).find('.button, p').removeClass('fadeIn');
			});
		}
		currentSection.find('.tint').removeClass('addTint').addClass('removeTint');
	});

// CONTROL FOOTER ARROW CLICKS. \\

	$('#downArrow').click(() => {
		if($(window).height() * ($('.page').length - 1) === - $('#scrollerWrapper').offset().top) {
	  	$('#scrollerWrapper').moveTo(1);
		} else {
			$('#scrollerWrapper').moveDown();
		}
	});

// HIDE THE LOADING ANIMATIOPN WHEN VIDEO IS READY TO PLAY ON DEXKTOP. \\

	const hideLoadingAnimation = () => {
		if(window.innerWidth > 800 && !$('#loading').hasClass('hidden')) {

			if($('#video').get(0).readyState === 4) {
				$('#loading').addClass('hidden');
			}
		}
	}

	let section3Automated, automateSection3, section4Automated, automateSection4;
// MANAGEMENT FUNCTION FOR SETTING AND CLEARING THE SLIDE AUTOMATION INTERVALS. \\

	const intervalManager = (flag, sectionId, time) => {
   	if(flag) {
   		if(sectionId === 'section3') {
   			automateSection3 = setInterval(() => {
	     		swipeController(sectionId, 'l');	
	     	}, time);
   		}
   		if(sectionId === 'section4') {
   			automateSection4 = setInterval(() => {
	     		swipeController(sectionId, 'l');	
	     	}, time);
   		}
     	 
   	} else {
   		if(sectionId === 'section3') {
    		clearInterval(automateSection3);
    	}
    	if(sectionId === 'section4') {
    		clearInterval(automateSection4);
    	}
   	}
	};

// IF NOT IN CMS ADMIN PREVIEW, PERPETUALLY CHECK IF WE ARE AT THE TOP OF THE PAGE AND IF SO, DONT SHOW THE FOOTER OR GREEN SHAPE. \\

	if(!$(location).attr('href').includes('index.php')) {
		setInterval(() => {
			if($('#scrollerWrapper').offset().top >= 0) {
				$('#headerShape, #footer').addClass('moveOffScreen');
				$('#video').get(0).play();
				$('.arrow').addClass('pulsate');
			} else {
				var timeout = setTimeout(() => {
					$('#headerShape, #footer').removeClass('moveOffScreen');
					$('#video').get(0).pause();
					$('.arrow').removeClass('pulsate');
					clearTimeout(timeout);
				}, time);
			}

// ROTATE THE ARROW IN THE FOOTER WHEN AT THE BOTTOM OF THE PAGE \\

			if($('#scrollerWrapper').offset().top < - (window.innerHeight * 4)) {
				$('#downArrow').css({'transform': 'rotate(180deg) translateX(-50%)'});
			} else {
				$('#downArrow').css({'transform': 'translateX(-50%) rotate(0deg)'});
			}

			hideLoadingAnimation();

// ADD LANDSCAPE STYLES TO RELEVANT ELEMENTS \\

			if(window.matchMedia("(orientation: landscape)").matches && window.innerWidth < 800) {
			  $('.nav_link, #headerShape, #footer, .custom, .marker, #section5, .textWrapper').addClass('landscape');
			} else {
				 $('.nav_link, #headerShape, #footer, .custom, .marker, #section5, .textWrapper').removeClass('landscape');
			}

			if($('#section3.active').length) { // AUTOMATE THE SLIDES ON SECTIOPN 3 EVERY 7 SECONDS IF THE SECTION IS ACTIVE. \\
				if(section3Automated !== true) {
					section3Automated = true;
					intervalManager(true, 'section3', 7000);
				}
			} else { // STOP AUTOMATED SLIDES ON SECTIOPN 3 IF THE SECTION IS NOT ACTIVE. \\
				if(section3Automated === true) {
					intervalManager(false, 'section3');
					section3Automated = false;
				}
			}

			if($('#section4.active').length) { // AUTOMATE THE SLIDES ON SECTIOPN 4 EVERY 7 SECONDS IF THE SECTION IS ACTIVE. \\
				if(section4Automated !== true) {
					section4Automated = true;
					intervalManager(true, 'section4', 7000);
				}
			} else { // STOP AUTOMATED SLIDES ON SECTIOPN 4 IF THE SECTION IS NOT ACTIVE. \\
				if(section4Automated === true) {
					intervalManager(false, 'section4');
					section4Automated = false;
				}
			}
		}, 500);
	}

// CONTROL WHAT HAPPENS WHEN LINKS IN THE NAV/MENU ARE CLICKED \\

	$('.nav_link').click((e) => {
		const pageIdx = parseInt($(e.target).attr('data-index'));
		$('#scrollerWrapper').moveTo(pageIdx);
		$('#menuBlockOut').addClass('hidden');

		if(burger.classList.contains('burger--active')) {
      nav.classList.remove('nav_open');
      burger.classList.remove('burger--active');
      document.body.style.position = 'relative';
    } 
	});

// WHEN THE NAV IS OPEN PREVENT USER FROM BEING ABLE TO CLICK ANYTHING ELSE \\

	$('#menuBlockOut').click((e) => {
	   e.stopPropagation();
	});

	var burger = document.getElementById('main-burger'), 
  nav = document.getElementById('mainNav');

// CONTROL FOR OPEN AND CLOSING THE MENU/NAV  \\

  function navControl() {

    if(burger.classList.contains('burger--active')) {
      nav.classList.remove('nav_open');
      burger.classList.remove('burger--active');
      $('#menuBlockOut').addClass('hidden');
    } 
    else {
      burger.classList.add('burger--active');
      nav.classList.add('nav_open');
      $('#menuBlockOut').removeClass('hidden');
    }
  }
  
// ONLY LISTEN FOR MENU CLICKS WHEN NOT IN CMS PREVIEW MODE \\

  if(!$(location).attr('href').includes('index.php')) {
  	burger.addEventListener('click', navControl);
  }

// CLOSE THE NAV IF THE WINDOW IS OVER 1000PX WIDE \\

  window.addEventListener('resize', function() {
    if(window.innerWidth > 1000 && nav.classList.contains('nav_open')) {
      navControl();
      nav.classList.remove('nav_open');
       $('#menuBlockOut').addClass('hidden');
    }
  });

// THIS SET OF IF STATEMENTS INITIALISES THE SPESIFIC PAGES FOR PREVIEWING IN CMS ADMIN. \\

  if($(location).attr('href').includes('index.php')) {
		if($(location).attr('href').includes('imagine-if')) {
			pageLoader(4);
		}
		if($(location).attr('href').includes('how-we-innovate')) {
			pageLoader(3);
		}
		if($(location).attr('href').includes('work-with-us')) {
			pageLoader(5);
		}
		if($(location).attr('href').includes('contact-us')) {
			pageLoader(6);
		}
		if($(location).attr('href').includes('home-video')) {
			setInterval(() => {
				hideLoadingAnimation();
			}, 500)
		}
	}

// SWIPE EVENTS DETECTOR FUNCTION \\

  function detectswipe(el, func) {
	  let swipe_det = {};
	  swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
	  var min_x = 30;  //min x swipe for horizontal swipe
	  var max_x = 30;  //max x difference for vertical swipe
	  var min_y = 50;  //min y swipe for vertical swipe
	  var max_y = 60;  //max y difference for horizontal swipe
	  var direc = "";
	  let ele = document.getElementById(el);
	  ele.addEventListener('touchstart',function(e){
	    var t = e.touches[0];
	    swipe_det.sX = t.screenX; 
	    swipe_det.sY = t.screenY;
	  },false);
	  ele.addEventListener('touchmove',function(e){
	    e.preventDefault();
	    var t = e.touches[0];
	    swipe_det.eX = t.screenX; 
	    swipe_det.eY = t.screenY;    
	  },false);
	  ele.addEventListener('touchend',function(e){
	    //horizontal detection
	    if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
	      if(swipe_det.eX > swipe_det.sX) direc = "r";
	      else direc = "l";
	    }
	    //vertical detection
	    else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
	      if(swipe_det.eY > swipe_det.sY) direc = "d";
	      else direc = "u";
	    }

	    if (direc != "") {
	      if(typeof func == 'function') func(el,direc);
	    }
	    let direc = "";
	    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
	  },false);  
	}

// CHOSE THE NEXT SLIDE TO SHOW AND CLICK THE PAGINATION BUTTON THAT RELATES TO IT. \\

	const swipeController = (el, d) => {

		if(el === 'section4') {

			const section4PaginationLength = $('.section4PaginatorButton').length;

			if(d === 'l') {

				if(section4Idx < section4PaginationLength - 1) {
					section4Idx++;
				} else {
					section4Idx = 0;
				}
				
				$('.section4PaginatorButton')[section4Idx].click();
			}
			if(d === 'r') {

				if(section4Idx > 0) {
					section4Idx--;
				} else {
					section4Idx = section4PaginationLength - 1;
				}

				$('.section4PaginatorButton')[section4Idx].click();
			}
		}
		if(el === 'section3') {

			const section3PaginationLength = $('.section3PaginatorButton').length;

			if(d === 'l') {

				if(section3Idx < section3PaginationLength - 1) {
					section3Idx++;
				} else {
					section3Idx = 0;
				}
				
				$('.section3PaginatorButton')[section3Idx].click();
			}
			if(d === 'r') {

				if(section3Idx > 0) {
					section3Idx--;
				} else {
					section3Idx = section3PaginationLength - 1;
				}
				
				$('.section3PaginatorButton')[section3Idx].click();
			}
		}
	}

// INITIATE FOR SWIPE DETECTION ON SECTIONS 3 AND 4 EXCEPT IN ADMIN PREVIEW. \\

	if(!$(location).attr('href').includes('index.php')) {
		detectswipe('section4', swipeController);
		detectswipe('section3', swipeController);
	}
});
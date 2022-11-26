let div = document.getElementById("divSadrzaj");
let object ={
	"studenti": [
		{
			"ime": "Neko Nekic",
			"index": 12345
		},
		{
			"ime": "Drugi Neko",
			"index": 12346
		}
	],
	"prisustva": [
		{
			"sedmica": 1,
			"predavanja": 2,
			"vjezbe": 2,
			"index": 12346
		},
		{
			"sedmica": 2,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 12346
		},
		{
			"sedmica": 3,
			"predavanja": 2,
			"vjezbe": 0,
			"index": 12345
		},
		{
			"sedmica": 4,
			"predavanja": 0,
			"vjezbe": 0,
			"index": 12345
		},
		{
			"sedmica": 5,
			"predavanja": 2,
			"vjezbe": 0,
			"index": 12345
		}
		,
		{
			"sedmica": 5,
			"predavanja": 0,
			"vjezbe": 2,
			"index": 12346
		},
		{
			"sedmica": 6,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 12346
		},
		{
			"sedmica": 7,
			"predavanja": 2,
			"vjezbe": 0,
			"index": 12345
		}
		,
		{
			"sedmica": 7,
			"predavanja": 2,
			"vjezbe": 2,
			"index": 12346
		}

		
		
	],
	"predmet": "Razvoj mobilnih aplikacija",
	"brojPredavanjaSedmicno": 3,
	"brojVjezbiSedmicno": 2
}



//instanciranje
let prisustvo = TabelaPrisustvo(div, object);
//pozivanje metoda
prisustvo.sljedecaSedmica();
prisustvo.prethodnaSedmica();


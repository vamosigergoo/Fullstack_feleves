namespace jateklepes_backend.Model
{
    public class JatekTer
    {
        public char[][] Palya { get; set; }
        public int KarakterSor { get; set; }
        public int KarakterOszlop { get; set; }

        public static JatekTer Parse(string jatekTerSzoveg)
        {
            string[] sorok = jatekTerSzoveg.Trim().Split('\n');
            int sorSzam = sorok.Length;
            if (sorSzam == 0)
            {
                throw new ArgumentException("A játéktér nem lehet üres.");
            }

            // Az első nem üres sor nem szóköz karaktereinek száma adja meg az oszlopszámot
            int oszlopSzam = sorok[0].Replace(" ", "").Length;
            char[][] palya = new char[sorSzam][];
            int karakterSor = -1;
            int karakterOszlop = -1;

            for (int i = 0; i < sorSzam; i++)
            {
                string aktualisSorSzokozNelkul = sorok[i].Replace(" ", "");
                if (aktualisSorSzokozNelkul.Length != oszlopSzam)
                {
                    throw new ArgumentException($"A(z) {i + 1}. sor hossza nem megfelelő (szóközök nélkül: {aktualisSorSzokozNelkul.Length}, elvárt: {oszlopSzam}).");
                }
                palya[i] = aktualisSorSzokozNelkul.ToCharArray();

                for (int j = 0; j < oszlopSzam; j++)
                {
                    if (palya[i][j] == 'X')
                    {
                        if (karakterSor != -1)
                        {
                            throw new ArgumentException("Egynél több kezdő karakter található a játéktéren.");
                        }
                        karakterSor = i;
                        karakterOszlop = j;
                    }
                }
            }

            if (karakterSor == -1)
            {
                throw new ArgumentException("A játéktér nem tartalmazza a karaktert ('X').");
            }

            return new JatekTer { Palya = palya, KarakterSor = karakterSor, KarakterOszlop = karakterOszlop };
        }
    }
}

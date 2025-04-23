using jateklepes_backend.Model;
using Microsoft.AspNetCore.Mvc;

namespace jateklepes_backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class JatekController : ControllerBase
    {
        [HttpPost("ellenorzes")]
        public ActionResult<LepesEllenorzesResponse> Ellenorzes(LepesEllenorzesRequest request)
        {
            try
            {
                JatekTer aktualisJatekTer = JatekTer.Parse(request.Jatekter);
                int felvettCoin = 0;
                char[][] palya = aktualisJatekTer.Palya;
                int sor = aktualisJatekTer.KarakterSor;
                int oszlop = aktualisJatekTer.KarakterOszlop;

                for (int i = 0; i < request.Lepesek.Length; i++)
                {
                    string lepes = request.Lepesek[i].ToUpper();
                    int ujSor = sor;
                    int ujOszlop = oszlop;

                    switch (lepes)
                    {
                        case "F":
                            ujSor--;
                            break;
                        case "L":
                            ujSor++;
                            break;
                        case "J":
                            ujOszlop++;
                            break;
                        case "B":
                            ujOszlop--;
                            break;
                        default:
                            return BadRequest(new LepesEllenorzesResponse { Uzenet = $"Érvénytelen lépés: {lepes}" });
                    }

                    if (ujSor < 0 || ujSor >= palya.Length || ujOszlop < 0 || ujOszlop >= palya[0].Length)
                    {
                        return BadRequest(new LepesEllenorzesResponse { Uzenet = "A karakter elhagyta a játéktér határait." });
                    }

                    char kovetkezoMezo = palya[ujSor][ujOszlop];

                    if (kovetkezoMezo == '¤')
                    {
                        // Karakter előző helyének kiürítése
                        if (palya[sor][oszlop] == 'X')
                        {
                            palya[sor][oszlop] = '.';
                        }

                        // Karakter ráállt a bombára -> jelezni kell a hibát
                        return Ok(new LepesEllenorzesResponse
                        {
                            Hiba = "bomba",
                            UjJatekTer = palya, // A pálya állapotát is küldjük, 'X' nélkül a bomba helyén
                            FelvettCoin = felvettCoin
                        });
                    }

                    if (kovetkezoMezo == 'C')
                    {
                        felvettCoin++;
                        // Coin leszedve, mezőt akkor is frissítjük majd
                    }

                    // Az előző helyre pontot rakunk, ha X volt ott
                    if (palya[sor][oszlop] == 'X')
                    {
                        palya[sor][oszlop] = '.';
                    }

                    palya[ujSor][ujOszlop] = 'X';


                    sor = ujSor;
                    oszlop = ujOszlop;
                }

                return Ok(new LepesEllenorzesResponse { UjJatekTer = palya, FelvettCoin = felvettCoin });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new LepesEllenorzesResponse { Uzenet = ex.Message });
            }
            catch (Exception ex)
            {
                // Logolhatjuk a hibát itt
                return StatusCode(500, new LepesEllenorzesResponse { Uzenet = "Szerver oldali hiba történt." });
            }
        }
    }
}

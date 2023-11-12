import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
const apiKEY = "89f5debbc317a7167bc61a3387199bc0";

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
  });

app.post("/post-city", async (req, res) => {
  const city = req.body.city;
  try {
    //Here i get the coordinates for the city that was requested.
    const resultCoordinates = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKEY}`);
    const latitude = resultCoordinates.data[0].lat;
    const longitude = resultCoordinates.data[0].lon;
  
    // Transform the coordinates into weather data
    const resultWeather = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKEY}&units=metric`);

    const tempNow= Math.round(JSON.stringify(resultWeather.data.list[0].main.temp));
    const tempIn12= Math.round(JSON.stringify(resultWeather.data.list[4].main.temp));
    const tempIn24= Math.round(JSON.stringify(resultWeather.data.list[8].main.temp));

    const feelsLikeNow = Math.round(JSON.stringify(resultWeather.data.list[0].main.feels_like));
    const feelsLikeIn12 = Math.round(JSON.stringify(resultWeather.data.list[4].main.feels_like));
    const feelsLikeIn24 = Math.round(JSON.stringify(resultWeather.data.list[8].main.feels_like));

    const weatherMainNow = resultWeather.data.list[0].weather[0].main;
    const weatherMainIn12 = resultWeather.data.list[4].weather[0].main;
    const weatherMainIn24 = resultWeather.data.list[8].weather[0].main;

    res.render("index.ejs",{
      tempNow:tempNow,
      tempIn12:tempIn12,
      tempIn24:tempIn24,

      feelsLikeNow:feelsLikeNow,
      feelsLikeIn12:feelsLikeIn12,
      feelsLikeIn24:feelsLikeIn24,

      weatherMainNow:weatherMainNow,
      weatherMainIn12:weatherMainIn12,
      weatherMainIn24:weatherMainIn24,

      city:city,
      
      
    });

  } catch (error) {
    const wrongCity = req.body.city;
    res.render("index.ejs",{
      wrongCity:wrongCity
    })
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
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
    const resultWeather = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKEY}`);
    const tempInK= JSON.stringify(resultWeather.data.list[0].main.temp);
    const tempinC = Math. round(tempInK-273.15);
    const feelsLikeInK = JSON.stringify(resultWeather.data.list[0].main.feels_like);
    const feelsLike = Math. round(feelsLikeInK-273.15);
    const weatherMain = resultWeather.data.list[0].weather[0].main;

    console.log(weatherMain);

    res.render("index.ejs",{
      tempInC:tempinC,
      city:city,
      feelsLike:feelsLike,
      weatherMain:weatherMain,
    });

  } catch (error) {
    console.log(error); 
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
import { useState ,useEffect} from 'react'

const Nav=()=>{
  return <nav>
      <a>Home</a>
      <a>Weekly Forecast</a>
      <a>About Us</a>
    </nav>
}


const Header = ()=> {
  const [navStat,setNavStat]=useState(false);
  
  return <>
  <header>
      <h1>Weather<button onClick={()=>setNavStat(!navStat)} id="navBtn">{navStat==false?"=":"×"}</button></h1>
  </header>
  {navStat && <Nav/>}
  </>
}

const Overview= ({location,temp,realFeel,status,aqi})=>{
  return <div id="overview">
  <h4>{location}</h4>
  <h2>{temp}°C</h2>
  <span>{status} {realFeel}°C</span>
  <span id="aqi">AQI {aqi}</span>
  </div>
}


const API_key="f674f6e89edc85e0fa4cfeb81ea09957";


const App = ()=> {
  const [data,setData]=useState({});
  const [geo,setGeo]=useState({lat:50,lon:50});
  const [geoStat,setGeoStat]=useState(false);
  const [error,setError]=useState(false);
  
  const getGeoLocation=()=>{
    return new Promise((resolve, reject)=>{
    
      if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>resolve(position.coords),reject);
  }
  else{reject()}
    })
  }
  
  useEffect(()=>{
  getGeoLocation().then((coords)=>{
    setGeo({lat:coords.latitude.toFixed(2),lon:coords.longitude.toFixed(2)});
    setGeoStat(true);
  },()=>{setError(true)})
  
  },[]);
 
  
  useEffect(()=>{

    if(geoStat){
    setTimeout(()=>fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&appid=${API_key}`).then(blob=>blob.json()).then(data=>setData(data)),1000)}
  },[geoStat]);

  

  return <>
  <Header />

  {data && Object.keys(data).length>0 && <Overview location={data.name} temp={(data.main.temp-273).toFixed(1)} realFeel={(data.main.feels_like-273).toFixed(1)} status={data.weather[0].description} aqi={200}/>}
  </>

}


export default App;

import React, { Component } from 'react';
import sunny from './sunny.png';
import cloudy from './cloudy.png';
import rainy from './rainy.png';
import snowy from './snowy.png';
import './App.css';

	function getDayOfWeek(number){
		switch(number){
			case 0:
				return "Mon";		
			case 1:
				return "Tue";
			case 2:
				return "Wed";
			case 3:
				return "Thu";
			case 4:
				return "Fri";
			case 5:
				return "Sat";
			case 6:
				return "Sun";
		}
		
	}
	function getMonth(number){
		
		 var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
	return monthNames[number];
		
	}
	function formatDate(date){
		return  getDayOfWeek(date.getDay()) + " " + date.getDate() +" of "+ getMonth(date.getMonth());

	}


class WeatherCard extends React.Component{
	
	render(){
		let logo;
		switch(this.props.conditions){
			case "Clear":
				logo = sunny;
			break;
			case "Clouds":
				logo = cloudy;
			break;
			case "Rain":
				logo = rainy;
			break;
			case "Snow":
				logo = snowy;
			break;
			
		}
		return (
		<div className="weatherCard">
			<p className="pDay">{this.props.day}</p>
			<img src={logo} className="logo" alt="logo" />
			<div className="temps">
				<p className="pMax">{this.props.tMax}&ordm;</p>
				<p className="pMin">{this.props.tMin}&ordm;</p>
			</div>
		</div>
		);
	}
}
class ListCards extends React.Component{

render(){
	return(
		<div className="listCards">
			{this.props.cards}
		</div>
	);
}
	
}


class ApiFetcher extends React.Component{

	constructor(){
		super();
		this.state = {
			temps:[]
		};
	}
	render(){
		
		return(
			<div>
				<p>{this.state.texto}
				</p>
			
			</div>
		);
		
	}

	
		//console.log(JSON.stringify(list));
			/*let i = 0;
			var values = '{"temps":[';
			for(let i=0;i<list.length;i++){ //cada iteracion (40)
				if(i === 0 || i % 8 === 0){ //para que coja una muestra solo cada día
					
					let tempMax = convertDegrees(list[i].main.temp_max);
					let tempMin = convertDegrees(list[i].main.temp_min);
					let conditions = list[i].weather[0].main;
					let day = list[i].dt_txt;
				
					var values = values.concat('{ "tempMax":'+tempMax+','+ '"tempMin":' +tempMin+',' + '"conditions":'+'"'+conditions+'"'+','+'"day":'+'"'+day+'"'+" },");
				
				}
				
			}
			values = values.slice(0,values.length-1);
			values = values.concat(']}');
			let obj = JSON.parse(values);
			this.setState({texto:obj});*/
	
	
	
	
	componentDidMount(){		
		fetch('http://api.openweathermap.org/data/2.5/forecast?q=Madrid,es&APPID=53a1b026e257f7c1b0c525381df43789')
		.then(results => {
			return results.json();
		}).then(data => {	
			let list = data.list;
		
			
			const temps = [];
			for(let i=0;i<list.length;i++){ 
				let temp_max = convertDegrees(list[i].main.temp_max);
				let temp_min = convertDegrees(list[i].main.temp_min);
				let conds = list[i].weather[0].main;
				temps.push({
					tempMax: temp_max,
					tempMin: temp_min,
					conditions: conds
				});
				
			
			}
			this.setState({temps:temps});
			
		})
	}
		
		
}

function convertDegrees(valNum) {
  valNum = parseFloat(valNum);
  return parseInt(valNum-273);
}






class App extends Component {
	
  
	constructor(){
		super();
		this.state = {
			cards:[]
		};
		
	}

	
	getCards(){
		fetch('http://api.openweathermap.org/data/2.5/forecast?q=Ibiza,es&APPID=53a1b026e257f7c1b0c525381df43789') //fetch data
		.then(results => {
			return results.json(); //getting json
		}).then(data => {	//parsing
			let list = data.list;
			
			let temps = [];
			let n= 0;
			
			for(let i=0;i<list.length;i=i+8){ 
				let temp_max = convertDegrees(list[i].main.temp_max);
				let temp_min = convertDegrees(list[i].main.temp_min);
				let conds = list[i].weather[0].main;
				let dayy = list[i].dt_txt;
				let d = new Date(dayy);
				dayy = formatDate(d);
			
				for(let j=i;j<(i+8);j++){
					
					let tempMaxCandidate = convertDegrees(list[j].main.temp_max);
					let tempMinCandidate = convertDegrees(list[j].main.temp_min);
					if(tempMaxCandidate > temp_max){
						temp_max = tempMaxCandidate;
					}
					if(tempMinCandidate < temp_min){
						temp_min = tempMinCandidate;
					}
				}
				temps.push({
					tempMax: temp_max,
					tempMin: temp_min,
					conditions: conds,
					day: dayy,
					n:n
				});	
				n++;
			}
			
			//creating components
			
			let cards = temps.map((temp) => 
				
				<WeatherCard 
					tMax={temp.tempMax}
					tMin={temp.tempMin}
					conditions={temp.conditions}
					day={temp.day}
					key={temp.n}
				/>
			);
			
			this.setState({cards:cards});
			
		})
		
	}
	componentDidMount(){		
		this.getCards();
		
	}
	
  render() {
    return (
      <div className="App">
		<ListCards
			cards={this.state.cards}
		/>
	  
      </div>
    );
  }
}

export default App;

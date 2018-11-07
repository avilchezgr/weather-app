import React, { Component } from 'react';

class ApiFetcher extends React.Component{

	constructor(){
		super();
	}
	componentDidMount(){
		fetch('api.openweathermap.org/data/2.5/weather?q=Madrid,es&APPID=53a1b026e257f7c1b0c525381df43789').
		then(results => {
			return results.json();
		}).then(data =>{
			let 
		}
	}

}
import React, { Component } from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import MainPage from './components/MainPage';


class App extends Component {
      render() {
            return (
                <div className="App">
                    <BrowserRouter>
                        <div>
                            <meta name="viewport" content="width=device-width, initial-scale=1"/>
                                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"/>
                                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"/>
                            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
                            <MainPage/>
                        </div>
                    </BrowserRouter>
                </div>
            );
      }
}

export default App;

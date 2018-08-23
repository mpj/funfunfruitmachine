import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from '@firebase/app'
import '@firebase/firestore'
import getRandomTopic from './helpers/get-random-topic'
import * as R from 'ramda'

var config = {
  apiKey: "AIzaSyCX4A0NB_OzmgYPLA3cTX0WyBqBse1432g",
  authDomain: "funfunfruitmachine.firebaseapp.com",
  databaseURL: "https://funfunfruitmachine.firebaseio.com",
  projectId: "funfunfruitmachine",
  storageBucket: "funfunfruitmachine.appspot.com",
  messagingSenderId: "230546969369"
}
firebase.initializeApp(config);

firebase.firestore().settings({ timestampsInSnapshots: true });

const topicTypes = {
  '1': 'tech',
  '2': 'idea',
  '3': 'restriction'
}
  
class App extends Component {
  constructor() {
    super()
    this.state = {
      randomizedTopics: {}
    }
  }
  randomize( topicTypeId ) {
    this.setState({
      randomizedTopics: {
        ...this.state.randomizedTopics,
        [topicTypeId]: 'RANDOMIZING'
      } 
    })
    getRandomTopic(firebase, topicTypeId)
      .then(topic => {
        this.setState({
          randomizedTopics: {
            ...this.state.randomizedTopics,
            [topic.type]: topic.value
          } 
        })
      })
  }
  componentDidMount() {
    Promise.resolve(topicTypes)
      .then( // Extract array of Ids from topicTypes
        x => Object.keys(x).map(x=> parseInt(x, 10)))

      .then( // load random topics for each id from firebase
        R.map(getRandomTopic.bind(null, firebase)))
      
      .then( // wait for all topics to load
        promises => Promise.all(promises))
      
      .then( // create a lookup table from topic type to text of randomized topic
        R.reduce((obj, topic) => {

          obj[topic.type] = topic.value
          return obj
        }, {}))
     
      .then( // put the lookup table in the state
        randomizedTopics => this.setState({ randomizedTopics })
      )
  }
  render() {
    return (
      <div className="App">
        {
          Object.keys(this.state.randomizedTopics)
            .map(x => parseInt(x, 10))
            .map(topicTypeId => 
              <div key={topicTypeId} onClick={() =>this.randomize(topicTypeId)}>
                {topicTypeId}: {this.state.randomizedTopics[topicTypeId]}
              </div>
            )
        }

      </div>
    );
  }
}
/*
{([ [1, 'tech'], [2, 'idea'], [3, 'restriction'] ])
.map(([topicTypeId, topicTypeName]) => 
  <div onClick={this.randomize(topicTypeId)}>
    {topicTypeName}: {this.state[topicTypeId].label}
  </div>
)
}*/ 


export default App;

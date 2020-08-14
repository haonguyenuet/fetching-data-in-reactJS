import React, { Component } from 'react';
import './App.css'

import Search from './components/search_component';
import List from './components/list_component';
import Button from './components/button_component';

import propTypes from 'prop-types'

import{
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from './constants/app_constant';

class App extends Component {
   
  constructor(props){
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
    // bind context
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
  }
  

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
    
  setSearchTopStories(newData){
    /*CATCHE FORMAT :
        results: {
          redux: {
          hits: [ ... ],
          page: 2,
          },
          react: {
          hits: [ ... ],
          page: 1,
          },
          ...
          }*/
    const {hits,page} = newData
    const {results,searchKey} = this.state
    
    const oldHits = (results && results[searchKey]) 
                    ? results[searchKey].hits
                    :[]

    const updateHits = [...oldHits, ...hits]

    this.setState({
      results: {
         ...results,
         [searchKey] :{ hits:updateHits, page }
      },     
      isLoading: false  
    })
  }
  fetchData(searchTerm,page=0){
    this.setState({isLoading: true})
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        return this.setSearchTopStories(data) 
      
      }) // data: {..,..,hits:[],..}  
      .catch(err => this.setState({error:err}))
  }
 
  componentDidMount(){
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm})
    this.fetchData(searchTerm);
  }
  onSubmit(event){
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm})
    
     // if searchTerm already exist then don't need to fetch again
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchData(searchTerm);
    }
      
    event.preventDefault();
  }

  onDismiss(id){
    const {results,searchKey} = this.state;
    const {hits, page} = results[searchKey]

    let updatedList = hits.filter(item => item.objectID !== id);
    this.setState({
        results: {
          ...results,
          [searchKey] : {hits : updatedList ,page}}
      // solution2 result : Object.assign({}, result, { hits: updatedList })
    })
  }

  onSearchChange(e){
    this.setState({
      searchTerm: e.target.value,
    })
  }
  render(){

      const {searchTerm,
            searchKey,
            results,
            error,
            isLoading
           } = this.state //ES6
      /* ES5: 
         const list = this.state.list; 
         const searchTerm = this.state.searchTerm
         ... */
      if(error){
        return (<p>{error.message}</p>)
      }
      
      // before feching data 
      const page = (results && results[searchKey] && results[searchKey].page) || 0
      const list = (results && results[searchKey] && results[searchKey].hits) || []
      return (
        <div className="page">
            <div className="interactions">
                <Search 
                    value={searchTerm} 
                    onChange={this.onSearchChange}
                    onSubmit ={this.onSubmit}
                >
                  Search
                </Search>
            </div>
            <List
                list={list}
                onDismiss={this.onDismiss}
             />
            <div className="interactions">
              {
                isLoading 
                ? <div className="loading loading-lg"></div>
                :<Button onClick={()=>this.fetchData(searchKey,page+1)}>
                    More
                </Button>
              }
            </div>
        </div>
      );
  }
}

List.propTypes = {
  list: propTypes.array.isRequired,
  onDismiss : propTypes.func.isRequired
}


export default App;

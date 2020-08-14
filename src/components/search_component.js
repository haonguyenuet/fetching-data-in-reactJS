import React,{Component} from 'react';

class Search extends Component{
   render(){
      const {searchTerm,onChange,onSubmit,children} = this.props
      return(
       <form onSubmit={onSubmit} className="input-group input-inline">
          <input 
               type="text" 
               value={searchTerm} 
               onChange={onChange} 
               className="form-input input-sm searchBox"
               placeholder="Type..."/>
          <button 
               className="btn btn-primary btn-sm searchBtn"
               type="submit"
          >
           {children}
          </button>
       </form>
      )
   }
 }
 

export default Search
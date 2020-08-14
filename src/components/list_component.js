import React,{Component} from "react";
import Button from "./button_component";
import { sortBy } from "lodash";

// function isSearched(searchTerm){
//     return function(item){
//       return item.title.toLowerCase().includes(searchTerm.toLowerCase())
//     }
// }

class List extends Component{

  constructor(props){
      super(props);
      this.state = {
        sortKey : 'none',
        isSortReverse: false
      }
      this.onSort = this.onSort.bind(this)
  }

  onSort(sortKey){
      var isSortReverse = (this.state.sortKey === sortKey) && !this.state.isSortReverse
       //  if the sortKey in the state is the same as the incoming sortKey => reserve
      this.setState({
          sortKey: sortKey,
          isSortReverse: isSortReverse
      })
  }
     
  render(){
    const {list,onDismiss} = this.props 
    const {sortKey,isSortReverse} = this.state
    
    
    const sortedList = (sortKey === 'none') ? list : sortBy(list,sortKey)
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList
    
    return(
        <table className="table table-striped table-hover my-2">
            <thead>
              <tr>
             <th>
                Title
                <SortBTN
                   sortKey='title'
                   onSort={this.onSort}
                >
                <i className="fas fa-sort"></i>
                </SortBTN>
             </th>
             <th>
                Author
                <SortBTN
                   sortKey='author'
                   onSort={this.onSort}
                >
                <i className="fas fa-sort"></i>
                </SortBTN>            
             </th>
             <th>
                Comments
                <SortBTN
                   sortKey='num_comments'
                   onSort={this.onSort}
                >   
                <i className="fas fa-sort"></i>
                </SortBTN>
             </th>
             <th>
                Points
                <SortBTN 
                   sortKey='points'
                   onSort={this.onSort}
                >
                <i className="fas fa-sort"></i>
                </SortBTN>
                
             </th>
             <th>
                Action      
             </th>
             </tr>
         </thead>
         <tbody>
            { reverseSortedList.map(item =>{
                return <tr key={item.objectID}>
                            <td>
                                <a href={item.url}>{item.title}</a>
                            </td>
                            <td >
                                {item.author}
                            </td>
                            <td>
                                {item.num_comments}
                            </td>
                            <td >
                                {item.points}
                            </td>
                            <td >
                                <Button 
                                    onClick= {()=> onDismiss(item.objectID)}
                                    className="button-inline"
                                >
                                <i className="fas fa-trash-alt"></i>
                                </Button>
                            </td>
                        </tr>
                    })                     
            }
         </tbody>
     </table>
    )
  }
}

class SortBTN extends Component{
    render(){
        const {onSort,sortKey,children} = this.props
        return(
            <Button 
                className="btn btn-link"
                onClick ={()=> onSort(sortKey)}
            >
             {children}
            </Button>
        )
    }
}

 export default List
import React,{Component} from 'react';


import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {

  maxId = 100;

  state = {
       todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Drink Coffee'),
    ],
    term: '',
    filter: 'active'
  };


  // создание элемента
  createTodoItem (label) {
    return{
    label,
    important: false,
    done:false,
    id: this.maxId++ 
  }
}
  // удаление элемента
  deleteItem = (id) =>{

    this.setState(({ todoData })=>{


      const idx = todoData.findIndex((el) => el.id === id);
      
      // [a,b,c,d,e]
      // [a,b,  d,e]
      const before = todoData.slice(0,idx);
      const after = todoData.slice(idx+1);

      const newArray = [...before,...after]
      return{
        todoData:newArray
      }
    })
  };
  
  addItem = (text) =>{
    const newItem = this.createTodoItem(text)


    this.setState(({ todoData }) =>{
      const newArray = [
        ...todoData,
        newItem
      ];

      return{
        todoData: newArray
      };
    });
  };
  

  toogleProperty(arr,id,propertyName){
    const idx = arr.findIndex((el) => el.id === id);

      const oldItem = arr[idx];
      const newItem = {...oldItem,[propertyName]:!oldItem[propertyName]};



      // на место удаленного элемента ставим newItem
      return [...arr.slice(0,idx),newItem,...arr.slice(idx+1)]
      
  }
  onToggleDone = (id) =>{
    this.setState(({todoData})=>{
      return{
        todoData:this.toogleProperty(todoData,id,'done')
      }
    });
  };
  onToggleImportant = (id) =>{
    this.setState(({todoData})=>{
      return{
        todoData:this.toogleProperty(todoData,id,'important')
      }
    });
  };
  search = (items,term) =>{
    if(term.length=== 0) {
      return items;
    }

   return items.filter((item) =>{
      return item.label.indexOf(term) > -1;
    })
  }
  onSearchChange = (term) =>{
    this.setState({ term });
  }
  onFilterChange = (filter) =>{
    this.setState({filter});
  }

  filter(items, filter){
    switch(filter){
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'done':
        return items.filter((item) => item.done);
      default:
        return items;
    }
  }
  render(){

    const {todoData,term, filter} = this.state


    const visibleItems = this.filter(this.search(todoData,term),filter)
    const doneCount = todoData.filter((el)=>el.done).length;
    const todoCount = todoData.length - doneCount
    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel 
          onSearchChange = {this.onSearchChange}/>
          <ItemStatusFilter 
          filter = {filter} 
          onFilterChange = {this.onFilterChange}/>
        </div>
  
        <TodoList 
        todos={visibleItems} 
        onDeleted ={this.deleteItem}
        onToggleDone = {this.onToggleDone}
        onToggleImportant = {this.onToggleImportant}/>
        <ItemAddForm
        onItemAdded = {this.addItem}/>
      </div>
    );
  }
}
 



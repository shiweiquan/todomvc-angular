import { Component } from '@angular/core';
import { doesNotThrow } from 'assert';

const todos = [
  {
    id: 1,
    title: '吃饭',
    done: true
  },
  {
    id: 2,
    title: '唱歌',
    done: false
  },
  {
    id: 3,
    title: '写代码',
    done: true
  },
  {
    id: 4,
    title: '跳舞',
    done: false
  }
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = JSON.parse(window.localStorage.getItem('todos') || '[]');
  // public filterTodos: {
  //   id: number,
  //   title: string,
  //   done: boolean
  // }[];
  public visibility: string = 'all';
  public currentEditing: {
    id: number,
    title: string,
    done: boolean
  } = null;

  // 实现导航切换数据过滤功能
  // 1. 提供一个属性,该属性会根据当前点击的链接返回过滤之后的数据
  // filterTodos
  // 2. 提供一个属性, 用来存储当前点击的链接标识
  // visibility 字符串
  // all  active  completed
  // 3. 为链接添加点击事件,当点击导航链接的时候,改变visibility 的值

  // 该函数是一个特殊的 Angular 生命周期钩子函数
  // 它会在 Angular 应用初始化的时候执行一次
  ngOnInit() {
    this.hashchangeHandler();
    // 这里要改变this的指向,否则hashchangeHandler 方法的this指向window
    window.onhashchange = this.hashchangeHandler.bind(this);
  }
  // 当 Angular 组件数据发生改变的时候 ngDoChick 钩子函数会被触发
  // 我们要做的就是在这个钩子函数中去持久化存储我们的todos 数据
  ngDoCheck() {
    window.localStorage.setItem('todos', JSON.stringify(this.todos));
  }


  addTodo(e) {
    const titleText = e.target.value;
    if (!titleText.length) {
      return;
    }
    const last = this.todos[this.todos.length - 1];
    this.todos.push({
      id: last ? last.id : 1 ,
      title: titleText,
      done:false
    })
    e.target.value = '';
  }
  get toggleAll() {
    return this.todos.every(t => t.done);
  }
  set toggleAll(val) {
    this.todos.forEach(t => t.done = val); 
  }
  removeTodo(index) {
    this.todos.splice(index, 1);
  }
  saveEdit(todo, e) {
    console.log(5)
    todo.title = e.target.value;
    this.currentEditing = null;
  }
  
  handleEditKeyUp(e) {
    const { keyCode, target } = e;
    if (keyCode == 27) {
      // 取消编辑
      // 同时把文本框的值恢复为原来的
      target.value = this.currentEditing.title;
      this.currentEditing = null;
    }
  }

  get remaningCount() {
    return this.todos.filter(t => !t.done).length;
  }
  clearAllDone() {
    this.todos = this.todos.filter(t => !t.done);
  }
   get filterTodos() {
    if (this.visibility === 'all') {
       return this.todos;
    } else if (this.visibility === 'active') {
      return this.todos.filter(t => !t.done);
    } else if (this.visibility === 'completed') {
      return this.todos.filter(t => t.done);
    }
   }
  hashchangeHandler() {
    let hash = window.location.hash.substr(1);
      // 当用户点击了锚点的时候,我们需要获取当前锚点的标识
      // 然后动态的将组件中的 visibility 设置为当前点击的锚点标识
      switch (hash) {
        case '/':
          this.visibility = 'all';
          break;
        case '/active':
          this.visibility = 'active';
          break;
        case '/completed':
          this.visibility = 'completed';
          break;
      }
  }
  }

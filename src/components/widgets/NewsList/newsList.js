import React, { Component } from 'react';
import { CSSTransition , TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';
import axios from 'axios';
import style from './newsList.css';
import Button from '../Buttons/buttons';
import CardInfo from '../CardInfo/cardInfo';

class NewsList extends Component{

    state ={
        teams:[],
        items:[],
        start: this.props.start,
        end: this.props.start + this.props.amount,
        amount: this.props.amount
    }
 
    componentWillMount(){
        this.request(this.state.start, this.state.end);
    }
    request =(start, end) =>{
        if(this.state.teams.length <1){
            axios.get(`http://localhost:3004/teams`)
            .then(res=>{
                this.setState({
                    teams:res.data
                });
            });

        }

        axios.get(`http://localhost:3004/articles?_start=${this.state.start}&_end=${this.state.end}`)
        .then(res =>{
            this.setState({
                items:[...this.state.items, ...res.data],
                start,
                end
            });
        });
    }

    loadMore=()=>{
        let end = this.state.end + this.state.amount;
        this.request(this.state.end, end);
    }


    renderNews =(type)=>{
        let template =null;
        switch(type){
         
            case('card'):
            template= this.state.items.map((item, i)=>(
                   <CSSTransition classNames={
                       {
                           enter:style.newsList_wrapper,
                           enterActive:style.newsList_wrapper_enter
                       }
                   }
                   timeout={500}
                   key={i}
                   >
                <div key={i}>
                    <div 
                        className={style.newslist_item}>
                        <Link to={`/articles/${item.id}`}>
                        <CardInfo teams={this.state.teams} team={item.team} date = {item.date}/>
                        <h2>{item.title}</h2>
                        </Link>
                    </div>
                </div>
                </CSSTransition>
            ))
            break;
            default:
            template = null;
        }
        return template;
    }

    render(){
      
        return (
        <div>
            <TransitionGroup component="div"
            className="list">
            {this.renderNews(this.props.type)}
            </TransitionGroup>

            <Button 
            type="loadmore"
            loadMore={()=>this.loadMore()}
            cta = "Load More News"
            
            />
            
        </div>
        );
    }

}

export default NewsList;
import { Injectable } from '@angular/core';
import { data } from '../models/data';
import { Board, Card } from '../models/board.model';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

/*
   Une class de type Service permet de partager du code entre les components

   Elle expose des data et des méthodes, que les components pourront consommer via le mécanisme d'injection de dépendance

   DI: https://angular.io/guide/dependency-injection
   
   Une utilisation courante des services est le partage de l'accès aux données de l'application via des metthodes accesseurs
*/

@Injectable()

export class BoardService {

  constructor() { }

  // On importe la donnée depuis /src/app/models/data
  private data:Board = data;

  /*
    On crée 2 subjects
    La particularité des subjects (librairie RxJs) est : 
    - On peut pousser une data en valeur 
    ( Syntaxe :  subject.next(data) )
    - On peut s'abonner à ce subject et réagir dès que la data change 
    ( Syntaxe : subject.subscribe() )

    Ce qui permet de mettre en place un système réactif entre les components, basé le changement de valeur d'une donnée.

    -> Si un component modifie la data 
    -> les autres component peuvent y réagir 
    (pour mettre à jour l'affichage lié à cette donnée par exemple)
  */
  private priorityCards$ = new BehaviorSubject<Card[]>(this.initializePriorityCards());
  private modalState$ = new Subject();

  /*
    Récupérer la data tableau
  */
  getBoard():Board {
    return this.data;
  }

  /*
  Ajouter une card au tableau
  */
  addCard(listId, cardTitle):void {
    let list = this.data.find(list => list.id == listId);
    list.cards = [ {id:Date.now(),title:cardTitle, content:'', priority:3}, ...list.cards ];
    this.setPriorityCards();
  }

  /*
    Supprimer une card du tableau
  */
  deleteCard(listId, cardId):void {
    let list = this.data.find(list => list.id == listId);
    console.log(list);
    let card = list.cards.find(card => card.id == cardId);
    console.log(card);
    let index = list.cards.indexOf(card);
    list.cards.splice(index, 1);
    this.setPriorityCards();
  }

  /*
    Mettre à jour une card
  */
  updateCard(listIndex, cardIndex, newCard):void {
   this.data[listIndex].cards[cardIndex] = newCard;
   this.setPriorityCards();
  }

  /*
    Ajouter une nouvelle liste
  */
  addList(listName):void {
    this.data.push({'id':Date.now(), 'name': listName , 'cards':[]});
  }

  /*
    Supprimer une liste
  */
  deleteList(listId):void {
    let list = this.data.find(list => list.id == listId);
    let index = this.data.indexOf(list);
    this.data.splice(index, 1);
    this.setPriorityCards();
  }

  /*
    Initialiser la liste des carte urgentes
    return : array of Card
  */
  initializePriorityCards():Card[] {
    let cards = [];
    for(let list of this.data){
      for(let card of list.cards) {
        if(card.priority === 1) {
          cards.push(card)
        }
      }
    }
    return cards;
  }

  /*
    mettre à jour le subject this.priorityCards$
   (un subject est capable de modifier la valeur qu'il contient avec la méthode .next())
  */
  setPriorityCards():void {
    let cards:Card[] = [];
    for(let list of this.data){
      for(let card of list.cards) {
        if(card.priority === 1) {
          cards.push(card);
        }
      }
    }
    this.priorityCards$.next(cards);
  }

  /*
    Récupérer le subject priorityCards$ 
    les components qui utilisent cette méthode pourront s'abonner au subject grâche à .subsribe()
    Ce qui aura pour effet de signaler au component tout changement de valeur du Subject
    grâce au principe de programmation réactive de RxJs
  */
  getPriorityCards() {
    return this.priorityCards$;
  }

  /*
    Setter l'état du modal qui affiche une cardId
    Param 1 : true or false
    Param 2 : card:Card
    (utilisé par component PriorityComponent)
  */
  setModalState(bool:boolean, card:Card):void {
    let state = {
      open: bool,
      card: card
    }
    this.modalState$.next(state)
  }

  /*
    return le subject du modalState
    un compoment pourra s'y abonner
    (utilisé par le component BoardComponent)
  */
  getModalState() {
    return this.modalState$;
  }


}
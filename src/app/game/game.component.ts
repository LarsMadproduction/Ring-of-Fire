import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import {
  Firestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  game: Game = new Game();
  firestore: Firestore = inject(Firestore);
  gamesCollection = collection(this.firestore, 'games');

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);
    });

    onSnapshot(this.gamesCollection, (snapshot) => {
      snapshot.docs.forEach((docSnapshot) => {
        let gameData: any = docSnapshot.data();
        let gameId: any = docSnapshot.id;
        doc(this.gamesCollection, gameId);
        this.game.players = gameData.players;
        this.game.stack = gameData.stack;
        this.game.playedCards = gameData.playedCards;
        this.game.currentPlayer = gameData.currentPlayer;
        this.game.pickCardAnimation = gameData.pickCardAnimation;
        this.game.currentCard = gameData.currentCard;
      });
    });
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGameData();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGameData();
      }, 1000);
    }
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGameData();
      }
    });
  }

  saveGameData() {
    onSnapshot(this.gamesCollection, (snapshot) => {
      snapshot.docs.forEach(async (docSnapshot) => {
        let gameId: string = docSnapshot.id;
        let gameDocRef = doc(this.firestore, 'games', gameId);
        try {
          await updateDoc(gameDocRef, this.game.toJson());
          console.log(`Game data for ${gameId} updated successfully.`);
        } catch (error) {
          console.error('Error updating document: ', error);
        }
      });
    });
  }
}

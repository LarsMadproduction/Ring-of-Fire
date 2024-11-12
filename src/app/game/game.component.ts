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
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

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
    PlayerMobileComponent,
    PlayerMobileComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  game: Game = new Game();
  firestore: Firestore = inject(Firestore);
  gameOver = false;
  gameId: string = '';

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      if (this.gameId) {
        const gameDocRef = doc(this.firestore, 'games', this.gameId);
        onSnapshot(gameDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const gameData: any = docSnapshot.data();
            this.game.players = gameData.players;
            this.game.playerImages = gameData.playerImages;
            this.game.stack = gameData.stack;
            this.game.playedCards = gameData.playedCards;
            this.game.currentPlayer = gameData.currentPlayer;
            this.game.pickCardAnimation = gameData.pickCardAnimation;
            this.game.currentCard = gameData.currentCard;
          } else {
            console.error('Das Spiel-Dokument wurde nicht gefunden.');
          }
        });
      } else {
        console.error('Keine gültige Spiel-ID in der URL gefunden.');
      }
    });
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
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
        this.game.playerImages.push('1.webp');
        this.saveGameData();
      }
    });
  }

  saveGameData() {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, 'games', this.gameId);

      updateDoc(gameDocRef, this.game.toJson())
        .then(() => {
          console.log(`Spielstand für ${this.gameId} erfolgreich gespeichert.`);
        })
        .catch((error) => {
          console.error('Fehler beim Speichern des Dokuments: ', error);
        });
    } else {
      console.error('Ungültige Spiel-ID, Speichern nicht möglich.');
    }
  }

  editPlayer(playerId: number) {
    let dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.saveGameData();
      }
    });
  }
}

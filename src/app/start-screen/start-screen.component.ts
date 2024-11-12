import { Component } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  constructor(private firestore: Firestore, private router: Router) {}
  newGame() {
    const game = new Game();
    addDoc(collection(this.firestore, 'games'), game.toJson())
      .then((docRef) => {
        // docRef.id enthält die automatisch generierte ID des neuen Dokuments
        this.router.navigateByUrl('/game/' + docRef.id);
      })
      .catch((error) => {
        console.error('Fehler beim Erstellen eines neuen Spiels:', error);
      });
  }
}

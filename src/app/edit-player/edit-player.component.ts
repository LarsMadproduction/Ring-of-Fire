import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss',
})
export class EditPlayerComponent {
  constructor(private dialogRef: MatDialogRef<EditPlayerComponent>) {}
  allPrfilePictures = [
    '1.webp',
    '2.png',
    'monkey.png',
    'winkboy.svg',
    'pinguin.svg',
  ];
  onNoClick() {
    this.dialogRef.close();
  }
}

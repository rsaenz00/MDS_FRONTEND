import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BlogService } from '../../../services/blog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Blog } from '../../../models/blog.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-mantblog',
  templateUrl: './mantblog.component.html',
  styleUrl: './mantblog.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule]
})

export class MantblogComponent implements OnInit {
  blogForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _blogService: BlogService,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<MantblogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Blog
  ) {
    this.blogForm = this._fb.group({
      id: [''],
      url: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.blogForm.patchValue(this.data);
  }
  
  onNoClick(): void {
    this._dialogRef.close();
  }

  openSnackBar(message: string, action: string = 'ok') {
    this._snackBar.open(message, action, {
      duration: 1000,
      verticalPosition: 'top',
    });
  }

  onFormSubmit() {
    if (this.blogForm.valid) {
      if (this.data) {
        this._blogService.updateBlog(this.blogForm.value).subscribe({
            next: (val: any) => {
              this.openSnackBar('Blog updated successfully');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._blogService.addBlog(this.blogForm.value).subscribe({
          next: (val: any) => {
            this.openSnackBar('Blog added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

}
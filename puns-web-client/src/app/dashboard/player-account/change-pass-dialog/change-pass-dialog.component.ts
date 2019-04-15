import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../security/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Utils} from '../../../shared/utils/utils';
import {AlertService} from 'ngx-alerts';
import {ChangePassRequest} from '../../../security/security.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-change-pass-dialog',
  templateUrl: './change-pass-dialog.component.html',
  styleUrls: ['./change-pass-dialog.component.css']
})
export class ChangePassDialogComponent implements OnInit {

  changePassForm: FormGroup;

  isOldPasswordHidden = true;

  isNewPasswordHidden = true;

  static create(dialog: MatDialog): MatDialogRef<ChangePassDialogComponent> {
    return dialog.open(ChangePassDialogComponent, {
      minWidth: '36vw'
    });
  }

  constructor(
    private auth: AuthService,
    fb: FormBuilder,
    private alert: AlertService,
    public dialogRef: MatDialogRef<ChangePassDialogComponent>) {
    this.createForm(fb);
  }

  ngOnInit() {
  }

  private createForm(fb: FormBuilder) {
    this.changePassForm = fb.group({
        oldPass: ['', Validators.required],
        newPass: ['', Validators.required]
    });
  }

  save() {
    if (this.changePassForm.valid) {
      const rq: ChangePassRequest = new ChangePassRequest(
        this.changePassForm.value.oldPass,
        this.changePassForm.value.newPass
      );
      this.auth.changePassword(rq).subscribe(
        () => {
          this.alert.success('Zmieniono hasło pomyślnie');
        },
        (err: HttpErrorResponse) => {
          console.log(err.error.message);
          if (err.error.message === 'PASSWORD_MISMATCH') {
            this.alert.danger('Błąd podczas zmiany hasła. Podane stare hasło nie jest zgodne z aktualnym');
          } else {
            this.alert.danger('Błąd podczas zmiany hasła');
          }
        });
      this.dialogRef.close();
    } else {
      Utils.markAllTouched(this.changePassForm);
    }
  }

}

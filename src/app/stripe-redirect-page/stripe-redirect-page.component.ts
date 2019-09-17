import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MessagesService} from '../services/messages.service';
import {StripeConnectionService} from '../services/stripe-connection.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {LoadingDialogComponent} from '../loading-dialog/loading-dialog.component';
import {updateStripeStatus} from '../store/platform.actions';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {isUserProfileLoaded, selectUser} from '../store/selectors';
import {isAnonymousUser} from '../models/user.model';
import {concatMap, filter, find, first, tap} from 'rxjs/operators';

@Component({
  selector: 'stripe-redirect-page',
  templateUrl: './stripe-redirect-page.component.html',
  styleUrls: ['./stripe-redirect-page.component.css']
})
export class StripeRedirectPageComponent implements OnInit {

  dialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private route: ActivatedRoute,
    private messages: MessagesService,
    private router: Router,
    private stripeConnectionService: StripeConnectionService,
    private dialog: MatDialog,
    private store: Store<AppState>) {

  }

  ngOnInit() {

    const scope = this.route.snapshot.queryParamMap.get('scope');

    const error = this.route.snapshot.queryParamMap.get('error');

    if (scope === 'read_write') {
      this.openWaitingDialog();
      this.handleStripeConnectionSuccessful();
    }
    else if (error) {
      this.handleStripeConnectionFailed(error);
    }
    else {
      this.messages.warn('An unknown Stripe reply was received, the Stripe connection is NOT active.');
      this.onStripeConnectionSuccessful();

    }

  }

  openWaitingDialog() {

    // prevents ExpressionChangedAfterItHasBeenCheckedError, it looks like Material dialogs currently cannot be opened when the page is refreshed
    setTimeout(() => {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.minWidth = '450px';
      dialogConfig.minHeight = '200px';
      dialogConfig.data = {message: 'Connecting to Stripe ...'};

      this.dialogRef = this.dialog.open(LoadingDialogComponent, dialogConfig);

    });

  }

  handleStripeConnectionSuccessful() {

    const authorizationCode = this.route.snapshot.queryParamMap.get('code');

    this.store
      .pipe(
        select(isUserProfileLoaded),
        first(isUserProfileLoaded => isUserProfileLoaded),
        concatMap(() => this.stripeConnectionService.initStripeConnection(authorizationCode))
      )
      .subscribe(
        () => {
          this.messages.info('Stripe connection successful, you are ready to start taking payments.');
          this.onStripeConnectionSuccessful();
        },
        err => {
          console.log('Could not initialize the Stripe connection', err);
          this.messages.error(`The Stripe connection attempt has failed.`);
          this.onStripeConnectionSuccessful();
        }
      );

  }

  handleStripeConnectionFailed(error: string) {

    const errorDescription = this.route.snapshot.queryParamMap.get('error_description');

    console.log('Could not retrieve Stripe credentials:', error);

    this.messages.error(`Error connecting to Stripe - ${errorDescription}`);

    this.onStripeConnectionSuccessful();

  }

  onStripeConnectionSuccessful() {

    this.store.dispatch(updateStripeStatus({isConnectedToStripe:true}));

    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.router.navigateByUrl('/courses');
  }


}

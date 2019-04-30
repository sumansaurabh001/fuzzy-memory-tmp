import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {PurchaseSession} from '../models/purchase-session.model';
import {readDocumentWithId} from '../common/firestore-utils';
import {TenantService} from './tenant.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {LoadingDialogComponent} from '../loading-dialog/loading-dialog.component';
import {PlanActivated} from '../store/user.actions';
import * as firebase from '../subscription/subscription.component';
import {filter, tap} from 'rxjs/operators';
import {MessagesService} from './messages.service';


@Injectable({
  providedIn: 'root' 
})
export class PurchasesService {

  waitingDialogRef: MatDialogRef<LoadingDialogComponent>;


  constructor(
    private afs: AngularFirestore,
    private tenant: TenantService,
    private dialog: MatDialog,
    private messages: MessagesService) {

  }

  listenForPurchaseUpdates(ongoingPurchaseSessionId: string): Observable<PurchaseSession> {
    return readDocumentWithId<PurchaseSession>(
      this.afs.doc(`schools/${this.tenant.id}/purchaseSessions/${ongoingPurchaseSessionId}`)
    );
  }

  /*
  *
  * Wait for a purchase to complete, and show a waiting dialog if necessary while waiting
  *
  *
  * */

  waitForPurchaseCompletion(ongoingPurchaseSessionId:string, completionMessage:string): Observable<PurchaseSession> {
    return this.listenForPurchaseUpdates(ongoingPurchaseSessionId)
      .pipe(
        tap(purchaseSession => {

          if (purchaseSession.status == 'ongoing' && !this.waitingDialogRef) {

            // prevents ExpressionChangedAfterItHasBeenCheckedError, it looks like Material dialogs currently cannot be opened when the page is refreshed
            setTimeout(() => {

              const dialogConfig = new MatDialogConfig();

              dialogConfig.autoFocus = true;
              dialogConfig.disableClose = true;
              dialogConfig.minWidth = '450px';
              dialogConfig.minHeight = '200px';
              dialogConfig.data = {message: 'Purchase ongoing, please wait ...'};

              this.waitingDialogRef = this.dialog.open(LoadingDialogComponent, dialogConfig);

            });

          }

          if (purchaseSession.status == 'completed' && this.waitingDialogRef) {
            this.waitingDialogRef.close();
            this.messages.info(completionMessage);
          }

          if (purchaseSession.status == 'completed' && !this.waitingDialogRef) {
            this.messages.info(completionMessage);
          }


        }),
        filter(purchaseSession => purchaseSession.status == 'completed')
      );

  }


}

import {Injectable} from '@angular/core';
import {Observable, of, from} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {concatMap, first, map, withLatestFrom} from 'rxjs/operators';
import {findUniqueMatchWithId, readDocumentWithId} from '../common/firestore-utils';
import {AngularFireAuth} from '@angular/fire/auth';
import {Tenant} from '../models/tenant.model';
import {DEFAULT_SCHOOL_ACCENT_COLOR, DEFAULT_SCHOOL_PRIMARY_COLOR} from '../common/ui-constants';
import {SubscriptionContent} from '../models/content/subscription-content.model';
import {DEFAULT_FAQS, DEFAULT_SUBSCRIPTION_BENEFITS} from './default.content';
import {HomePageContent} from '../models/content/home-page-content.model';
import {TenantSettings} from '../models/tenant-settings.model';


@Injectable()
export class TenantsDBService {


  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth) {

  }

  createTenantIfNeeded(email: string, pictureUrl:string, displayName:string): Observable<Tenant> {
    return this.findTenantByCurrentUid()
      .pipe(
        withLatestFrom(this.afAuth.authState),
        concatMap(([tenant, authState]) => {

          if (!authState) {
            return of(undefined);
          }

          if (tenant) {
            return of(tenant);
          }
          else {

            const newTenant = {
              id: authState.uid,
              email,
              status: 'new',
              supportEmail: email,
              brandTheme: {
                //default brand colors
                primaryColor: DEFAULT_SCHOOL_PRIMARY_COLOR,
                accentColor: DEFAULT_SCHOOL_ACCENT_COLOR
              },
              totalEmailsCollected: 0
            };

            const newSchoolUser = {
              id: authState.uid,
              email,
              pictureUrl,
              displayName
            };

            const batch = this.afs.firestore.batch();

            const schoolUserRef = this.afs.doc(`schools/${authState.uid}/users/${authState.uid}`).ref;
            batch.set(schoolUserRef, newSchoolUser);

            const tenantRef = this.afs.doc(`tenants/${authState.uid}`).ref;
            batch.set(tenantRef, newTenant);

            // the tenant is also an admin in its own website
            const tenantSettingsRef = this.afs.doc(`tenantSettings/${authState.uid}/userPermissions/${authState.uid}`).ref;
            batch.set(tenantSettingsRef, {isAdmin:true});

            // set default tenant website content
            const defaultSubscriptionContent: SubscriptionContent = {
              subscriptionBenefits: DEFAULT_SUBSCRIPTION_BENEFITS,
              faqs: DEFAULT_FAQS
            };

            const subscriptionContentRef = this.afs.doc(`schools/${authState.uid}/content/subscription`).ref;
            batch.set(subscriptionContentRef, defaultSubscriptionContent as any);

            const defaultHomePageContent: HomePageContent = {
              pageTitle: 'Click the Edit Header button below to edit this title and add a background',
              pageTitleColor: "#ffffff ",
              benefits: [
                {
                  title: 'Hover with the mouse to edit this benefit',
                  description:'Enter the text benefit description here'
                },
                {
                  title: 'Hover with the mouse to edit this benefit',
                  description:'Enter the text benefit description here'
                },
                {
                  title: 'Hover with the mouse to edit this benefit',
                  description:'Enter the text benefit description here'
                }
              ]
            };

            const homePageContentRef = this.afs.doc(`schools/${authState.uid}/content/home-page`).ref;
            batch.set(homePageContentRef, defaultHomePageContent as any);

            return from(batch.commit().then(() => newTenant));
          }
        })
      );
  }

  findTenantByCurrentUid(): Observable<Tenant> {
    return this.afAuth.authState
      .pipe(
        concatMap(authState => {
          if (!authState) {
            return of(undefined);
          }
          return readDocumentWithId(this.afs.doc('tenants/' + authState.uid));

        })
      );
  }

  findTenantById(tenantId:string) {
    return this.afs.doc<Tenant>(`tenants/${tenantId}`).valueChanges()
      .pipe(
        first()
      );
  }


  findTenantBySubdomain(subDomain: string): Observable<Tenant> {

    let query$ = this.afs
      .collection<Tenant>('tenants', ref => ref.where('subDomain', '==', subDomain).limit(1));

    return findUniqueMatchWithId(query$).pipe(first());
  }


  saveTheme(tenantId: string, primaryColor:string, accentColor:string) : Observable<any> {

    return from(this.afs.collection('tenants').doc(tenantId).update({brandTheme:{primaryColor, accentColor}}));

  }

  findCustomSubDomain(subDomain: string) {
    return this.afs.collection<Tenant>(`tenants`, ref => ref.where("subDomain", '==', subDomain)).valueChanges()
      .pipe(
        map(results => results.length == 1 ? results[0]: null),
        first()
      );
  }

  updateTenant(tenantId:string, changes: Partial<Tenant>): Observable<void> {
    return from(this.afs.doc(`tenants/${tenantId}`).update(changes));
  }

  loadTenantPrivateSettings(tenantId:string): Observable<TenantSettings> {
    return readDocumentWithId<TenantSettings>(this.afs.doc(`tenantSettings/${tenantId}`)).pipe(first());
  }

  updateTenantSettings(tenantId:string, changes: Partial<TenantSettings>): Observable<void> {
    return from(this.afs.doc(`tenantSettings/${tenantId}`).update(changes));
  }

}









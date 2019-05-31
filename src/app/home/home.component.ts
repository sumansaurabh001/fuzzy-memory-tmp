import {Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {EditHomeDialogComponent} from '../edit-home-dialog/edit-home-dialog.component';
import {HomePageContent} from '../models/content/home-page-content.model';
import {select, Store} from '@ngrx/store';
import {selectContent} from '../store/content.selectors';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store';
import {EditTitleDescriptionDialogComponent} from '../edit-title-description-dialog/edit-title-description-dialog.component';
import {filter, tap} from 'rxjs/operators';
import {HomePageContentUpdated} from '../store/content.actions';
import {UserPermissions} from '../models/user-permissions.model';
import {isLoggedIn, isLoggedOut, selectUserPermissions} from '../store/selectors';
import {minimalEditorConfig} from '../common/html-editor.config';
import {EMPTY_IMG} from '../common/ui-constants';
import {setSchoolNameAsPageTitle} from '../common/seo-utils';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homePageContent$: Observable<HomePageContent>;

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  editModeEnabled = false;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private title:Title) {

  }

  ngOnInit() {

    setSchoolNameAsPageTitle(this.store, this.title);

    this.homePageContent$ = this.store.pipe(select(selectContent('homePage')));

    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut));

    this.store.pipe(select(selectUserPermissions))
      .subscribe(permissions => this.editModeEnabled = permissions && permissions.isAdmin);

  }

  editPageHeader(content: HomePageContent) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '550px';

    this.dialog.open(EditHomeDialogComponent, dialogConfig);

  }

  onBenefitEdited(content: HomePageContent, benefitIndex: number) {

    const benefit = content.benefits[benefitIndex];

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '550px';

    dialogConfig.data = {
      dialogTitle: 'Edit Headline',
      title: benefit.title,
      description: benefit.description,
      editorConfig: minimalEditorConfig
    };

    this.dialog.open(EditTitleDescriptionDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        filter(val => !!val),
        tap(val => {

          const newContent = {
            ...content,
            benefits: content.benefits.slice(0)
          };

          newContent.benefits[benefitIndex] = {
            title: val.title,
            description: val.description
          };

          this.store.dispatch(new HomePageContentUpdated({content: newContent}));

        })
      )
      .subscribe();

  }


  homeBannerStyles(content: HomePageContent) {
    if (content.bannerImageUrl) {
      return {
        'background-image': "url('" + content.bannerImageUrl  + "')"
      };
    }
    else {
      return {
        'background-color': 'rgb(186, 190, 192)'
      };
    }
  }

  calculateTitleStyles(content: HomePageContent) {
      return {
        color: content.pageTitleColor
      }
  }

  onSignupClicked() {
    const button: HTMLBaseElement = document.querySelector("#loginButton");
    button.click();
  }
}

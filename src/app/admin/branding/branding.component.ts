import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {DEFAULT_SCHOOL_ACCENT_COLOR, DEFAULT_SCHOOL_PRIMARY_COLOR} from '../../common/ui-constants';
import {ColorPickerDirective} from 'ngx-color-picker';
import {MessagesService} from '../../services/messages.service';
import {AppState} from '../../store';
import {select, Store} from '@ngrx/store';
import {checkIfPlatformSite} from '../../common/platform-utils';
import {getTenant, platformState} from '../../store/selectors';
import {tap} from 'rxjs/operators';
import {SaveTheme, ThemeChanged} from '../../store/platform.actions';


const isHexColorRegex  = /^#[0-9A-F]{6}$/i;


@Component({
  selector: 'branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit {

  primaryColor:string = DEFAULT_SCHOOL_PRIMARY_COLOR;

  accentColor:string = DEFAULT_SCHOOL_ACCENT_COLOR;

  @ViewChild('primaryPicker', {read: ColorPickerDirective})
  primaryPicker: ColorPickerDirective;

  @ViewChild('accentPicker', {read: ColorPickerDirective})
  accentPicker: ColorPickerDirective;



  constructor(
    private messages: MessagesService,
    private store: Store<AppState>) {

  }

  ngOnInit() {

    this.store
      .pipe(
        select(getTenant),
        tap(tenant => {
          this.primaryColor = tenant.primaryColor;
          this.accentColor = tenant.accentColor;
        })
      )
      .subscribe();

  }


  openPrimaryPicker() {
    this.primaryPicker.openDialog();
  }


  openAccentPicker() {
    this.accentPicker.openDialog();
  }


  saveBrandColors() {

    if (! isHexColorRegex.test(this.primaryColor)) {
      this.messages.error("Invalid primary color, please choose a valid color.");
      return;
    }

    if (! isHexColorRegex.test(this.accentColor)) {
      this.messages.error("Invalid accent color, please choose a valid color.");
      return;
    }

    const payload = {
      primaryColor: this.primaryColor,
      accentColor: this.accentColor
    };

    if (!checkIfPlatformSite()) {
      this.store.dispatch(new ThemeChanged(payload));
    }

    this.store.dispatch(new SaveTheme(payload));

    this.messages.success('New theme saved successfully.');

  }



}

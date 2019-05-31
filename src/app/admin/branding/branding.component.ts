import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {DEFAULT_SCHOOL_ACCENT_COLOR, DEFAULT_SCHOOL_PRIMARY_COLOR} from '../../common/ui-constants';
import {ColorPickerDirective} from 'ngx-color-picker';
import {MessagesService} from '../../services/messages.service';
import {AppState} from '../../store';
import {select, Store} from '@ngrx/store';
import {checkIfPlatformSite} from '../../common/platform-utils';
import {getBrandTheme, platformState} from '../../store/selectors';
import {filter, tap} from 'rxjs/operators';
import {SaveTheme, ThemeChanged} from '../../store/platform.actions';
import {setSchoolNameAsPageTitle} from '../../common/seo-utils';
import {Title} from '@angular/platform-browser';


const isHexColorRegex  = /^#[0-9A-F]{6}$/i;


@Component({
  selector: 'branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit {

  primaryColor:string;

  accentColor:string;

  @ViewChild('primaryPicker', { read: ColorPickerDirective, static: false })
  primaryPicker: ColorPickerDirective;

  @ViewChild('accentPicker', { read: ColorPickerDirective, static: false })
  accentPicker: ColorPickerDirective;



  constructor(
    private messages: MessagesService,
    private store: Store<AppState>,
    private title: Title) {

  }

  ngOnInit() {

    this.store
      .pipe(
        select(getBrandTheme),
        filter(theme => !!theme),
        tap(theme => {

          this.primaryColor = theme.primaryColor;
          this.accentColor = theme.accentColor;
        })
      )
      .subscribe();

    setSchoolNameAsPageTitle(this.store, this.title);

  }

  onPrimaryColorChanged(color:string) {
    this.primaryColor = color;
  }

  onAccentColorChanged(color: string) {
    this.accentColor = color;
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
  }


}

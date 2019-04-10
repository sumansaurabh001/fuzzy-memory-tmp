import {MarketingBenefit} from './marketing-benefit.model';


export interface HomePageContent {
  pageTitle?:string;
  bannerImageUrl?:string;
  bannerFileName?:string;
  logoImageUrl?:string;
  logoFileName?:string;
  benefits?: MarketingBenefit[];
}

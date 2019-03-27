import {MarketingBenefit} from './marketing-benefit.model';


export interface HomePageContent {
  pageTitle?:string;
  bannerImageUrl?:string;
  logoImageUrl?:string;
  benefits?: MarketingBenefit[];
}

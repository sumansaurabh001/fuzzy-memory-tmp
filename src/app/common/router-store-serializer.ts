import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';

/**
 *
 * @see https://github.com/ngrx/platform/blob/8e93328c076820599da179a53d042cdada37a0bf/example-app/app/shared/utils.ts
 *
 * this is needed to prevent the redux dev tools from freezing and crashing due to performance issues, as well as
 * allowing ngrx-store-freeze to work with the ngrx-router.
 *
 */

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomRouterStateSerializer
  implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const { url, root: { queryParams } } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}

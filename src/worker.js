import { handle } from '@astrojs/cloudflare/handler';

import {
  getMigrationRedirectLocation,
  PERMANENT_REDIRECT_STATUS,
} from './worker/migration-redirects.js';

export default {
  fetch(request, env, context) {
    const redirectLocation = getMigrationRedirectLocation(request.url);

    if (redirectLocation) {
      return Response.redirect(redirectLocation, PERMANENT_REDIRECT_STATUS);
    }

    return handle(request, env, context);
  },
};

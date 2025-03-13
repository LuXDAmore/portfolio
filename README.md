# Install

> "pnpm" is used in this repository for its workspace functionality

```bash

    pnpm install -r

```

You're done.

## Portals

To run the portals, you need to copy the correct ".env" file from it's folder "env" to the root of the portal:

Example:

> For "fallimenti", copy the file `/apps/fallimenti/env/.env.development` to `/apps/fallimenti/.env`.

## Https

Projects run localhost over https protocol, the certifications are already provided, but you must install ["mkcert"](https://github.com/FiloSottile/mkcert):

```bash

    mkcert -install

```

## Scripts

```bash

    # Photography
    pnpm -r photography:dev
    pnpm -r photography:build
    pnpm -r photography:test # Run dei test del progetto

    # Optimizer
    pnpm -r optimizer:test
    pnpm -r optimizer:dev
    pnpm -r optimizer:build
    pnpm -r optimizer:prepack

    # Stylesheets
    pnpm -r stylesheets:test
    pnpm -r stylesheets:dev
    pnpm -r stylesheets:compile

    # NX
    pnpm nx:graph # See NX graph dependencies

    # Miscellaneous (**da finire/completare**)
    pnpm check:projects # Run all the build-scripts from every project to check that everything work as expected
    pnpm clean:projects # Clean the cache from every project
    pnpm lint:fix # Lint all the files in every project at once

```

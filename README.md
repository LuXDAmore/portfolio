# Install

> "pnpm" is used in this repository for its workspace functionality [here](https://pnpm.io/installation)

Install the dependencies:

```bash

    pnpm install

```

You're done.

## Portals

To run the portals, you need to copy the correct ".env" file from it's folder "env" to the root of the portal:

Example:

> Copy the file `/env/.env.development` to `/.env`.

## Https

Projects run localhost over https protocol, the certifications are already provided, but you must install ["mkcert"](https://github.com/FiloSottile/mkcert):

```

    winget install mkcert # or choco install mkcert

    mkcert -install
    mkcert -key-file certificates/server.key.pem -cert-file certificates/server.cert.pem localhost 127.0.0.1 ::1

```

## Scripts

```bash

    # Commands
    pnpm dev
    pnpm build
    pnpm start
    pnpm generate

    pnpm test # Run dei test del progetto

    # Miscellaneous
    pnpm prepare # Run all the build-scripts from every project to check that everything work as expected
    pnpm clean # Clean the cache from every project
    pnpm lint:fix # Lint all the files in every project at once with auto-fix

```

## Commit

We follow conventional commits, you can use this cheatsheet to help you:
[Commit Cheatsheet Summary](https://www.conventionalcommits.org)
[Commit Cheatsheet Cheatsheet](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)

## Releases

To bump and update the versions of the packages, with a related backup, use:

```bash

    pnpm release:patch # Release a patch version
    pnpm release:minor # Release a minor version
    pnpm release:major # Release a major version

```

> Every release created automatically update the `CHANGELOG.md` file automatically using "auto-changelog" package, it also keep a backup of the older versions (into the folder `release`) and release the last version as a zip file (see `release/latest.zip`).

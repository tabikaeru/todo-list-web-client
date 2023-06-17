# todo-list-web-client 


## Contribute

The commit message should refer to the following
```
# ==== Emojis ====
# 🐛  :bug: Bug Fixes
# 💄  :lipstick: Design Fixes
# ✨  :sparkles: Function addition
# 🎉  :tada: A major addition that should be celebrated in a big way.
# ♻️  :recycle: Refactoring
# 💩  :poop: Deletion of unneeded or no longer used functions
# 💚  :green_heart: Fix and improve testing and CI
# 👕  :shirt: Fix Lint errors and correct code styles
# 🚀  :rocket: Performance Improvement
# 📦  :package: Update dependent packages, etc.
# 🔒  :lock: Limit the scope of disclosure of new features
# 👮  :cop: Security-related improvements
# 💡  :bulb: Documentation revision/improvement
# 🥚  :egg: Additional Easter Eggs

# ==== Format ====
# :emoji: Subject
#
# Commit body...
```

## Get started
```
pnpm i
```

### RunTime

Runtime version of Node is 18, and the package management tool is pnpm.

```
Node v18.15.0
pnpm 8.6.1
```

### Launch

The following command will start the application on `localhost:3000`.

```
pnpm dev
```

### Project Structure
Most of the code lives in the `src` folder and looks like this:

```sh
src
|
+-- components        # shared components used across the entire application
|
+-- features          # feature based modules
|
+-- routes            # routes configuration
|
+-- utils             # shared utility functions
```

In order to scale the application in the easiest and most maintainable way, keep most of the code inside the `features` folder, which should contain different feature-based things. Every `feature` folder should contain domain specific code for a given feature. This will allow you to keep functionalities scoped to a feature and not mix its declarations with shared things. This is much easier to maintain than a flat folder structure with many files.

A feature could have the following structure:

```sh
src/features/awesome-feature
|
+-- services    # utility functions for a specific feature
|
+-- components  # components scoped to a specific feature
|
+-- pages       # root components for a specific feature pages
|
+-- types       # typescript types for TS specific feature domain
|
+-- index.ts    # entry point for the feature, it should serve as the public API of the given feature and exports everything that should be used outside the feature
```

Everything from a feature should be exported from the `index.ts` file which behaves as the public API of the feature.

You should import stuff from other features only by using:

`import {AwesomeComponent} from "~/features/awesome-feature"`

and not

`import {AwesomeComponent} from "~/features/awesome-feature/components/AwesomeComponent`
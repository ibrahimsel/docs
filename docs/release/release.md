---
id: release
title: Release Process
sidebar_label: Release Process
sidebar_position:  50
---

## Preparing a release

The following steps shall be done before the "Creating a Release" section.

1. Create an isssue containing tasks for getting the main branch ready:
    2. Execute tests on the supported targets.
    3. Make sure there are no security warnings of Github dependabot.
2. Finish all tasks inside the issue.
3. Build the release branch and make sure there are no error.
4. Execute tests and make sure there are no error.
5. Create release

## Creating a Release
1. Navigate to GitHub repository's **Releases** section
2. Click **"Draft a new release"** button
3. In the release creation interface:
   - **Target**: Select the pre-developed `release development branch` (e.g., `release-x.y.z`)
   - **Tag**: Create a new release tag in the "Choose a tag" section
      - Follow semantic versioning (e.g., `v1.0.0`, `v1.1.2`)
4. Github Actions will automatically:
   - Build the release
   - Run unittests and generate coverage report
   - Generate manifest.toml for Eclipse Manifest.
   - Attach them to the release


### Release notes

The release notes are generated automatically with the GitHub web frontend by clicking on the `Generate release notes` button. 
The procedure uses the filters for pull request labels configured inside `.github/release.yml`.

### Review Release notes
Review the auto-generated notes. Add a brief summary highlighting major changes, breaking changes, or features relevant to the end-user.

## Release development branches

To stabilize an upcoming release or prepare for a release, a development release branch should be created before final release.

### Branch Naming Convention:
```text
release-<major>.<minor>.<patch>
```
For example release-0.1.0

## Release workflow

For release a tagged branch a workflow exists inside `.github/workflows/release.yml`.
The release workflow uses the build and test coverage workflow from `.github/workflows/colcon-build.yml` and `muto-coverage.yml`.

This allows to avoid having to duplicate the steps of the build workflow into the release workflow
and thus have a single point of change for the build workflow.

The release workflow executes the build workflow, exports the build artifacts into an archive for each supported platform and uploads it to the GitHub release.

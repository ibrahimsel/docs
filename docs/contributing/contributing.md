---
id: contributing
title: Contributing
sidebar_label: Contributing
sidebar_position:  40
---

## Contributing to LiveUI

You want to be part of the LiveUI team? Thanks a lot, there are many ways that anyone can help!

Please review this document to make the contribution process open and available to everyone.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

1. [Code Of Conduct](#code-of-conduct)
2. [Questions](#questions)
3. [Bug Reports](#bug-reports)
4. [Pull Request](#pull-request)
5. [Testing](#testing)
6. [Styleguide](#styleguide)
7. [Collaborating Guidelines](#collaborating-guidelines)

### Code of Conduct

Read and follow our [LiveUI Code of Conduct](/docs/code-of-conduct). Please report unacceptable behavior to [info@composiv.com](mailto:info@composiv.com).

### Questions

Do not open issues for general support questions as we want to keep GitHub issues for bug reports and feature requests. You've got much better chances of getting your question answered on dedicated support platforms, the best being [Stack Overflow](https://stackoverflow.com/questions/tagged/liveui).

## Bug Reports

An bug is a demonstrable problem caused by the code in the repository. Good bug reports are very useful for the community. Thank you!

Often you should open a problem in the following situations:
- To report an error that you cannot solve
- To discuss a high-level topic or idea (for example, community, vision or policies)
- To suggest a new feature or other project idea

Guidelines for bug reports:

1.  **Use the GitHub issue search** &mdash; check if the [issue](https://github.com/composiv/liveui/issues) has already been reported.

2.  **Check if the issue has been fixed** &mdash; try to reproduce it using the latest `master` or development branch in the repository.

3.  **Isolate the problem** &mdash; ideally create a reduced test case  example.

4.  **Use the bug report template** &mdash; 
please fill in the template below when you open a new issue.

Please try to be as detailed as possible in your report. What is your environment? What steps will reproduce the issue? What browser(s) and OS experience the problem? What would you expect to be the outcome? All these details will help people to fix any potential bugs.

Example:

> ## Description
> A clear and concise description of what the bug is.
>
>All information about the problem you want to share or reported. This may include lines of code that you identify as causing the error and potential solutions (and your views on their benefits).
>
> ## Steps to reproduce
> Steps to reproduce the behavior:
>
> 1.  This is the first step
> 2.  This is the second step
> 3.  Further steps, etc.
>
>
> **Expected behavior**
>
> A clear and concise description of what you expected to happen.
>
> **Screenshots**
>
> If applicable, adding screenshots will help to explain your problem.
>
> ## Versions
>
> - React/React Native:
> - Node/NPM:
> - Browser:
> 

## Feature Request

Your feature requests are accepted. However, take a few moments to find out if your idea is suitable for the scope and objectives of LiveUI. Please provide as much detail and context as possible to convince the developers of the project on the merits of this feature.


## Pull Request
You love using an open source project, but you think some of its features missing? You can fork the code and add these features. This will benefit both you and the community using the project.

You should usually open a pull request in the following situations:

- To send junk fixes (such as a typo, a broken link, or an open error)
- When you start working for a contribution that has already been asked or discussed in a subject

**1. Fork**
    
First, Let's fork our GitHub project:

> Fork allows you to clone a project on GitHub to your account.

**2.  Clone**

Clone the project which you forked to your GitHub account to your computer.

    git clone <project-url>

**3.  Branch**

Our first rule is to divide every business into branches.
Our second rule will be to pay attention to our reference branch.

    git checkout master
    git checkout -b <new branch name>

> If our branch name is descriptive about the work we will do, it will provide convenience to you in future use. For example email-events etc.

**4. Pull Request (PR)**  

> We only open PR once for a branch, when we update our branch, the PR we open is also updated.

After we commit the changes, we can now push.

    git push origin <new branch name>

**5. Review**

Other contributors will review your work to add your changes to the project; will request or approve changes.

> The PR you open does not need to be accepted. Someone else might have already done a job you did or will have done and turned on the PR. Therefore, it is useful to look at previously opened PRs.

### Testing

When you made changes in our repositories [LiveUI Core](/docs/liveui-core), [LiveUI React](/docs/liveui-react) or [LiveUI React Native](/docs/liveui-react-native) ; you can run `npm test` and see the coverage inside the libraries. For integrating the coverage, try to follow the [Jest JavaScript Testing Framework](https://jestjs.io/).

## Styleguide

### JavaScript Styleguide

Generally follow the [JavaScript Standard Style](https://standardjs.com/).

## Collaborating Guidelines

You can find the list of all contributors in [README.md](./README.md).

There are few basic rules to ensure high quality of the LiveUI:

- Before merging, a PR requires at least two approvals from the collaborators unless it's an architectural change, a large feature, etc. If it is, then at least 50% of the core team have to agree to merge it, with every team member having a full veto right. 
- A PR should remain open for at least two days before merging (does not apply for trivial contributions like fixing a typo). This way everyone has enough time to look into it.

You are always welcome to discuss and propose improvements to this guideline.
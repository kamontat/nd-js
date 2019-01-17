<a name="unreleased"></a>
## [Unreleased]


<a name="2.0.0-beta.3"></a>
## [2.0.0-beta.3] - 2019-01-18
### Features
- add new version release to security

### Fixes Bug
- admin password always be wrong
- tmp file already exist
- temp directory is not created

### Improving User Experience
- improve security code and variable name
- admin version should be different


<a name="2.0.0-beta.2"></a>
## [2.0.0-beta.2] - 2019-01-17

<a name="2.0.0-beta.1"></a>
## [2.0.0-beta.1] - 2019-01-17
### Features
- add upgrade and download progressbar

### Fixes Bug
- the temp file isn't save to temp folder
- install with specify version error

### Improving User Experience
- improve upgrade version flow
- add end message
- add color to log level


<a name="2.0.0-alpha.1"></a>
## [2.0.0-alpha.1] - 2019-01-17
### Documentation
- update changelog and loc files
- Update example help, add update
- Make document to class interface ([#25](https://github.com/kamontat/nd-js/issues/25))

### Features
- make security disable on development workflow
- add build number to version command

### Fixes Bug
- fix version tag is not create on all
- location variable not signed
- cannot pass change option in update
- Fix local not copy admin files
- Fix with-build error in local (Dev)
- Fix switch name nd and nd-admin
- Fix install script as local bug
- Fix information type
- Fix unknown admin version
- Fix deployment script (Dev)
- Fix version update increase
- download error because novel is undefined

### Improving User Experience
- change version in exist in loc behave
- new normalize name for /
- change color of important and add new color
- make more readable text on history and changes
- improve CHANGELOG format and title
- make noTransform and noValidator to be default
- include username to resource file
- add more colors contrants
- make chapter list easier to understand
- default directory of update command is in config
- Add --json to set-config command
- now, can input multiple update location


<a name="1.0.1"></a>
## [1.0.1] - 2019-01-07
### Improving User Experience
- Integrate yarn script with deployment script
- Add --push-tag to deployment


<a name="1.0.0-rc.3"></a>
## [1.0.0-rc.3] - 2018-11-23
### Fixes Bug
- Fix build error

### Improving User Experience
- Make building depend on node 10


<a name="1.0.0-rc.2"></a>
## [1.0.0-rc.2] - 2018-11-22
### Documentation
- Remove Badge MIT out
- Add license scanner

### Fixes Bug
- Remove unused lib
- Fix build error in pkg v4.3.4


<a name="1.0.0-rc.0"></a>
## [1.0.0-rc.0] - 2018-11-07
### Documentation
- Add new help command

### Features
- The update will update when 1. chapter reopen or not sold 2. has changes
- novel is updatable
- Add fetching from location and server
- Add date to the chapter too
- Add date in old novel (version 1)
- Able to load information from resource file

### Fixes Bug
- Fix fetching location error
- Fix wrong param to display Date

### Improving User Experience
- Add RC release to deployment
- Add improvement of version in token
- Improve new security of nd command
- Add log error without exit
- Now you can fetch multiple id/location
- Update chapter output
- Avoid too many create object for printer
- Change the way to save chapter in novel
- Update the way to save chapter date
- Update error result in production
- History should sort by date (present => past)


<a name="1.0.0-beta.3"></a>
## [1.0.0-beta.3] - 2018-11-04
### Documentation
- Update document to most of Model

### Features
- Add resource file to the novel folder
- Add history of novel and chapter
- Add no internet connection error [fix] Fix error of private staff in novel

### Fixes Bug
- Fix lib version
- Fix CI error
- Fix forgot to update path in resource type

### Improving User Experience
- Add history and resource object (WIP)
- Update help command color
- Move printer out of model
- Improve test in CI
- Implement more about History (WIP)

### Pull Requests
- Merge pull request [#18](https://github.com/kamontat/nd-js/issues/18) from kamontat/improve/novel/history


<a name="1.0.0-beta.2"></a>
## [1.0.0-beta.2] - 2018-10-23
### Documentation
- Add LOC for each version

### Features
- Add validator command and more
- Add new output to download and fix report error
- New output now support in raw download
- Add --raw and --file to init, to setting token and username
- Add token generator and security update
- Add Token verify code
- Implement JWT in app token
- Add --raw to config path
- Add warning and error on the end of script too
- Add resource file JSON format
- Add resource model

### Fixes Bug
- Fix deployment script
- Fix duplicate version in LOC
- Fix changelog to next tag
- Fix error when deploy new version
- Fix the way to release new version
- username has space in CI
- Fix all error test
- Fix checking type error
- Fix typo of username output
- Fix verify error, not jwt id
- Fix args not found
- Typo
- Fix chapter list only completed chapter
- Fix the way how to check the exception
- Fix novel not normalize as expected
- novel name should be back
- Fix config not found

### Improving User Experience
- Remove verbose log, because it log in file
- Change default level to verbose
- Change output color
- Update logger, no debug + verbose in console
- Update UI color and add --with-chapter to fetch
- Add clickable link instead of long link
- Add log for sold, closed and unknown chapter
- Add --with-chapter to log result the chapter
- Add exception summary to raw-download
- Add short story in novel v1
- Add OG to html file
- Change title if chapter name not exist


<a name="v1.0.0-beta.1"></a>
## [v1.0.0-beta.1] - 2018-10-04
### Features
- Add download novel command ([#13](https://github.com/kamontat/nd-js/issues/13))


<a name="v1.0.0-beta.0"></a>
## [v1.0.0-beta.0] - 2018-10-04
### Documentation
- Change codeclimate to codecov
- Add fixme

### Features
- Completed fetching novel

### Fixes Bug
- Fix circle typo
- Remove fixme, create chapters support v1

### Improving User Experience
- Add fetch command with verbose output
- Complete build novel method
- Improve novel builder usage
- Not analytic test code

### Pull Requests
- Merge pull request [#10](https://github.com/kamontat/nd-js/issues/10) from kamontat/enhance/fetch


<a name="v1.0.0-alpha.1"></a>
## [v1.0.0-alpha.1] - 2018-09-28
### Documentation
- Update title
- Add readme badge

### Features
- Download now support multiple chapter
- Fully customize novel content
- Able to get content from html file
- Working on Decode and reformat the novel content

### Fixes Bug
- Fix ci error
- Fix error if config folder not found
- Fix config not found

### Improving User Experience
- Update meta in html file
- Add download improvement
- Add warning message

### Pull Requests
- Merge pull request [#1](https://github.com/kamontat/nd-js/issues/1) from kamontat/renovate/configure


<a name="1.0.0-alpha.0"></a>
## 1.0.0-alpha.0 - 2018-09-23
### Documentation
- Add TODO document

### Features
- Add deploy script
- Add config, initial, setup logger (WIP)
- Update new code design
- Update 2nd time
- Setup project and change name

### Fixes Bug
- Fix libraires missing
- make clean before deploy

### Improving User Experience
- ignore docs file in master branch
- Add jsdoc configuration
- Remove minify script since we use webpack
- Add a lot of improvement
- Add logger improvement


[Unreleased]: https://github.com/kamontat/nd-js/compare/2.0.0-beta.3...HEAD
[2.0.0-beta.3]: https://github.com/kamontat/nd-js/compare/2.0.0-beta.2...2.0.0-beta.3
[2.0.0-beta.2]: https://github.com/kamontat/nd-js/compare/2.0.0-beta.1...2.0.0-beta.2
[2.0.0-beta.1]: https://github.com/kamontat/nd-js/compare/2.0.0-alpha.1...2.0.0-beta.1
[2.0.0-alpha.1]: https://github.com/kamontat/nd-js/compare/1.0.1...2.0.0-alpha.1
[1.0.1]: https://github.com/kamontat/nd-js/compare/1.0.0-rc.3...1.0.1
[1.0.0-rc.3]: https://github.com/kamontat/nd-js/compare/1.0.0-rc.2...1.0.0-rc.3
[1.0.0-rc.2]: https://github.com/kamontat/nd-js/compare/1.0.0-rc.0...1.0.0-rc.2
[1.0.0-rc.0]: https://github.com/kamontat/nd-js/compare/1.0.0-beta.3...1.0.0-rc.0
[1.0.0-beta.3]: https://github.com/kamontat/nd-js/compare/1.0.0-beta.2...1.0.0-beta.3
[1.0.0-beta.2]: https://github.com/kamontat/nd-js/compare/v1.0.0-beta.1...1.0.0-beta.2
[v1.0.0-beta.1]: https://github.com/kamontat/nd-js/compare/v1.0.0-beta.0...v1.0.0-beta.1
[v1.0.0-beta.0]: https://github.com/kamontat/nd-js/compare/v1.0.0-alpha.1...v1.0.0-beta.0
[v1.0.0-alpha.1]: https://github.com/kamontat/nd-js/compare/1.0.0-alpha.0...v1.0.0-alpha.1

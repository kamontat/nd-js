<a name="unreleased"></a>
## [Unreleased]


<a name="v1.0.0-beta.2"></a>
## [v1.0.0-beta.2] - 2018-10-23
### 1) Features
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

### 2) Improving User Experience
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

### 3) Fixes Bug
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

### 4) Documentation
- Add LOC for each version

### 5) Code Refactoring
- Refactor code
- Move command from action folder
- Remove log in console
- Update exception to avoid error on normal throw
- Call method as promise chain
- Clean HTML code
- Make downloader as sequence by promise
- refactor download novel api and helper
- Refactor save method

### 6) Libraries
- Add new command helper
- Add Inquirer, prompt and fix ^ in package


<a name="v1.0.0-beta.1"></a>
## [v1.0.0-beta.1] - 2018-10-04
### 1) Features
- Add download novel command ([#13](https://github.com/kamontat/nd-js/issues/13))

### 5) Code Refactoring
- Resolve conflict


<a name="v1.0.0-beta.0"></a>
## [v1.0.0-beta.0] - 2018-10-04
### 1) Features
- Completed fetching novel

### 2) Improving User Experience
- Add fetch command with verbose output
- Complete build novel method
- Improve novel builder usage
- Not analytic test code

### 3) Fixes Bug
- Fix circle typo
- Remove fixme, create chapters support v1

### 4) Documentation
- Change codeclimate to codecov
- Add fixme

### 5) Code Refactoring
- Update code more readable
- Clean color parsing code
- Refactor color model and how to use it
- Update function 1 line
- Clean checker code

### Pull Requests
- Merge pull request [#10](https://github.com/kamontat/nd-js/issues/10) from kamontat/enhance/fetch


<a name="v1.0.0-alpha.1"></a>
## [v1.0.0-alpha.1] - 2018-09-28
### 1) Features
- Download now support multiple chapter
- Fully customize novel content
- Able to get content from html file
- Working on Decode and reformat the novel content

### 2) Improving User Experience
- Update meta in html file
- Add download improvement
- Add warning message

### 3) Fixes Bug
- Fix ci error
- Fix error if config folder not found
- Fix config not found

### 4) Documentation
- Update title
- Add readme badge

### 5) Code Refactoring
- Update unclear variable name
- Remove unuse code
- Update attribute function and variable name
- Change const name to have prefix

### 6) Libraries
- Add npm version to auto increase version
- Add jest ts-jest to package.json
- Add jest testing lib

### Pull Requests
- Merge pull request [#1](https://github.com/kamontat/nd-js/issues/1) from kamontat/renovate/configure


<a name="1.0.0-alpha.0"></a>
## 1.0.0-alpha.0 - 2018-09-23
### 1) Features
- Add deploy script
- Add config, initial, setup logger (WIP)
- Update new code design
- Update 2nd time
- Setup project and change name

### 2) Improving User Experience
- ignore docs file in master branch
- Add jsdoc configuration
- Remove minify script since we use webpack
- Add a lot of improvement
- Add logger improvement

### 3) Fixes Bug
- Fix libraires missing
- make clean before deploy

### 4) Documentation
- Add TODO document

### 6) Libraries
- Add jsdoc and gh-pages libraries
- Add gitgo command


[Unreleased]: https://github.com/kamontat/nd-js/compare/v1.0.0-beta.2...HEAD
[v1.0.0-beta.2]: https://github.com/kamontat/nd-js/compare/v1.0.0-beta.1...v1.0.0-beta.2
[v1.0.0-beta.1]: https://github.com/kamontat/nd-js/compare/v1.0.0-beta.0...v1.0.0-beta.1
[v1.0.0-beta.0]: https://github.com/kamontat/nd-js/compare/v1.0.0-alpha.1...v1.0.0-beta.0
[v1.0.0-alpha.1]: https://github.com/kamontat/nd-js/compare/1.0.0-alpha.0...v1.0.0-alpha.1

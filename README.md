# docker-crawlee-test
Steps to normal run:
1. run "npm run start"
2. "_this.logger.log('Unreachable line during dockerized execution');_" line reached after run, and we will see output string in console log

Steps to run with issue:
1. run "docker build ."
2. run "docker run \<sha256 or name-of-build\>"
3. Run freezes at "_await this.crawler.run(...);_" line, and nothing to see in console log

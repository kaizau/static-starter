### Git Deploy Instructions

```
# Remote
mkdir production.git
cd production.git
git init --bare
printf "#!/bin/sh\n" >> hooks/post-receive
printf "GIT_WORK_TREE=/home/public git checkout -f\n" >> hooks/post-receive
chmod +x hooks/post-receive

# Local
mkdir ../public
printf 'gitdir: ../_deploy/deploy.git' > ../source/.git
git init --git-dir=deploy.git --work-tree=../public
git remote add production ssh://user@host:/path/to/production.git
```

### S3 / Cloudfront Asset Instructions

TODO

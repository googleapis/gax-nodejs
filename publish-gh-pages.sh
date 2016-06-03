#!/bin/sh

original_branch=`git branch | grep '^\*' | sed -e 's/^\* //'`

remote_name=`git remote -v | grep 'git@github.com:googleapis/gax-nodejs.git' | sed -e 's/[[:space:]].*//' | head -n 1`
if [ -z "${remote_name}" ]; then
  # TODO: avoid conflict in case the remote setting already has the same name but a different
  # remote. 
  git remote add gh-pages-push 'git@github.com:googleapis/gax-nodejs.git'
  remote_name='gh-pages-push'
fi

# re-generate the doc files.
npm run doc

git checkout -b gh-pages "${remote_name}/gh-pages"

if [ $? != 0 ]; then
  echo "can't switch to gh-pages branch. Might be some files exist."
  exit 0
fi

cp -rf doc/google-gax/*/* .

diffs=`git diff`

if [ -z "${diffs}" ]; then
  echo 'nothing to be updated!'
  exit 0
fi

echo "git diffs: "
echo "$diffs"

git commit -a -m "update gh-pages"
git push ${remote_name} gh-pages

echo "done"
git checkout "${original_branch}"

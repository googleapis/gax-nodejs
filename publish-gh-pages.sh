#!/bin/sh

original_branch=`git branch | grep '^\*' | sed -e 's/^\* //'`
dry_run_command=''

if [ "$1" = "-n" -o "$1" = "--dry_run" ]; then
  dry_run_command='echo'
fi

remote_name=`git remote -v | grep 'git@github.com:googleapis/gax-nodejs.git' | sed -e 's/[[:space:]].*//' | head -n 1`
if [ -z "${remote_name}" ]; then
  # TODO: avoid conflict in case the remote setting already has the same name but a different
  # remote. 
  git remote add gh-pages-push 'git@github.com:googleapis/gax-nodejs.git'
  remote_name='gh-pages-push'
fi

# re-generate the doc files.
npm run doc

if [ $? -ne 0 ]; then
  ehco "failed to generate the documents. Quiting..."
  exit 1
fi

if [ -n "${dry_run_command}" ]; then
  echo "dry-run mode: the following commands will be executed."
  echo ""
fi

$dry_run_command git checkout -b gh-pages "${remote_name}/gh-pages"

if [ $? -ne 0 ]; then
  echo "failed to switch to the branch. Quitting..."
  exit 1
fi

$dry_run_command cp -rf doc/google-gax/*/* .

if [ -z "${dry_run_command}" ]; then
  diffs=`git diff`

  if [ -z "${diffs}" ]; then
    echo 'nothing to be updated!'
    exit 0
  fi

  echo "git diffs: "
  echo "$diffs"
fi

$dry_run_command git commit -a -m "update gh-pages"
$dry_run_command git push ${remote_name} gh-pages

echo "done"
$dry_run_command git checkout "${original_branch}"

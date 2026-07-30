#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${TARGET_REPO:-}" ]]; then
  echo "TARGET_REPO is required" >&2
  exit 1
fi

if [[ -z "${TARGET_DOMAIN:-}" ]]; then
  echo "TARGET_DOMAIN is required" >&2
  exit 1
fi

if [[ -z "${WEBSITE_DEPLOY_TOKEN:-}" ]]; then
  echo "WEBSITE_DEPLOY_TOKEN is required" >&2
  exit 1
fi

SOURCE_DIR_INPUT="${1:-out}"
TARGET_BRANCH="${TARGET_BRANCH:-main}"

if [[ ! -d "$SOURCE_DIR_INPUT" ]]; then
  echo "Source directory '$SOURCE_DIR_INPUT' does not exist" >&2
  exit 1
fi

SOURCE_DIR="$(cd "$SOURCE_DIR_INPUT" && pwd -P)"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT

TARGET_DIR="$TEMP_DIR/target"
REPO_URL="https://x-access-token:${WEBSITE_DEPLOY_TOKEN}@github.com/${TARGET_REPO}.git"

git clone "$REPO_URL" "$TARGET_DIR"
git -C "$TARGET_DIR" checkout "$TARGET_BRANCH"

find "$TARGET_DIR" -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf {} +
rsync -a --delete --exclude ".git" "$SOURCE_DIR"/ "$TARGET_DIR"/
printf "%s\n" "$TARGET_DOMAIN" > "$TARGET_DIR/CNAME"
touch "$TARGET_DIR/.nojekyll"

git -C "$TARGET_DIR" config user.name "${GIT_AUTHOR_NAME:-github-actions[bot]}"
git -C "$TARGET_DIR" config user.email "${GIT_AUTHOR_EMAIL:-41898282+github-actions[bot]@users.noreply.github.com}"

if [[ -z "$(git -C "$TARGET_DIR" status --porcelain)" ]]; then
  echo "No changes to publish for ${TARGET_REPO}"
  exit 0
fi

git -C "$TARGET_DIR" add -A
git -C "$TARGET_DIR" commit -m "Publish domain placeholder"
git -C "$TARGET_DIR" push origin "HEAD:${TARGET_BRANCH}"

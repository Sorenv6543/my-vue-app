#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
    echo "Error: Please provide a commit message."
    exit 1
fi

# Add all changes, commit with message, and push to origin
git add .
git commit -m "$1"
git push origin

echo "Changes have been added, committed, and pushed to origin!"

#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env File Not Found"
  exit 1
fi

# Check if MongoDB is installed
if ! command -v mongosh &> /dev/null; then
  echo "MongoDB could not be found. Please install it and try again."
  exit 1
fi

# Define MongoDB connection string
MONGO_CONNECTION_STRING="mongodb://localhost:27017/"
MONGO_DIRECTORY="./mongo/ordo/lts"

# Define database name
DB_NAME="1962Ordo"

# Define collections
COLLECTIONS="Universal Locale Prayers"

# Drop database
mongosh $MONGO_CONNECTION_STRING --eval "use 1962Ordo" --eval  "db.dropDatabase()"

# Import JSON files into the Universal and Locale collections
for COLLECTION in $COLLECTIONS
do
  for FILE in $(ls $MONGO_DIRECTORY/$COLLECTION)
  do
    case "$FILE" in
      *.json)
        echo "Importing $FILE into $COLLECTION"
        mongoimport --uri $MONGO_CONNECTION_STRING --db "1962Ordo" --collection $COLLECTION --file "$MONGO_DIRECTORY/$COLLECTION/$FILE"
        ;;
    esac
  done
done

# Create indexes
mongosh $MONGO_CONNECTION_STRING --eval 'db.Universal.createIndex({"year": 1})'
mongosh $MONGO_CONNECTION_STRING --eval 'db.Locale.createIndex({"country": 1})'
mongosh $MONGO_CONNECTION_STRING --eval 'db.Prayers.createIndex({"language": 1})'

# Export data seed
mongodump --uri="$MONGO_CONNECTION_STRING" --db="1962Ordo" --archive=db.dump
ssh -i ~/.ssh/id_rsa -t ubuntu@51.89.148.95 'mongosh $MONGO_CONNECTION_STRING --eval "use 1962Ordo" --eval  "db.dropDatabase()"'
ssh -i ~/.ssh/id_rsa -t ubuntu@51.89.148.95 'mongorestore --authenticationDatabase admin -u '$MONGO_USER' -p '$MONGO_PASS' --archive' < db.dump
ssh -i ~/.ssh/id_rsa -t ubuntu@51.89.148.95 'rm ./db.dump'
rm ./db.dump

# TODO: Update the Website Files (?) - Only The Webpacked Angular Files
# TODO: Update My Website
# TODO: Line To Add In Development Websites
# TODO: Update API and index.ts
# TODO: Add a check to see if the data was imported successfully

echo "!!!!! Remember to Update Robots.txt and Sitemap.xml !!!!!"
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
        mongoimport --uri $MONGO_CONNECTION_STRING --db "1962Ordo" --collection $COLLECTION --file "$MONGO_DIRECTORY/$COLLECTION/$FILE"
        ;;
    esac
  done
done

# Create indexes
mongosh $MONGO_CONNECTION_STRING --eval 'db.Universal.createIndex({"year": 1})'
mongosh $MONGO_CONNECTION_STRING --eval 'db.Locale.createIndex({"country": 1})'
mongosh $MONGO_CONNECTION_STRING --eval 'db.Prayers.createIndex({"language": 1})'

# ! DEPRECATED: Legacy Import
mongoimport --uri $MONGO_CONNECTION_STRING --db "1962Ordo" --collection "LocaleV1.3" --file "./mongo/ordo/v1.3/locale.json"
mongoimport --uri $MONGO_CONNECTION_STRING --db "1962Ordo" --collection "PrayersV1.3" --file "./mongo/ordo/v1.3/prayers.json"
for FILE in $(ls ./mongo/ordo/v1.3/Ordo)
do
  mongoimport --uri $MONGO_CONNECTION_STRING --db "1962Ordo" --collection "OrdoV1.3" --file "./mongo/ordo/v1.3/ordo/$FILE"
done
mongosh $MONGO_CONNECTION_STRING --eval 'db.OrdoV1.3.createIndex({"Year": 1})'

# Start Website
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR/../..
npm start
import { NoteService } from "../features/notes/services/noteService.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDbNoteRepository } from "../features/notes/repository/dynamoDbNoteRepository.js";

const tableName = process.env.NOTES_TABLE_NAME;

if (!tableName) {
  throw new Error("NOTES_TABLE_NAME environment variable is not set");
}

console.log("DYNAMODB_ENDPOINT:", process.env.DYNAMODB_ENDPOINT);
console.log("NOTES_TABLE_NAME:", process.env.NOTES_TABLE_NAME);

const dynamoEndpoint = process.env.DYNAMODB_ENDPOINT;

const dynamoClient = new DynamoDBClient({
  region: "eu-west-1",

  ...(dynamoEndpoint
    ? {
        endpoint: dynamoEndpoint,
        credentials: {
          accessKeyId: "dummy",
          secretAccessKey: "dummy",
        },
      }
    : {}),
});

const client = DynamoDBDocumentClient.from(dynamoClient);

const repository = new DynamoDbNoteRepository(client, tableName);
const noteService = new NoteService(repository);

export { noteService };

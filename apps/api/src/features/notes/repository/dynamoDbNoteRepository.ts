import type { Note } from "../types/noteTypes.js";
import type { NoteRepository } from "./noteRepository.js";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  //DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

export class DynamoDbNoteRepository implements NoteRepository {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(client: DynamoDBDocumentClient, table: string) {
    this.client = client;
    this.tableName = table;
  }

  async save(note: Note): Promise<Note> {
    try {
      const saveCommand = new PutCommand({
        TableName: this.tableName,
        Item: note,
      });

      await this.client.send(saveCommand);
      return note;
    } catch (error) {
      console.log("DynamoDbNoteRepository save error: ", error);
      throw error;
    }
  }

  async getById(id: string): Promise<Note | undefined> {
    try {
      const findByIdCommand = new GetCommand({
        TableName: this.tableName,
        Key: {
          id: id,
        },
      });

      const response = await this.client.send(findByIdCommand);
      return response.Item as Note | undefined;
    } catch (error) {
      console.log("DynamoDbNoteRepository 'get by id' error: ", error);
      throw error;
    }
  }

  async getAll(): Promise<Note[]> {
    try {
      const findAllCommand = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(findAllCommand);
      return (response.Items ?? []) as Note[];
    } catch (error) {
      console.log("DynamoDbNoteRepository 'get all' error: ", error);
      throw error;
    }
  }
}

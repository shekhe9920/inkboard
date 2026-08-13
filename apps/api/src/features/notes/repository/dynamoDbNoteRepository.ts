import type { Note, UpdateNoteInput } from "../types/noteTypes.js";
import type { NoteRepository } from "./noteRepository.js";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
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
      if (!note.title) {
        note.title = "New Note";
      }
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

  async update(id: string, input: UpdateNoteInput): Promise<Note | undefined> {
    try {
      const updates: string[] = [];
      const values: Record<string, unknown> = {};

      if (input.title !== undefined) {
        updates.push("title = :title");
        values[":title"] = input.title;
      }

      if (input.content !== undefined) {
        updates.push("content = :content");
        values[":content"] = input.content;
      }

      const now = new Date().toISOString();
      updates.push("updatedAt = :updatedAt");
      values[":updatedAt"] = now;

      const updateCommand = new UpdateCommand({
        TableName: this.tableName,
        Key: {
          id: id,
        },
        UpdateExpression: `SET ${updates.join(", ")}`,
        ExpressionAttributeValues: values,
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "ALL_NEW",
      });

      const response = await this.client.send(updateCommand);

      return response.Attributes as Note | undefined;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "ConditionalCheckFailedException"
      ) {
        return undefined;
      }

      console.log("DynamoDbNoteRepository 'update note' error: ", error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<Note | undefined> {
    try {
      const deleteByIdCommand = new DeleteCommand({
        TableName: this.tableName,
        Key: {
          id: id,
        },
        ReturnValues: "ALL_OLD",
      });

      const response = await this.client.send(deleteByIdCommand);
      return response.Attributes as Note | undefined;
    } catch (error) {
      console.log("DynamoDbNoteRepository 'delete by id' error: ", error);
      throw error;
    }
  }
}

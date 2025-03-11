export interface Project {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
}

export enum KnowledgeBaseTypeEnum {
  MYSQL = 1,
  PDF = 2,
  IMAGE = 3,
  VIDEO = 4,
  AUDIO = 5,
}

export interface KnowledgeBaseType {
  id: KnowledgeBaseTypeEnum;
  name: string;
  description: string;
}

export interface KnowledgeBase {
  id: string;
  status: KnowledgeBaseStatus;
  statusName: string;
  name: string;
  type: KnowledgeBaseTypeEnum;
  typeName: string;
  description: string;
  config: string;
  createdAt: string;
  updatedAt: string;
}

export enum KnowledgeBaseStatus {
  CREATED = 1,
  SYNCING = 2,
  SYNCED = 3,
  TRAINING = 4,
  TRAINED = 5,
  ERROR = 6,
}

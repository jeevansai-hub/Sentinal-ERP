import { v4 as uuidv4 } from 'uuid';

export interface AuditContext {
  operator: string;
  ipAddress: string;
}

export interface EnterpriseResponseEnvelope<T> {
  metadata: {
    correlationId: string;
    traceId: string;
    timestamp: string;
    auditContext: AuditContext;
  };
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  filtering?: Record<string, any>;
  data: T;
}

export function wrapResponse<T>(
  data: T,
  options?: {
    page?: number;
    limit?: number;
    totalCount?: number;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    filters?: Record<string, any>;
    operator?: string;
  }
): EnterpriseResponseEnvelope<T> {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const totalCount = options?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    metadata: {
      correlationId: uuidv4(),
      traceId: uuidv4(),
      timestamp: new Date().toISOString(),
      auditContext: {
        operator: options?.operator ?? 'admin@gmail.com',
        ipAddress: '127.0.0.1'
      }
    },
    ...(options?.totalCount !== undefined && {
      pagination: { page, limit, totalCount, totalPages }
    }),
    ...(options?.sortField !== undefined && {
      sorting: { field: options.sortField, direction: options.sortDirection ?? 'asc' }
    }),
    ...(options?.filters !== undefined && {
      filtering: options.filters
    }),
    data
  };
}

import prisma from '../config/database.js';

/**
 * Log an admin action to the audit_logs table.
 * Called from admin controller endpoints on every write operation.
 */
export async function logAuditEvent(
  actorId: number,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        targetType,
        targetId,
        metaData: metadata ?? undefined,
      },
    });
  } catch (err) {
    // Audit logging should never crash the main request
    console.error('[AuditLogger] Failed to log event:', err);
  }
}

import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../auth/auth.middleware';
import { ComplaintService } from './complaint.service';
import { ComplaintType, ComplaintStatus } from '../../utils/enums';

const createComplaintSchema = z.object({
  complaint_type: z.nativeEnum(ComplaintType),
  metadata: z.record(z.any())
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(ComplaintStatus)
});

export class ComplaintController {
  private complaintService = new ComplaintService();

  createComplaint = async (req: Request, res: Response) => {
    try {
      const { complaint_type, metadata } = createComplaintSchema.parse(req.body);
      const complaint = await this.complaintService.createComplaint(
        (req as AuthRequest).user!.id,
        complaint_type,
        metadata
      );
      res.status(201).json({ message: 'Complaint created successfully', data: complaint });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const complaintId = parseInt(req.params.id);
      const { status } = updateStatusSchema.parse(req.body);
      
      const complaint = await this.complaintService.updateComplaintStatus(
        complaintId,
        status,
        (req as AuthRequest).user!.id
      );
      
      res.json({ message: `Complaint status updated to ${status} successfully`, data: complaint });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getMetrics = async (req: Request, res: Response) => {
    try {
      const complaintId = parseInt(req.params.id);
      const metrics = await this.complaintService.getComplaintMetrics(complaintId, (req as AuthRequest).user!.id);
      res.json({ message: 'Complaint metrics retrieved successfully', data: metrics });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}
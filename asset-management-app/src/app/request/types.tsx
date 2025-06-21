export type RequestData = {
  request_id: string;
  asset_id: string;
  status: "waiting for approval" | "rejected" | "cancelled" | "approved";
  reason: string;
  request_date: string;
  created_date: string;
  update_at: string;
  created_by: string;
  update_by: string;
};